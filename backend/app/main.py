from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pathlib import Path

from app.config import get_settings
from app.database import create_tables
from app.routers import categories, products, inquiry, banners
from app.routers.admin import auth, categories as admin_categories
from app.routers.admin import products as admin_products
from app.routers.admin import inquiry as admin_inquiry
from app.routers.admin import upload
from app.routers.admin import banners as admin_banners

settings = get_settings()

app = FastAPI(
    title="HESTIA Beauty API",
    description="헤스티아 뷰티 브랜드 웹사이트 백엔드 API",
    version="1.0.0",
)

# CORS 설정 — 프론트엔드(Next.js) 허용
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 정적 파일 (업로드 이미지) 서빙
uploads_path = Path(settings.upload_dir).parent.parent  # static/
app.mount("/static", StaticFiles(directory="static"), name="static")

# 공개 라우터 등록
app.include_router(categories.router)
app.include_router(products.router)
app.include_router(inquiry.router)
app.include_router(banners.router)

# 관리자 라우터 등록
app.include_router(auth.router)
app.include_router(admin_categories.router)
app.include_router(admin_products.router)
app.include_router(admin_inquiry.router)
app.include_router(upload.router)
app.include_router(admin_banners.router)


@app.on_event("startup")
def on_startup():
    """앱 시작 시 DB 테이블 자동 생성"""
    create_tables()


@app.get("/")
def root():
    return {"message": "HESTIA Beauty API", "docs": "/docs"}
