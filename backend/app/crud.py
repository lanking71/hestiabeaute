# =====================================================
# 📁 crud.py — 데이터베이스 읽기/쓰기 함수 모음
# =====================================================
# CRUD = Create(만들기) / Read(읽기) / Update(수정) / Delete(삭제)
#
# 이 파일은 데이터베이스와 직접 대화하는 모든 함수를
# 한 곳에 모아두는 파일이에요.
#
# 규칙: 라우터(categories.py, products.py 등)에서는
# 직접 DB에 접근하면 안 되고, 반드시 이 파일의
# 함수를 통해서만 접근해야 해요.
# (학교에서 선생님께 직접 가지 않고 반장을 통해 전달하는 것처럼!)
# =====================================================

import math  # 페이지 수 계산용 (올림 함수 사용)
from sqlalchemy.orm import Session  # DB 세션 타입
from sqlalchemy import or_          # OR 조건 검색용
from passlib.context import CryptContext  # 비밀번호 암호화 도구
from app import models, schemas

# 🔒 비밀번호 암호화 설정 (bcrypt 방식)
# bcrypt: 비밀번호를 알아볼 수 없는 문자열로 바꿔주는 알고리즘
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


# ─────────────────────────────────────────
# 🔒 비밀번호 관련 함수
# ─────────────────────────────────────────

def hash_password(password: str) -> str:
    """
    평문 비밀번호를 암호화하기
    예) "abc123" → "$2b$12$KIXtj..." (알아볼 수 없는 문자열)
    이렇게 저장하면 DB가 해킹당해도 원래 비밀번호를 알 수 없어요.
    """
    return pwd_context.hash(password)


def verify_password(plain: str, hashed: str) -> bool:
    """
    입력한 비밀번호가 저장된 암호화 비밀번호와 같은지 확인
    plain: 사용자가 입력한 평문 비밀번호
    hashed: DB에 저장된 암호화된 비밀번호
    반환: 같으면 True, 다르면 False
    """
    return pwd_context.verify(plain, hashed)


# ─────────────────────────────────────────
# 📂 카테고리 CRUD 함수들
# ─────────────────────────────────────────

def get_categories(db: Session, active_only: bool = True) -> list[models.Category]:
    """
    카테고리 목록 전체 가져오기
    active_only=True: 활성 카테고리만 (화면에 보이는 것들만)
    sort_order 순서대로 정렬해서 반환
    """
    q = db.query(models.Category)
    if active_only:
        # is_active가 True인 것만 필터링
        q = q.filter(models.Category.is_active == True)
    return q.order_by(models.Category.sort_order).all()


def get_category(db: Session, category_id: int) -> models.Category | None:
    """
    id로 특정 카테고리 1개 가져오기
    없으면 None 반환
    """
    return db.query(models.Category).filter(models.Category.id == category_id).first()


def get_category_by_slug(db: Session, slug: str) -> models.Category | None:
    """
    슬러그(slug)로 카테고리 찾기
    예) slug="cream" → 크림 카테고리 반환
    """
    return db.query(models.Category).filter(models.Category.slug == slug).first()


def create_category(db: Session, data: schemas.CategoryCreate) -> models.Category:
    """
    새 카테고리 만들기
    1. 스키마 데이터를 모델 객체로 변환
    2. DB에 추가
    3. 저장 (commit)
    4. 저장된 최신 데이터로 갱신 (refresh)
    5. 완성된 객체 반환
    """
    obj = models.Category(**data.model_dump())  # 딕셔너리를 Category 모델로 변환
    db.add(obj)     # DB에 추가 예약
    db.commit()     # 실제로 저장
    db.refresh(obj) # DB에서 최신 데이터(자동 생성 id, created_at 등) 불러오기
    return obj


