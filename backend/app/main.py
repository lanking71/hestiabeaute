# =====================================================
# 📁 main.py — FastAPI 앱의 시작점 (메인 파일)
# =====================================================
# 이 파일은 웹 서버 프로그램 전체를 조립하는 파일이에요.
# 마치 레고 조각들(라우터들)을 하나로 합치고,
# 앱에 필요한 규칙들을 설정하는 역할을 해요.
#
# 역할:
#   1. FastAPI 앱 객체 생성
#   2. CORS 설정 (프론트엔드가 API를 호출할 수 있게 허용)
#   3. 정적 파일 서빙 (업로드된 이미지 제공)
#   4. 모든 라우터 연결
#   5. 앱 시작 시 DB 테이블 자동 생성
# =====================================================

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
from sqlalchemy.exc import OperationalError
from pathlib import Path

# 설정값 가져오기
from app.config import get_settings
# DB 테이블 생성 함수
from app.database import create_tables
# 공개 라우터 (누구나 접근 가능)
from app.routers import categories, products, inquiry, banners
# 관리자 라우터 (JWT 토큰 필요)
from app.routers.admin import auth, categories as admin_categories
from app.routers.admin import products as admin_products
from app.routers.admin import inquiry as admin_inquiry
from app.routers.admin import upload
from app.routers.admin import banners as admin_banners

settings = get_settings()

# 🚀 FastAPI 앱 생성
# - title, description, version: /docs 페이지에서 보이는 API 문서 정보
app = FastAPI(
    title="HESTIA Beauty API",
    description="헤스티아 뷰티 브랜드 웹사이트 백엔드 API",
    version="1.0.0",
)

# 🌐 CORS 설정 — 프론트엔드(Next.js)가 이 API를 호출할 수 있게 허용
# CORS: Cross-Origin Resource Sharing — 다른 주소에서 오는 요청 허용 규칙
# 브라우저는 기본적으로 다른 주소로의 API 요청을 막는데, 이걸 풀어주는 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,  # 허용할 주소 목록 (예: http://localhost:3000)
    allow_credentials=True,   # 쿠키/인증 정보 허용
    allow_methods=["*"],      # 모든 HTTP 메서드 허용 (GET, POST, PUT, DELETE 등)
    allow_headers=["*"],      # 모든 헤더 허용
)

# 📁 정적 파일 제공 설정
# /static/uploads/products/xxx.jpg 같은 URL로 업로드된 이미지에 접근 가능
app.mount("/static", StaticFiles(directory="static"), name="static")

# ─── 공개 라우터 등록 ─────────────────────────────
# 로그인 없이 누구나 접근 가능한 API들
app.include_router(categories.router)  # GET /api/categories
app.include_router(products.router)    # GET /api/products, GET /api/products/{slug}
app.include_router(inquiry.router)     # GET/POST /api/inquiry
app.include_router(banners.router)     # GET /api/banners

# ─── 관리자 라우터 등록 ──────────────────────────
# JWT 토큰이 있어야만 접근 가능한 API들
app.include_router(auth.router)              # POST /api/admin/login
app.include_router(admin_categories.router)  # CRUD /api/admin/categories
app.include_router(admin_products.router)    # CRUD /api/admin/products
app.include_router(admin_inquiry.router)     # /api/admin/inquiry
app.include_router(upload.router)            # POST /api/admin/upload
app.include_router(admin_banners.router)     # CRUD /api/admin/banners


@app.exception_handler(OperationalError)
async def db_lock_handler(request: Request, exc: OperationalError):
    """SQLite 잠금 에러를 503으로 변환 — CORS 헤더 포함"""
    return JSONResponse(
        status_code=503,
        content={"detail": "서버가 잠시 바쁩니다. 잠시 후 다시 시도해 주세요."},
    )


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """예상치 못한 에러 — 500 반환 (CORS 헤더 보장)"""
    return JSONResponse(
        status_code=500,
        content={"detail": "서버 오류가 발생했습니다. 잠시 후 다시 시도해 주세요."},
    )


@app.on_event("startup")
def on_startup():
    """
    앱이 시작될 때 자동으로 실행되는 함수

    uvicorn을 실행하면 이 함수가 먼저 호출되어
    hestia.db 파일에 테이블들을 자동으로 생성해줘요.
    (이미 있으면 건드리지 않음)
    """
    create_tables()


@app.get("/")
def root():
    """
    루트 경로 (/) — API 서버가 정상 작동하는지 확인용
    http://localhost:8000/ 접속 시 이 메시지가 보여요.
    API 문서는 http://localhost:8000/docs 에서 확인하세요.
    """
    return {"message": "HESTIA Beauty API", "docs": "/docs"}
