# =====================================================
# 📁 auth.py — 관리자 로그인 및 인증 처리
# =====================================================
# 이 파일은 관리자가 올바른 아이디/비밀번호로
# 로그인했는지 확인하고, 로그인에 성공하면
# "출입증(토큰)"을 발급해주는 역할을 해요.
#
# 작동 방식:
#   1. 관리자가 아이디/비밀번호 입력
#   2. 맞으면 JWT 토큰(출입증) 발급
#   3. 이후 관리자 페이지 접근 시 토큰을 제시
#   4. 토큰이 유효하면 접근 허용, 아니면 차단
# =====================================================

from datetime import datetime, timedelta, timezone
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt      # JWT 토큰 생성/검증 도구
from app.config import get_settings
from app.crud import verify_password

settings = get_settings()

# 🛡️ Bearer 인증 방식: HTTP 요청 헤더에서 "Bearer 토큰" 형태로 토큰을 읽어옴
bearer_scheme = HTTPBearer()

# 🔐 암호화 알고리즘: HS256 방식으로 토큰에 서명
ALGORITHM = "HS256"

# ⏰ 토큰 유효 시간: 8시간 (= 60분 × 8)
# 8시간이 지나면 다시 로그인해야 함
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 8


def create_access_token(data: dict) -> str:
    """
    JWT 출입증(토큰) 만들기

    data: 토큰에 저장할 정보 (예: {"sub": "admin"})
    반환값: 긴 문자열로 된 토큰

    동작:
    1. 만료 시각(expire)을 계산 (현재 시각 + 8시간)
    2. data에 만료 시각 추가
    3. 비밀 키(secret_key)로 서명하여 토큰 생성
    """
    payload = data.copy()
    # 현재 UTC 시각에서 8시간 뒤를 만료 시각으로 설정
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    payload.update({"exp": expire})  # "exp" = expiration(만료)의 약자
    # 비밀 키로 서명한 토큰 생성
    return jwt.encode(payload, settings.secret_key, algorithm=ALGORITHM)


def authenticate_admin(username: str, password: str) -> bool:
    """
    관리자 계정 확인하기

    username: 입력한 아이디
    password: 입력한 비밀번호
    반환값: 맞으면 True, 틀리면 False

    동작:
    1. 아이디가 설정된 관리자 아이디와 같은지 확인
    2. 비밀번호도 맞는지 확인
    둘 다 맞아야 True 반환
    """
    # 아이디가 다르면 즉시 False (비밀번호도 확인 불필요)
    if username != settings.admin_username:
        return False
    # 비밀번호 확인 (평문 비교 방식, 실제 서비스에서는 해시 비교 사용)
    return password == settings.admin_password


def get_current_admin(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
) -> str:
    """
    관리자 JWT 검증 의존성 — 모든 /admin/* 라우터에 주입

    이 함수는 관리자 전용 API에 "경비원" 역할을 해요.
    관리자 페이지로 오는 모든 요청에 자동으로 실행되어
    토큰이 올바른지 확인해요.

    동작:
    1. 요청 헤더에서 토큰 추출
    2. 토큰을 비밀 키로 해독
    3. 토큰 안의 사용자명이 관리자인지 확인
    4. 문제없으면 사용자명 반환, 문제 있으면 에러 발생
    """
    token = credentials.credentials  # "Bearer 토큰" 에서 실제 토큰 부분만 추출
    try:
        # 비밀 키로 토큰을 해독하여 payload(저장된 정보) 가져오기
        payload = jwt.decode(token, settings.secret_key, algorithms=[ALGORITHM])

        # 토큰에서 사용자명 꺼내기 ("sub" = subject의 약자)
        username: str = payload.get("sub")

        # 사용자명이 없거나 관리자가 아니면 접근 거부
        if username is None or username != settings.admin_username:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="인증 실패")

    except JWTError:
        # 토큰이 변조되었거나 만료된 경우
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="토큰이 유효하지 않습니다")

    return username  # 인증 성공 → 사용자명 반환
