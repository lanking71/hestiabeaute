from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.auth import get_current_admin
from app import crud, schemas

router = APIRouter(prefix="/api/admin/inquiry", tags=["admin-inquiry"])


@router.get("", response_model=schemas.PaginatedInquiries)
def list_inquiries(
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    _: str = Depends(get_current_admin),
):
    """관리자 — 문의 목록 (미답변 우선)"""
    return crud.get_inquiries(db, unanswered_first=True, page=page, size=size)


@router.patch("/{inquiry_id}/answer", response_model=schemas.InquiryDetailOut)
def answer_inquiry(
    inquiry_id: int,
    data: schemas.InquiryAnswer,
    db: Session = Depends(get_db),
    _: str = Depends(get_current_admin),
):
    """문의 답변 작성 / 수정"""
    result = crud.answer_inquiry(db, inquiry_id, data.answer)
    if not result:
        raise HTTPException(status_code=404, detail="문의를 찾을 수 없습니다")
    return result


@router.delete("/{inquiry_id}", response_model=schemas.MessageOut)
def delete_inquiry(
    inquiry_id: int,
    db: Session = Depends(get_db),
    _: str = Depends(get_current_admin),
):
    """문의 삭제"""
    if not crud.delete_inquiry(db, inquiry_id):
        raise HTTPException(status_code=404, detail="문의를 찾을 수 없습니다")
    return {"message": "문의가 삭제되었습니다"}
