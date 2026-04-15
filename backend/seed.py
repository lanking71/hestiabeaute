"""
seed.py — 초기 데이터 입력 스크립트

실행 방법:
    cd backend
    python seed.py

실행하면:
    1. 관리자 비밀번호 해시를 생성하여 .env에 안내
    2. 카테고리 10개 초기 데이터 입력
"""

import sys
import os

# backend/ 디렉토리를 Python 경로에 추가
sys.path.insert(0, os.path.dirname(__file__))

from passlib.context import CryptContext
from app.database import SessionLocal, create_tables
from app.models import Category

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# ─────────────────────────────────────────
# 관리자 비밀번호 설정
# ─────────────────────────────────────────
ADMIN_PASSWORD = "hestia1234!"  # 운영 전 반드시 변경하세요

CATEGORIES = [
    {"sort_order": 1,  "name_ko": "스킨·토너·플루이드", "name_en": "SKIN TONER FLUID",  "slug": "skin-toner-fluid"},
    {"sort_order": 2,  "name_ko": "에센스·앰플",        "name_en": "ESSENCE AMPOULE",    "slug": "ampoule"},
    {"sort_order": 3,  "name_ko": "크림",               "name_en": "CREAM",              "slug": "cream"},
    {"sort_order": 4,  "name_ko": "파운데이션·쿠션",    "name_en": "FOUNDATION",         "slug": "foundation"},
    {"sort_order": 5,  "name_ko": "썬크림",             "name_en": "SUN CARE",           "slug": "sun-care"},
    {"sort_order": 6,  "name_ko": "클렌징",             "name_en": "CLEANSING",          "slug": "cleansing"},
    {"sort_order": 7,  "name_ko": "마스크팩·수딩젤",    "name_en": "MASK & SOOTHING",    "slug": "mask-soothing"},
    {"sort_order": 8,  "name_ko": "시카밤",             "name_en": "CICA BALM",          "slug": "cica-balm"},
    {"sort_order": 9,  "name_ko": "헬스마사지크림",     "name_en": "MASSAGE CREAM",      "slug": "massage-cream"},
    {"sort_order": 10, "name_ko": "세트·기획",          "name_en": "SET",                "slug": "set"},
]


def main():
    # 1. 테이블 생성
    create_tables()
    print("✓ DB 테이블 생성 완료")

    # 2. 관리자 비밀번호 해시 생성
    hashed = pwd_context.hash(ADMIN_PASSWORD)
    print(f"\n[ 관리자 비밀번호 해시 ]")
    print(f"  원본 비밀번호: {ADMIN_PASSWORD}")
    print(f"  해시값: {hashed}")
    print(f"\n  .env 파일의 ADMIN_PASSWORD_HASH 값을 아래로 교체하세요:")
    print(f"  ADMIN_PASSWORD_HASH={hashed}\n")

    # .env 파일 자동 업데이트
    env_path = os.path.join(os.path.dirname(__file__), ".env")
    if os.path.exists(env_path):
        with open(env_path, "r", encoding="utf-8") as f:
            content = f.read()
        lines = content.splitlines()
        new_lines = []
        for line in lines:
            if line.startswith("ADMIN_PASSWORD_HASH="):
                new_lines.append(f"ADMIN_PASSWORD_HASH={hashed}")
            else:
                new_lines.append(line)
        with open(env_path, "w", encoding="utf-8") as f:
            f.write("\n".join(new_lines))
        print("✓ .env ADMIN_PASSWORD_HASH 자동 업데이트 완료")

    # 3. 카테고리 초기 데이터 입력
    db = SessionLocal()
    try:
        inserted = 0
        skipped = 0
        for cat_data in CATEGORIES:
            existing = db.query(Category).filter(Category.slug == cat_data["slug"]).first()
            if existing:
                skipped += 1
                continue
            cat = Category(**cat_data)
            db.add(cat)
            inserted += 1
        db.commit()
        print(f"✓ 카테고리 입력 완료 — 신규: {inserted}개, 건너뜀: {skipped}개")
    finally:
        db.close()

    print("\n✓ 시드 완료! 서버를 시작하세요:")
    print("  uvicorn app.main:app --reload --port 8000")


if __name__ == "__main__":
    main()
