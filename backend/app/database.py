from sqlalchemy import create_engine, event
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

from app.config import get_settings

settings = get_settings()

engine = create_engine(
    settings.database_url,
    connect_args={
        "check_same_thread": False,
        "timeout": 30,          # 30초 대기 후 포기 (기본값 5초)
    },
    pool_pre_ping=True,         # 연결 유효성 사전 확인
)

@event.listens_for(engine, "connect")
def set_sqlite_pragmas(dbapi_connection, connection_record):
    """SQLite 성능/안정성 설정 — 연결 시 자동 적용"""
    cursor = dbapi_connection.cursor()
    cursor.execute("PRAGMA journal_mode=WAL")       # 동시 읽기/쓰기 성능 대폭 향상
    cursor.execute("PRAGMA busy_timeout=30000")     # 잠금 대기 30초 (밀리초 단위)
    cursor.execute("PRAGMA synchronous=NORMAL")     # WAL 모드에서 안전하고 빠른 설정
    cursor.execute("PRAGMA cache_size=-64000")      # 64MB 캐시
    cursor.close()

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def create_tables():
    from app import models  # noqa: F401
    Base.metadata.create_all(bind=engine)
