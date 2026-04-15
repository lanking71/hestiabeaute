import math
from sqlalchemy.orm import Session
from sqlalchemy import or_
from passlib.context import CryptContext
from app import models, schemas

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)


# ─────────────────────────────────────────
# Category CRUD
# ─────────────────────────────────────────

def get_categories(db: Session, active_only: bool = True) -> list[models.Category]:
    q = db.query(models.Category)
    if active_only:
        q = q.filter(models.Category.is_active == True)
    return q.order_by(models.Category.sort_order).all()


def get_category(db: Session, category_id: int) -> models.Category | None:
    return db.query(models.Category).filter(models.Category.id == category_id).first()


def get_category_by_slug(db: Session, slug: str) -> models.Category | None:
    return db.query(models.Category).filter(models.Category.slug == slug).first()


def create_category(db: Session, data: schemas.CategoryCreate) -> models.Category:
    obj = models.Category(**data.model_dump())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


def update_category(db: Session, category_id: int, data: schemas.CategoryUpdate) -> models.Category | None:
    obj = get_category(db, category_id)
    if not obj:
        return None
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(obj, field, value)
    db.commit()
    db.refresh(obj)
    return obj


def delete_category(db: Session, category_id: int) -> bool:
    obj = get_category(db, category_id)
    if not obj:
        return False
    db.delete(obj)
    db.commit()
    return True


# ─────────────────────────────────────────
# Product CRUD
# ─────────────────────────────────────────

def get_products(
    db: Session,
    category_slug: str | None = None,
    bestseller: bool | None = None,
    is_new: bool | None = None,
    active_only: bool = True,
    page: int = 1,
    size: int = 20,
) -> dict:
    q = db.query(models.Product)
    if active_only:
        q = q.filter(models.Product.is_active == True)
    if category_slug:
        q = q.join(models.Category).filter(models.Category.slug == category_slug)
    if bestseller is not None:
        q = q.filter(models.Product.is_bestseller == bestseller)
    if is_new is not None:
        q = q.filter(models.Product.is_new == is_new)

    total = q.count()
    items = q.order_by(models.Product.sort_order, models.Product.id).offset((page - 1) * size).limit(size).all()
    return {"items": items, "total": total, "page": page, "size": size, "pages": math.ceil(total / size) if total else 0}


def get_product(db: Session, product_id: int) -> models.Product | None:
    return db.query(models.Product).filter(models.Product.id == product_id).first()


def get_product_by_slug(db: Session, slug: str) -> models.Product | None:
    return db.query(models.Product).filter(models.Product.slug == slug, models.Product.is_active == True).first()


def create_product(db: Session, data: schemas.ProductCreate) -> models.Product:
    obj = models.Product(**data.model_dump())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


def update_product(db: Session, product_id: int, data: schemas.ProductUpdate) -> models.Product | None:
    obj = get_product(db, product_id)
    if not obj:
        return None
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(obj, field, value)
    db.commit()
    db.refresh(obj)
    return obj


def delete_product(db: Session, product_id: int) -> bool:
    """소프트 삭제 — is_active=False로 변경"""
    obj = get_product(db, product_id)
    if not obj:
        return False
    obj.is_active = False
    db.commit()
    return True


# ─────────────────────────────────────────
# Inquiry CRUD
# ─────────────────────────────────────────

def get_inquiries(
    db: Session,
    unanswered_first: bool = False,
    page: int = 1,
    size: int = 20,
) -> dict:
    q = db.query(models.Inquiry)
    if unanswered_first:
        q = q.order_by(models.Inquiry.is_answered, models.Inquiry.created_at.desc())
    else:
        q = q.order_by(models.Inquiry.created_at.desc())

    total = q.count()
    items = q.offset((page - 1) * size).limit(size).all()
    return {"items": items, "total": total, "page": page, "size": size, "pages": math.ceil(total / size) if total else 0}


def get_inquiry(db: Session, inquiry_id: int) -> models.Inquiry | None:
    return db.query(models.Inquiry).filter(models.Inquiry.id == inquiry_id).first()


def create_inquiry(db: Session, data: schemas.InquiryCreate) -> models.Inquiry:
    obj = models.Inquiry(
        product_id=data.product_id,
        author_name=data.author_name,
        author_email=data.author_email,
        title=data.title,
        content=data.content,
        password=hash_password(data.password),
        is_secret=data.is_secret,
    )
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


def answer_inquiry(db: Session, inquiry_id: int, answer: str) -> models.Inquiry | None:
    from datetime import datetime, timezone
    obj = get_inquiry(db, inquiry_id)
    if not obj:
        return None
    obj.answer = answer
    obj.is_answered = True
    obj.answered_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(obj)
    return obj


def delete_inquiry(db: Session, inquiry_id: int) -> bool:
    obj = get_inquiry(db, inquiry_id)
    if not obj:
        return False
    db.delete(obj)
    db.commit()
    return True
