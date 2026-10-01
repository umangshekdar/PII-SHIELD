from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import os
from app.config import settings
from app.routes import scan, redact, download, demo, health

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Ensure temp dir exists; clean stale files best-effort
    os.makedirs(settings.TEMP_DIR, exist_ok=True)
    for f in os.listdir(settings.TEMP_DIR):
        try:
            fp = os.path.join(settings.TEMP_DIR, f)
            if os.path.isfile(fp):
                os.remove(fp)
        except OSError:
            pass  # skip locked / in-use files
    yield

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(scan.router)
app.include_router(redact.router)
app.include_router(download.router)
app.include_router(demo.router)
app.include_router(health.router)
