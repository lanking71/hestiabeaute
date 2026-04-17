# =====================================================
# 📁 config.py — 프로그램 설정값 모음
# =====================================================
# 이 파일은 프로그램이 시작할 때 필요한 설정값들을
# 한 곳에 모아두는 파일이에요.
# 마치 학교에서 "우리 반 규칙"을 칠판에 써두는 것처럼
# 프로그램의 중요한 정보를 여기에 저장해요.
# =====================================================

# pydantic_settings: 설정값을 안전하게 관리해주는 도구
from pydantic_settings import BaseSettings
# lru_cache: 같은 결과를 다시 계산하지 않고 저장해두는 기능 (메모리 절약)
from functools import lru_cache


# Settings 클래스 — 프로그램의 모든 설정값을 담는 상자
class Settings(BaseSettings):
    # 🔑 비밀 암호 키 — JWT 토큰을 만들 때 사용하는 비밀 열쇠
    secret_key: str = "hestia-secret-key"

    # 👤 관리자 계정 정보 — 로그인할 때 사용하는 아이디/비밀번호
    admin_username: str = "admin"
    admin_password: str = "admin1234"
    admin_password_hash: str = ""  # 암호화된 비밀번호 (비워두면 위의 평문 비밀번호 사용)

    # 🗄️ 데이터베이스 위치 — 데이터가 저장될 파일 경로
    database_url: str = "sqlite:///./hestia.db"

    # 📁 이미지 업로드 폴더 — 사진 파일을 저장할 위치
    upload_dir: str = "static/uploads/products"

    # 📏 업로드 최대 크기 — 5MB 이상은 거부
    max_upload_size_mb: int = 5

    # 🌐 CORS 허용 주소 — 프론트엔드(Next.js)가 실행되는 주소
    # 다른 주소에서 오는 요청은 보안상 차단
    cors_origins: str = "http://localhost:3000"

    @property
    def cors_origins_list(self) -> list[str]:
        # 쉼표(,)로 구분된 주소들을 리스트로 변환
        # 예) "http://a.com,http://b.com" → ["http://a.com", "http://b.com"]
        return [o.strip() for o in self.cors_origins.split(",")]

    class Config:
        # .env 파일에서 설정값을 읽어오기 (파일이 없으면 위의 기본값 사용)
        env_file = ".env"
        env_file_encoding = "utf-8"


# @lru_cache: 이 함수를 처음 호출할 때만 실행하고, 이후엔 저장된 결과를 재사용
# → 설정을 반복해서 읽지 않아도 돼서 빠르게 동작해요
@lru_cache()
def get_settings() -> Settings:
    # Settings 객체를 만들어서 돌려주는 함수
    return Settings()
