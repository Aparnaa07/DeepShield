import subprocess
import sys
import os
import time
import signal

project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
backend_dir = os.path.join(project_root, "backend")
frontend_dir = os.path.join(project_root, "frontend")
python_exe = os.path.join(backend_dir, "venv", "Scripts", "python.exe")
if not os.path.exists(python_exe):
    python_exe = sys.executable

env = os.environ.copy()
env["NO_PROXY"] = "localhost,127.0.0.1"
env["no_proxy"] = "localhost,127.0.0.1"

print("=" * 60)
print("  Starting DeepShield Application Suite")
print("  - Backend:  http://localhost:8000 (API & Docs: /docs)")
print("  - Frontend: http://localhost:3000 (Web Dashboard)")
print("=" * 60)

# 1. Start Backend FastAPI
backend_proc = subprocess.Popen(
    [python_exe, "-m", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"],
    cwd=backend_dir,
    env=env
)
print("🚀 Backend API server started on pid:", backend_proc.pid)

# 2. Start Frontend Next.js
frontend_proc = subprocess.Popen(
    ["npm.cmd", "run", "dev"],
    cwd=frontend_dir,
    env=env
)
print("🚀 Frontend development server started on pid:", frontend_proc.pid)

try:
    while True:
        time.sleep(1)
        if backend_proc.poll() is not None:
            print("Backend process exited with code:", backend_proc.returncode)
            break
        if frontend_proc.poll() is not None:
            print("Frontend process exited with code:", frontend_proc.returncode)
            break
except KeyboardInterrupt:
    print("\nShutting down DeepShield...")
    backend_proc.terminate()
    frontend_proc.terminate()
