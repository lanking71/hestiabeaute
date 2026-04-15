import uuid
import os
from pathlib import Path
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from app.auth import get_current_admin
from app.config import get_settings
from app import schemas

router = APIRouter(prefix="/api/admin/upload", tags=["admin-upload"])

settings = get_settings()
ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}


@router.post("", response_model=schemas.UploadOut)
async def upload_image(
    file: UploadFile = File(...),
    _: str = Depends(get_current_admin),
):
    """제품 이미지 업로드 — UUID 파일명으로 저장, URL 반환"""
    # 확장자 검사
    suffix = Path(file.filename).suffix.lower()
    if suffix not in ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=400, detail="jpg, jpeg, png, webp 파일만 업로드 가능합니다")

    # 파일 크기 검사
    content = await file.read()
    max_bytes = settings.max_upload_size_mb * 1024 * 1024
    if len(content) > max_bytes:
        raise HTTPException(status_code=400, detail=f"파일 크기는 {settings.max_upload_size_mb}MB 이하여야 합니다")

    # UUID 파일명으로 저장 (경로 traversal 방지)
    filename = f"{uuid.uuid4().hex}{suffix}"
    save_dir = Path(settings.upload_dir)
    save_dir.mkdir(parents=True, exist_ok=True)
    save_path = save_dir / filename

    with open(save_path, "wb") as f:
        f.write(content)

    url = f"/static/uploads/products/{filename}"
    return {"url": url, "filename": filename}
