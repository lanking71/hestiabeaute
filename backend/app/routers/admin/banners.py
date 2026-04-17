from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app import schemas, crud
from app.auth import get_current_admin

router = APIRouter(prefix="/api/admin/banners", tags=["admin-banners"])


@router.get("", response_model=list[schemas.BannerOut])
def list_banners(db: Session = Depends(get_db), _=Depends(get_current_admin)):
    return crud.get_banners(db, active_only=False)


@router.post("", response_model=schemas.BannerOut, status_code=status.HTTP_201_CREATED)
def create_banner(data: schemas.BannerCreate, db: Session = Depends(get_db), _=Depends(get_current_admin)):
    return crud.create_banner(db, data)


@router.put("/{banner_id}", response_model=schemas.BannerOut)
def update_banner(banner_id: int, data: schemas.BannerUpdate, db: Session = Depends(get_db), _=Depends(get_current_admin)):
    obj = crud.update_banner(db, banner_id, data)
    if not obj:
        raise HTTPException(status_code=404, detail="배너를 찾을 수 없습니다")
    return obj


@router.delete("/{banner_id}", response_model=schemas.MessageOut)
def delete_banner(banner_id: int, db: Session = Depends(get_db), _=Depends(get_current_admin)):
    if not crud.delete_banner(db, banner_id):
        raise HTTPException(status_code=404, detail="배너를 찾을 수 없습니다")
    return {"message": "삭제되었습니다"}
