from fastapi import APIRouter, HTTPException, status
from app import schemas
from app.auth import authenticate_admin, create_access_token

router = APIRouter(prefix="/api/admin", tags=["admin-auth"])


@router.post("/login", response_model=schemas.Token)
def admin_login(data: schemas.AdminLogin):
    """관리자 로그인 → JWT 발급"""
    if not authenticate_admin(data.username, data.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="아이디 또는 비밀번호가 올바르지 않습니다",
        )
    token = create_access_token({"sub": data.username})
    return {"access_token": token, "token_type": "bearer"}
