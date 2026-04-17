# =====================================================
# 📁 database.py — 데이터베이스 연결 설정
# =====================================================
# 이 파일은 프로그램과 데이터베이스(hestia.db)를
# 연결해주는 다리 역할을 해요.
# 데이터베이스는 엑셀 파일처럼 정보를 저장하는 공간인데,
# 이 파일이 그 공간의 문을 열고 닫아 줘요.
# =====================================================

# SQLAlchemy: 파이썬에서 데이터베이스를 쉽게 다룰 수 있게 해주는 도구
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# 설정값을 가져오기
from app.config import get_settings

settings = get_settings()

# 🔌 데이터베이스 엔진 생성 — 실제로 DB 파일에 연결하는 부분
# check_same_thread=False: SQLite는 기본적으로 하나의 실행 흐름(thread)에서만
# 쓸 수 있는데, FastAPI는 여러 요청을 동시에 처리해야 하므로 이 제한을 풀어줘요
engine = create_engine(
    settings.database_url,
    connect_args={"check_same_thread": False},  # SQLite 전용 설정
)

# 📋 세션 팩토리 — DB 작업을 할 때 사용하는 "작업 노트" 생성기
# autocommit=False: 작업을 한 번에 묶어서 실패 시 전부 되돌릴 수 있음
# autoflush=False: 즉시 저장하지 않고 모아두었다가 한 번에 처리
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# 🏗️ 모든 DB 테이블 클래스의 부모 — models.py에서 이걸 상속받아 테이블을 만들어요
Base = declarative_base()


def get_db():
    """
    FastAPI 의존성 주입용 DB 세션 생성기

    사용법: 라우터 함수에서 db: Session = Depends(get_db) 로 호출
    → 요청이 시작할 때 DB 연결을 열고, 끝날 때 자동으로 닫아줘요.
    마치 도서관 책을 빌릴 때 반납을 보장해주는 것처럼요.
    """
    db = SessionLocal()  # DB 연결 열기
    try:
        yield db  # 연결된 db를 라우터 함수에게 빌려주기
    finally:
        db.close()  # 함수가 끝나면 반드시 연결 닫기 (메모리 낭비 방지)


def create_tables():
    """
    앱 시작 시 테이블 자동 생성

    hestia.db 파일에 categories, products, inquiries 테이블이 없으면 새로 만들어요.
    이미 있으면 그냥 넘어가요. (기존 데이터를 지우지 않음)
    """
    from app import models  # noqa: F401 — models.py를 import해야 Base에 테이블이 등록됨
    Base.metadata.create_all(bind=engine)  # 등록된 모든 테이블을 DB에 생성
