from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app import crud, schemas

router = APIRouter(prefix="/api/products", tags=["products"])


@router.get("", response_model=schemas.PaginatedProducts)
def list_products(
    category: str | None = Query(None, description="카테고리 slug"),
    bestseller: bool | None = Query(None),
    new: bool | None = Query(None),
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
):
    """제품 목록 (카테고리/베스트셀러/신제품 필터 + 페이지네이션)"""
    result = crud.get_products(
        db,
        category_slug=category,
        bestseller=bestseller,
        is_new=new,
        page=page,
        size=size,
    )
    return result


@router.get("/{slug}", response_model=schemas.ProductOut)
def get_product(slug: str, db: Session = Depends(get_db)):
    """제품 상세 (slug 기준)"""
    product = crud.get_product_by_slug(db, slug)
    if not product:
        raise HTTPException(status_code=404, detail="제품을 찾을 수 없습니다")
    return product