def update_category(db: Session, category_id: int, data: schemas.CategoryUpdate) -> models.Category | None:
    """
    카테고리 정보 수정하기
    변경된 항목만 골라서 업데이트 (exclude_unset=True)
    없는 카테고리면 None 반환
    """
    obj = get_category(db, category_id)
    if not obj:
        return None
    # 수정된 항목만 반복하여 값 변경
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(obj, field, value)  # obj.field = value 와 같은 역할
    db.commit()
    db.refresh(obj)
    return obj


def delete_category(db: Session, category_id: int) -> bool:
    """
    카테고리 완전히 삭제하기
    없는 카테고리면 False 반환
    성공하면 True 반환
    """
    obj = get_category(db, category_id)
    if not obj:
        return False
    db.delete(obj)  # 삭제 예약
    db.commit()     # 실제 삭제
    return True


# ─────────────────────────────────────────
# 💄 제품 CRUD 함수들
# ─────────────────────────────────────────

def get_products(
    db: Session,
    category_slug: str | None = None,  # 특정 카테고리만 보려면 슬러그 전달
    bestseller: bool | None = None,     # True면 베스트셀러만
    is_new: bool | None = None,         # True면 신제품만
    active_only: bool = True,           # True면 활성 제품만
    page: int = 1,                      # 몇 번째 페이지? (1부터 시작)
    size: int = 20,                     # 한 페이지에 몇 개?
) -> dict:
    """
    제품 목록 가져오기 (페이징 포함)

    반환 형식:
    {
        "items": [제품1, 제품2, ...],  # 현재 페이지의 제품들
        "total": 150,                  # 전체 제품 수
        "page": 1,                     # 현재 페이지
        "size": 20,                    # 페이지당 개수
        "pages": 8                     # 전체 페이지 수
    }
    """
    q = db.query(models.Product)

    # 조건에 맞는 것만 필터링
    if active_only:
        q = q.filter(models.Product.is_active == True)
    if category_slug:
        # 카테고리 테이블과 연결(join)하여 슬러그로 필터링
        q = q.join(models.Category).filter(models.Category.slug == category_slug)
    if bestseller is not None:
        q = q.filter(models.Product.is_bestseller == bestseller)
    if is_new is not None:
        q = q.filter(models.Product.is_new == is_new)

    total = q.count()  # 조건에 맞는 총 개수
    # offset: 앞에서 몇 개를 건너뛸지 (페이지 계산)
    # limit: 최대 몇 개까지 가져올지
    items = q.order_by(models.Product.sort_order, models.Product.id).offset((page - 1) * size).limit(size).all()
    return {
        "items": items,
        "total": total,
        "page": page,
        "size": size,
        "pages": math.ceil(total / size) if total else 0  # 올림 계산 (예: 25개, 10개씩 → 3페이지)
    }


def get_product(db: Session, product_id: int) -> models.Product | None:
    """id로 제품 1개 가져오기"""
    return db.query(models.Product).filter(models.Product.id == product_id).first()


def get_product_by_slug(db: Session, slug: str) -> models.Product | None:
    """슬러그로 제품 찾기 (활성 제품만)"""
    return db.query(models.Product).filter(models.Product.slug == slug, models.Product.is_active == True).first()


def create_product(db: Session, data: schemas.ProductCreate) -> models.Product:
    """새 제품 등록하기"""
    obj = models.Product(**data.model_dump())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


def update_product(db: Session, product_id: int, data: schemas.ProductUpdate) -> models.Product | None:
    """제품 정보 수정하기 (변경된 항목만 업데이트)"""
    obj = get_product(db, product_id)
    if not obj:
        return None
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(obj, field, value)
    db.commit()
    db.refresh(obj)
    return obj


def delete_product(db: Session, product_id: int) -> bool:
    """제품 삭제하기 (실제 DB에서 완전히 제거)"""
    obj = get_product(db, product_id)
    if not obj:
        return False
    db.delete(obj)
    db.commit()
    return True


# ─────────────────────────────────────────
# 💬 문의 게시판 CRUD 함수들
# ─────────────────────────────────────────

