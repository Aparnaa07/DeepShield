import os
import sqlite3
import json
import uuid
import copy
import socket
from typing import Any, Dict, List, Optional
from dotenv import load_dotenv
from sqlalchemy import create_engine, text
from sqlalchemy.orm import declarative_base, sessionmaker

load_dotenv()

# Anchor database paths to backend directory so all tools and scripts access the same file
BACKEND_DIR = os.path.abspath(os.path.dirname(__file__))
DEFAULT_SQLITE_PATH = os.path.join(BACKEND_DIR, "deepshield.db")
DEFAULT_SQLITE_URL = f"sqlite:///{DEFAULT_SQLITE_PATH.replace(os.sep, '/')}"
DEFAULT_DOCS_DB_PATH = os.path.join(BACKEND_DIR, "deepshield_docs.db")

# ── Relational Database (SQLAlchemy) ──────────────────────────────────────────
# Supports PostgreSQL (in Docker/Cloud) with automatic fallback to SQLite for local development
DATABASE_URL = os.getenv("DATABASE_URL", DEFAULT_SQLITE_URL)
if DATABASE_URL.startswith("postgresql://"):
    DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+psycopg2://", 1)

engine = None
if "sqlite" in DATABASE_URL:
    engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
else:
    try:
        test_engine = create_engine(DATABASE_URL, connect_args={"connect_timeout": 1})
        with test_engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        engine = test_engine
        print(f"Connected to PostgreSQL database: {DATABASE_URL.split('@')[-1] if '@' in DATABASE_URL else DATABASE_URL}")
    except Exception as e:
        print(f"[DeepShield] PostgreSQL unavailable ({type(e).__name__}). Using local SQLite database.")
        DATABASE_URL = DEFAULT_SQLITE_URL
        engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ── Document Store (MongoDB vs High-Performance Local Document Store) ─────────
class InsertResult:
    def __init__(self, inserted_id):
        self.inserted_id = inserted_id


class LocalCursor:
    def __init__(self, items: List[Dict[str, Any]]):
        self._items = items

    def sort(self, key: str, direction: int = -1):
        reverse = direction < 0
        def _sort_key(x):
            v = x.get(key)
            return "" if v is None else str(v)
        self._items.sort(key=_sort_key, reverse=reverse)
        return self

    def skip(self, n: int):
        self._items = self._items[n:]
        return self

    def limit(self, n: int):
        self._items = self._items[:n]
        return self

    async def to_list(self, length: Optional[int] = None) -> List[Dict[str, Any]]:
        if length is not None:
            return copy.deepcopy(self._items[:length])
        return copy.deepcopy(self._items)


def _matches_filter(doc: Dict[str, Any], flt: Dict[str, Any]) -> bool:
    for k, v in flt.items():
        if "." in k:
            cur = doc
            for part in k.split("."):
                if isinstance(cur, dict):
                    cur = cur.get(part)
                else:
                    cur = None
                    break
            if cur != v:
                return False
        else:
            if doc.get(k) != v:
                return False
    return True


def _apply_projection(doc: Dict[str, Any], proj: Optional[Dict[str, Any]]) -> Dict[str, Any]:
    res = copy.deepcopy(doc)
    if not proj:
        return res
    for k, v in proj.items():
        if v == 0 and k in res:
            res.pop(k, None)
    return res


def _set_nested(d: dict, path: str, val: Any):
    parts = path.split(".")
    cur = d
    for part in parts[:-1]:
        if part not in cur or not isinstance(cur[part], dict):
            cur[part] = {}
        cur = cur[part]
    cur[parts[-1]] = val


