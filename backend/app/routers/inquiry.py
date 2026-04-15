from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app import crud, schemas

router = APIRouter(prefix="/api/inquiry", tags=["inquiry"])


@router.get("", response_model=schemas.PaginatedInquiries)
def list_inquiries(
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
):
    """문의 게시판 목록 (최신순)"""
    return crud.get_inquiries(db, page=page, size=size)


@router.get("/{inquiry_id}", response_model=schemas.InquiryDetailOut)
def get_inquiry(
    inquiry_id: int,
    password: str | None = Query(None, description="비밀글 확인용 비밀번호"),
    db: Session = Depends(get_db),
):
    """문의 상세 조회 — 비밀글은 password 일치 시에만 반환"""
    inquiry = crud.get_inquiry(db, inquiry_id)
    if not inquiry:
        raise HTTPException(status_code=404, detail="문의를 찾을 수 없습니다")
    if inquiry.is_secret:
        if not password or not crud.verify_password(password, inquiry.password):
            raise HTTPException(status_code=403, detail="비밀번호가 올바르지 않습니다")
    return inquiry


@router.post("", response_model=schemas.InquiryDetailOut, status_code=201)
def create_inquiry(data: schemas.InquiryCreate, db: Session = Depends(get_db)):
    """문의 작성"""
    return crud.create_inquiry(db, data)