def get_inquiries(
    db: Session,
    unanswered_first: bool = False,  # True면 미답변 문의를 앞에 표시
    page: int = 1,
    size: int = 20,
) -> dict:
    """
    문의 목록 가져오기 (페이징 포함)
    unanswered_first=True: 관리자 페이지에서 미답변 문의를 먼저 보여주기 위해 사용
    """
    q = db.query(models.Inquiry)
    if unanswered_first:
        # is_answered 오름차순(False=0이 먼저) + 작성일 내림차순(최신 먼저)
        q = q.order_by(models.Inquiry.is_answered, models.Inquiry.created_at.desc())
    else:
        # 최신 문의가 먼저 보이도록
        q = q.order_by(models.Inquiry.created_at.desc())

    total = q.count()
    items = q.offset((page - 1) * size).limit(size).all()
    return {"items": items, "total": total, "page": page, "size": size, "pages": math.ceil(total / size) if total else 0}


def get_inquiry(db: Session, inquiry_id: int) -> models.Inquiry | None:
    """id로 특정 문의 1개 가져오기"""
    return db.query(models.Inquiry).filter(models.Inquiry.id == inquiry_id).first()


def create_inquiry(db: Session, data: schemas.InquiryCreate) -> models.Inquiry:
    """
    새 문의 등록하기
    비밀번호는 hash_password()로 암호화하여 저장
    (평문 그대로 저장하면 DB가 해킹당했을 때 위험해요)
    """
    obj = models.Inquiry(
        product_id=data.product_id,
        author_name=data.author_name,
        author_email=data.author_email,
        title=data.title,
        content=data.content,
        password=hash_password(data.password),  # 비밀번호 암호화 후 저장!
        is_secret=data.is_secret,
    )
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


def answer_inquiry(db: Session, inquiry_id: int, answer: str) -> models.Inquiry | None:
    """
    관리자가 문의에 답변 달기
    답변 내용, 답변 시각, 답변 완료 여부를 함께 저장
    """
    from datetime import datetime, timezone
    obj = get_inquiry(db, inquiry_id)
    if not obj:
        return None
    obj.answer = answer                              # 답변 내용 저장
    obj.is_answered = True                           # "답변 완료" 표시
    obj.answered_at = datetime.now(timezone.utc)    # 답변한 시각 기록
    db.commit()
    db.refresh(obj)
    return obj


def delete_inquiry(db: Session, inquiry_id: int) -> bool:
    """문의 삭제하기"""
    obj = get_inquiry(db, inquiry_id)
    if not obj:
        return False
    db.delete(obj)
    db.commit()
    return True


# ─────────────────────────────────────────
# 🖼️ 배너 CRUD 함수들
# ─────────────────────────────────────────

def get_banners(db: Session, active_only: bool = True) -> list[models.Banner]:
    """배너 목록 가져오기 (sort_order 순서대로)"""
    q = db.query(models.Banner)
    if active_only:
        q = q.filter(models.Banner.is_active == True)
    return q.order_by(models.Banner.sort_order).all()


def get_banner(db: Session, banner_id: int) -> models.Banner | None:
    """id로 배너 1개 가져오기"""
    return db.query(models.Banner).filter(models.Banner.id == banner_id).first()


def create_banner(db: Session, data: schemas.BannerCreate) -> models.Banner:
    """새 배너 만들기"""
    obj = models.Banner(**data.model_dump())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


def update_banner(db: Session, banner_id: int, data: schemas.BannerUpdate) -> models.Banner | None:
    """배너 수정하기"""
    obj = get_banner(db, banner_id)
    if not obj:
        return None
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(obj, field, value)
    db.commit()
    db.refresh(obj)
    return obj


def delete_banner(db: Session, banner_id: int) -> bool:
    """배너 삭제하기"""
    obj = get_banner(db, banner_id)
    if not obj:
        return False
    db.delete(obj)
    db.commit()
    return True