class LocalCollection:
    def __init__(self, name: str, db_path: str = DEFAULT_DOCS_DB_PATH):
        self.name = name
        self.db_path = db_path
        self._init_db()

    def _get_connection(self):
        return sqlite3.connect(self.db_path)

    def _init_db(self):
        os.makedirs(os.path.dirname(os.path.abspath(self.db_path)), exist_ok=True)
        with self._get_connection() as conn:
            conn.execute(f"""
                CREATE TABLE IF NOT EXISTS {self.name} (
                    id TEXT PRIMARY KEY,
                    data TEXT
                )
            """)
            conn.commit()

    def _get_all(self) -> List[Dict[str, Any]]:
        with self._get_connection() as conn:
            cur = conn.cursor()
            cur.execute(f"SELECT data FROM {self.name}")
            rows = cur.fetchall()
            docs = []
            for (data_str,) in rows:
                try:
                    docs.append(json.loads(data_str))
                except Exception:
                    pass
            return docs

    def _save_doc(self, doc_id: str, doc: Dict[str, Any]):
        with self._get_connection() as conn:
            conn.execute(
                f"INSERT OR REPLACE INTO {self.name} (id, data) VALUES (?, ?)",
                (doc_id, json.dumps(doc))
            )
            conn.commit()

    async def insert_one(self, doc: Dict[str, Any]):
        d = copy.deepcopy(doc)
        doc_id = d.get("job_id") or d.get("id") or str(uuid.uuid4())
        if "_id" not in d:
            d["_id"] = doc_id
        self._save_doc(doc_id, d)
        return InsertResult(inserted_id=d["_id"])

    async def find_one(self, filter: Dict[str, Any], projection: Optional[Dict[str, Any]] = None) -> Optional[Dict[str, Any]]:
        docs = self._get_all()
        for doc in docs:
            if _matches_filter(doc, filter):
                return _apply_projection(doc, projection)
        return None

    def find(self, filter: Optional[Dict[str, Any]] = None, projection: Optional[Dict[str, Any]] = None) -> LocalCursor:
        flt = filter or {}
        docs = self._get_all()
        matched = [
            _apply_projection(doc, projection)
            for doc in docs
            if _matches_filter(doc, flt)
        ]
        return LocalCursor(matched)

    async def update_one(self, filter: Dict[str, Any], update: Dict[str, Any]):
        docs = self._get_all()
        for doc in docs:
            if _matches_filter(doc, filter):
                doc_id = doc.get("job_id") or doc.get("id") or doc.get("_id")
                if "$set" in update:
                    for k, v in update["$set"].items():
                        _set_nested(doc, k, v)
                self._save_doc(doc_id, doc)
                return {"matched_count": 1, "modified_count": 1}
        return {"matched_count": 0, "modified_count": 0}

    async def delete_one(self, filter: Dict[str, Any]):
        docs = self._get_all()
        for doc in docs:
            if _matches_filter(doc, filter):
                doc_id = doc.get("job_id") or doc.get("id") or doc.get("_id")
                with self._get_connection() as conn:
                    conn.execute(f"DELETE FROM {self.name} WHERE id = ?", (doc_id,))
                    conn.commit()
                return {"deleted_count": 1}
        return {"deleted_count": 0}

    async def delete_many(self, filter: Dict[str, Any]):
        if not filter:
            with self._get_connection() as conn:
                conn.execute(f"DELETE FROM {self.name}")
                conn.commit()
            return {"deleted_count": -1}
        docs = self._get_all()
        deleted = 0
        for doc in docs:
            if _matches_filter(doc, filter):
                doc_id = doc.get("job_id") or doc.get("id") or doc.get("_id")
                with self._get_connection() as conn:
                    conn.execute(f"DELETE FROM {self.name} WHERE id = ?", (doc_id,))
                    conn.commit()
                deleted += 1
        return {"deleted_count": deleted}

    async def count_documents(self, filter: Dict[str, Any]) -> int:
        flt = filter or {}
        docs = self._get_all()
        return sum(1 for doc in docs if _matches_filter(doc, flt))


def _check_port(host: str, port: int) -> bool:
    try:
        s = socket.socket()
        s.settimeout(0.3)
        s.connect((host, port))
        s.close()
        return True
    except Exception:
        return False


MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")
MONGO_DB = os.getenv("MONGO_DB", "deepshield")

mongo_available = False
try:
    if "localhost" in MONGO_URL or "127.0.0.1" in MONGO_URL:
        mongo_available = _check_port("localhost", 27017)
except Exception:
    mongo_available = False

if mongo_available:
    try:
        from motor.motor_asyncio import AsyncIOMotorClient
        mongo_client = AsyncIOMotorClient(MONGO_URL, serverSelectionTimeoutMS=1000)
        mongo_db = mongo_client[MONGO_DB]
        analysis_collection = mongo_db["analyses"]
        jobs_collection = mongo_db["jobs"]
        print(f"Connected to MongoDB at {MONGO_URL}/{MONGO_DB}")
    except Exception as e:
        print(f"[DeepShield] Motor connection error: {e}. Using local document collection.")
        mongo_client = None
        mongo_db = None
        analysis_collection = LocalCollection("analyses")
        jobs_collection = LocalCollection("jobs")
else:
    print(f"[DeepShield] MongoDB offline. Using local document collection: {DEFAULT_DOCS_DB_PATH}")
    mongo_client = None
    mongo_db = None
    analysis_collection = LocalCollection("analyses")
    jobs_collection = LocalCollection("jobs")
