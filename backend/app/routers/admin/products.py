from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.auth import get_current_admin
from app import crud, schemas

router = APIRouter(prefix="/api/admin/products", tags=["admin-products"])


@router.get("", response_model=schemas.PaginatedProducts)
def list_products(
    category: str | None = Query(None),
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    _: str = Depends(get_current_admin),
):
    """관리자 — 제품 목록 (비활성 포함)"""
    return crud.get_products(db, category_slug=category, active_only=False, page=page, size=size)


@router.post("", response_model=schemas.ProductOut, status_code=201)
def create_product(
    data: schemas.ProductCreate,
    db: Session = Depends(get_db),
    _: str = Depends(get_current_admin),
):
    """제품 등록"""
    return crud.create_product(db, data)


@router.put("/{product_id}", response_model=schemas.ProductOut)
def update_product(
    product_id: int,
    data: schemas.ProductUpdate,
    db: Session = Depends(get_db),
    _: str = Depends(get_current_admin),
):
    """제품 수정"""
    result = crud.update_product(db, product_id, data)
    if not result:
        raise HTTPException(status_code=404, detail="제품을 찾을 수 없습니다")
    return result


@router.delete("/{product_id}", response_model=schemas.MessageOut)
def delete_product(
    product_id: int,
    db: Session = Depends(get_db),
    _: str = Depends(get_current_admin),
):
    """제품 삭제 (소프트 삭제 — is_active=False)"""
    if not crud.delete_product(db, product_id):
        raise HTTPException(status_code=404, detail="제품을 찾을 수 없습니다")
    return {"message": "제품이 삭제되었습니다"}
