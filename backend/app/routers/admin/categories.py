from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.auth import get_current_admin
from app import crud, schemas

router = APIRouter(prefix="/api/admin/categories", tags=["admin-categories"])


@router.get("", response_model=list[schemas.CategoryOut])
def list_categories(
    db: Session = Depends(get_db),
    _: str = Depends(get_current_admin),
):
    """관리자 — 카테고리 전체 목록 (비활성 포함)"""
    return crud.get_categories(db, active_only=False)


@router.post("", response_model=schemas.CategoryOut, status_code=201)
def create_category(
    data: schemas.CategoryCreate,
    db: Session = Depends(get_db),
    _: str = Depends(get_current_admin),
):
    """카테고리 추가"""
    existing = crud.get_category_by_slug(db, data.slug)
    if existing:
        raise HTTPException(status_code=400, detail="이미 사용 중인 slug입니다")
    return crud.create_category(db, data)


@router.put("/{category_id}", response_model=schemas.CategoryOut)
def update_category(
    category_id: int,
    data: schemas.CategoryUpdate,
    db: Session = Depends(get_db),
    _: str = Depends(get_current_admin),
):
    """카테고리 수정"""
    result = crud.update_category(db, category_id, data)
    if not result:
        raise HTTPException(status_code=404, detail="카테고리를 찾을 수 없습니다")
    return result


@router.delete("/{category_id}", response_model=schemas.MessageOut)
def delete_category(
    category_id: int,
    db: Session = Depends(get_db),
    _: str = Depends(get_current_admin),
):
    """카테고리 삭제 (해당 카테고리에 제품이 있으면 거부)"""
    category = crud.get_category(db, category_id)
    if not category:
        raise HTTPException(status_code=404, detail="카테고리를 찾을 수 없습니다")
    if category.products:
        raise HTTPException(
            status_code=400,
            detail=f"이 카테고리에 제품 {len(category.products)}개가 있어 삭제할 수 없습니다. 제품을 먼저 이동하세요.",
        )
    crud.delete_category(db, category_id)
    return {"message": "카테고리가 삭제되었습니다"}
