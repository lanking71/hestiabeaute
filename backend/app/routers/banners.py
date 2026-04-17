from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app import schemas, crud

router = APIRouter(prefix="/api/banners", tags=["banners"])


@router.get("", response_model=list[schemas.BannerOut])
def get_banners(db: Session = Depends(get_db)):
    return crud.get_banners(db, active_only=True)
