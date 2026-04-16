#!/bin/sh
# Docker 컨테이너 시작 시 실행되는 초기화 스크립트

set -e

echo "=== HESTIA Backend Starting ==="

# DB 테이블 생성 + 카테고리 시드 데이터 입력 (첫 실행 시만)
echo "Initializing database..."
python -c "
import sys, os
sys.path.insert(0, '/app')
from app.database import create_tables
create_tables()
print('Tables created.')
"

# 카테고리 시드 (없을 때만 입력)
python -c "
import sys
sys.path.insert(0, '/app')
from app.database import SessionLocal
from app.models import Category

db = SessionLocal()
try:
    count = db.query(Category).count()
    if count == 0:
        categories = [
            {'name_ko': '스킨·토너·플루이드', 'name_en': 'SKIN TONER FLUID', 'slug': 'skin-toner-fluid', 'sort_order': 1},
            {'name_ko': '에센스·앰플', 'name_en': 'ESSENCE AMPOULE', 'slug': 'ampoule', 'sort_order': 2},
            {'name_ko': '크림', 'name_en': 'CREAM', 'slug': 'cream', 'sort_order': 3},
            {'name_ko': '파운데이션·쿠션', 'name_en': 'FOUNDATION', 'slug': 'foundation', 'sort_order': 4},
            {'name_ko': '썬크림', 'name_en': 'SUN CARE', 'slug': 'sun-care', 'sort_order': 5},
            {'name_ko': '클렌징', 'name_en': 'CLEANSING', 'slug': 'cleansing', 'sort_order': 6},
            {'name_ko': '마스크팩·수딩젤', 'name_en': 'MASK & SOOTHING', 'slug': 'mask-soothing', 'sort_order': 7},
            {'name_ko': '시카밤', 'name_en': 'CICA BALM', 'slug': 'cica-balm', 'sort_order': 8},
            {'name_ko': '헬스마사지크림', 'name_en': 'MASSAGE CREAM', 'slug': 'massage-cream', 'sort_order': 9},
            {'name_ko': '세트·기획', 'name_en': 'SET', 'slug': 'set', 'sort_order': 10},
        ]
        for cat in categories:
            db.add(Category(**cat))
        db.commit()
        print(f'Seeded {len(categories)} categories.')
    else:
        print(f'Categories already exist ({count}), skipping seed.')
finally:
    db.close()
"

echo "Starting uvicorn..."
exec uvicorn app.main:app --host 0.0.0.0 --port 8000
