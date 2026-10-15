
from minio import Minio
from minio.error import S3Error
from dotenv import load_dotenv
import io
import os

load_dotenv()

                                                            
minio_client = Minio(
    endpoint=os.getenv("MINIO_ENDPOINT", "localhost:9000"),
    access_key=os.getenv("MINIO_ACCESS_KEY", "minioadmin"),
    secret_key=os.getenv("MINIO_SECRET_KEY", "minioadmin"),
    secure=os.getenv("MINIO_SECURE", "false").lower() == "true"
)

BUCKET_NAME = os.getenv("MINIO_BUCKET", "deepshield-uploads")


def ensure_bucket_exists():
    try:
        if not minio_client.bucket_exists(BUCKET_NAME):
            minio_client.make_bucket(BUCKET_NAME)
            print(f"✅ Created MinIO bucket: {BUCKET_NAME}")
    except S3Error as e:
        print(f"⚠️ MinIO bucket error: {e}")


async def upload_to_minio(contents: bytes, object_path: str, content_type: str) -> str:
    ensure_bucket_exists()
    
                                                          
    data = io.BytesIO(contents)
    
    minio_client.put_object(
        bucket_name=BUCKET_NAME,
        object_name=object_path,
        data=data,
        length=len(contents),
        content_type=content_type
    )
    
    return object_path


def download_from_minio(object_path: str) -> bytes:
    try:
        response = minio_client.get_object(BUCKET_NAME, object_path)
        return response.read()
    except S3Error:
                                               
        local_path = f"uploads/{object_path}"
        if os.path.exists(local_path):
            with open(local_path, "rb") as f:
                return f.read()
        raise FileNotFoundError(f"File not found in storage: {object_path}")
