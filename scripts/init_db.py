import sys
import os

# 1. Add backend directory to sys.path at runtime
BACKEND_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend"))
if BACKEND_DIR not in sys.path:
    sys.path.insert(0, BACKEND_DIR)

# 2. Add root directory to sys.path at runtime
ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if ROOT_DIR not in sys.path:
    sys.path.insert(0, ROOT_DIR)

from dotenv import load_dotenv
load_dotenv(os.path.join(BACKEND_DIR, ".env"))

import bcrypt

# 3. Dual-import support: works with both direct module execution and IDE static analysis (Pylance/Pyright)
try:
    # pyrefly: ignore[missing-import]
    from database import engine, Base, SessionLocal
    import models
    from models import User, Case
except ImportError:
    from backend.database import engine, Base, SessionLocal  # type: ignore
    from backend import models  # type: ignore
    from backend.models import User, Case  # type: ignore


def get_hashed_password(password: str) -> str:
    pwd_bytes = password.encode("utf-8")[:72]
    return bcrypt.hashpw(pwd_bytes, bcrypt.gensalt()).decode("utf-8")


def init():
    print("=" * 60)
    print("  DeepShield — Database Initialization")
    print("=" * 60)
    try:
        # Create all SQLAlchemy tables (users, cases)
        Base.metadata.create_all(bind=engine)
        print("✅ Relational tables created successfully! (users, cases)")
        print(f"   Database URL: {engine.url}")

        # Seed initial admin account
        db = SessionLocal()
        try:
            admin = db.query(User).filter(
                (User.username == "admin") | (User.email == "admin@deepshield.io")
            ).first()
            if not admin:
                admin = User(
                    email="admin@deepshield.io",
                    username="admin",
                    hashed_password=get_hashed_password("admin123")
                )
                db.add(admin)
                db.commit()
                print("\n✅ Default admin user created:")
                print("   Email:    admin@deepshield.io")
                print("   Username: admin")
                print("   Password: admin123")
            else:
                print("\n✅ Admin user confirmed active:")
                print("   Email:    admin@deepshield.io")
                print("   Username: admin")
        finally:
            db.close()

        print("\n" + "=" * 60)
        print("  Database initialization complete!")
        print("=" * 60)
        return True

    except Exception as e:
        print(f"❌ Error during database initialization: {e}")
        import traceback
        traceback.print_exc()
        return False


if __name__ == "__main__":
    success = init()
    if not success:
        sys.exit(1)
