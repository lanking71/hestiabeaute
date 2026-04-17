# =====================================================
# 📁 schemas.py — 데이터 형식 검증 설계도
# =====================================================
# 이 파일은 API로 주고받는 데이터의 형식을 정의해요.
# 마치 "이 양식에는 이름, 이메일, 내용 세 가지만 써야 해요"
# 처럼 규칙을 미리 정해두는 거예요.
#
# 용도:
#   - Create: 새로 만들 때 필요한 항목들
#   - Update: 수정할 때 필요한 항목들 (선택적)
#   - Out: 응답으로 돌려줄 때 포함할 항목들
#
# Pydantic이 자동으로 타입과 필수 항목을 검사해줘요.
# 잘못된 데이터가 오면 자동으로 오류 메시지를 보내요.
# =====================================================

from pydantic import BaseModel, EmailStr, field_validator
from datetime import datetime
from typing import Optional
import json  # JSON 문자열을 파이썬 리스트로 변환하는 데 사용


# ─────────────────────────────────────────
# 📂 카테고리 스키마
# ─────────────────────────────────────────

class CategoryBase(BaseModel):
    """카테고리의 공통 필드 — 아래 Create/Update/Out에서 상속받아 사용"""
    name_ko: str          # 한글명 (필수)
    name_en: str          # 영문명 (필수)
    slug: str             # URL 슬러그 (필수, 예: "cream")
    icon_url: Optional[str] = None  # 아이콘 이미지 경로 (선택)
    sort_order: int = 0   # 정렬 순서 (기본값 0)
    is_active: bool = True  # 활성 여부 (기본값 True)


class CategoryCreate(CategoryBase):
    """카테고리 새로 만들기 — CategoryBase와 같은 필드"""
    pass  # 추가 필드 없음, 부모 클래스 그대로 사용


class CategoryUpdate(BaseModel):
    """
    카테고리 수정하기 — 모든 항목이 Optional(선택적)
    보내지 않은 항목은 기존 값을 유지해요.
    예) name_ko만 보내면 이름만 바뀌고 나머지는 그대로
    """
    name_ko: Optional[str] = None
    name_en: Optional[str] = None
    slug: Optional[str] = None
    icon_url: Optional[str] = None
    sort_order: Optional[int] = None
    is_active: Optional[bool] = None


class CategoryOut(CategoryBase):
    """카테고리 응답 형식 — id와 생성 시각 포함"""
    id: int
    created_at: datetime

    class Config:
        from_attributes = True  # SQLAlchemy 모델을 Pydantic이 읽을 수 있게 허용


# ─────────────────────────────────────────
# 💄 제품 스키마
# ─────────────────────────────────────────

class ProductBase(BaseModel):
    """제품의 공통 필드"""
    category_id: int          # 어느 카테고리인지 (필수)
    name: str                 # 영문 제품명 (필수)
    name_ko: Optional[str] = None  # 한글 제품명 (선택)
    slug: str                 # URL 슬러그 (필수)
    description: Optional[str] = None   # 제품 설명
    ingredients: Optional[str] = None   # 성분
    volume: Optional[str] = None        # 용량 (예: "150ml")
    skin_type: Optional[str] = None     # 피부 타입
    how_to_use: Optional[str] = None    # 사용 방법
    image_url: Optional[str] = None     # 대표 이미지 경로
    image_urls: Optional[str] = None    # 추가 이미지들 (JSON 문자열로 저장)
    is_bestseller: bool = False         # 베스트셀러 여부
    is_new: bool = False                # 신제품 여부
    is_active: bool = True              # 활성 여부
    sort_order: int = 0                 # 정렬 순서


class ProductCreate(ProductBase):
    """제품 새로 만들기"""
    pass


class ProductUpdate(BaseModel):
    """제품 수정하기 — 모든 항목 선택적"""
    category_id: Optional[int] = None
    name: Optional[str] = None
    name_ko: Optional[str] = None
    slug: Optional[str] = None
    description: Optional[str] = None
    ingredients: Optional[str] = None
    volume: Optional[str] = None
    skin_type: Optional[str] = None
    how_to_use: Optional[str] = None
    image_url: Optional[str] = None
    image_urls: Optional[str] = None
    is_bestseller: Optional[bool] = None
    is_new: Optional[bool] = None
    is_active: Optional[bool] = None
    sort_order: Optional[int] = None


class ProductOut(ProductBase):
    """
    제품 상세 응답 형식 — id, 카테고리 정보, 날짜 포함
    image_urls는 JSON 문자열을 자동으로 리스트로 변환
    """
    id: int
    category: CategoryOut  # 카테고리 정보도 함께 반환 (id만이 아닌 전체 정보)
    image_urls: Optional[list[str]] = None  # JSON 문자열 → 파이썬 리스트로 변환
    created_at: datetime
    updated_at: datetime

    @field_validator("image_urls", mode="before")
    @classmethod
    def parse_image_urls(cls, v):
        """
        DB에는 '["img1.jpg","img2.jpg"]' 처럼 JSON 문자열로 저장되어 있는데,
        응답 시에는 ["img1.jpg", "img2.jpg"] 파이썬 리스트로 변환해서 내보내기
        """
        if isinstance(v, str):
            try:
                return json.loads(v)  # JSON 문자열 → 리스트
            except Exception:
                return []
        return v or []

    class Config:
        from_attributes = True


class ProductListOut(BaseModel):
    """
    제품 목록 응답 형식 — 목록 페이지용 (상세 정보 일부 제외)
    전체 설명/성분/사용법 같은 무거운 데이터는 포함하지 않아요.
    """
    id: int
    category_id: int
    name: str
    name_ko: Optional[str]
    slug: str
    volume: Optional[str]
    image_url: Optional[str]
    is_bestseller: bool
    is_new: bool
    is_active: bool
    category: CategoryOut

    class Config:
        from_attributes = True


# ─────────────────────────────────────────
# 💬 문의 스키마
# ─────────────────────────────────────────

class InquiryCreate(BaseModel):
    """새 문의 작성 시 필요한 항목들"""
    product_id: Optional[int] = None  # 어떤 제품 문의인지 (없으면 일반 문의)
    author_name: str      # 이름 (필수)
    author_email: EmailStr  # 이메일 (필수, 형식 자동 검증)
    title: str            # 제목 (필수)
    content: str          # 내용 (필수)
    password: str         # 비밀번호 (필수, 나중에 내용 확인용)
    is_secret: bool = False  # 비밀글 여부


class InquiryAnswer(BaseModel):
    """관리자 답변 작성 시 필요한 항목"""
    answer: str  # 답변 내용


class InquiryVerify(BaseModel):
    """비밀글 확인 시 비밀번호 제출용"""
    password: str


class InquiryOut(BaseModel):
    """
    문의 목록 응답 형식 — 목록에서 보여줄 최소한의 정보
    비밀글의 경우 content/answer는 여기서 포함하지 않아요.
    (비밀번호 확인 후 별도로 제공)
    """
    id: int
    product_id: Optional[int]
    author_name: str      # 작성자 이름
    title: str            # 제목
    is_secret: bool       # 비밀글 여부
    is_answered: bool     # 답변 완료 여부
    created_at: datetime  # 작성 시각

    class Config:
        from_attributes = True


class InquiryDetailOut(BaseModel):
    """
    문의 상세 응답 형식 — 내용과 답변까지 포함
    (비밀글이면 비밀번호 확인 후에만 이 데이터를 받을 수 있어요)
    """
    id: int
    product_id: Optional[int]
    author_name: str
    author_email: str     # 이메일도 상세에서는 포함
    title: str
    content: str          # 문의 내용 (목록 응답에는 없던 항목)
    is_secret: bool
    answer: Optional[str]           # 관리자 답변
    answered_at: Optional[datetime] # 답변 시각
    is_answered: bool
    created_at: datetime

    class Config:
        from_attributes = True


# ─────────────────────────────────────────
# 🖼️ 배너 스키마
# ─────────────────────────────────────────

class BannerBase(BaseModel):
    """배너의 공통 필드"""
    title: str                        # 큰 제목 (필수)
    subtitle: Optional[str] = None   # 부제목 (선택)
    image_url: Optional[str] = None  # 배너 이미지 경로
    link_url: Optional[str] = "/products"  # 클릭 시 이동할 주소
    sort_order: int = 0               # 표시 순서
    is_active: bool = True            # 활성 여부


class BannerCreate(BannerBase):
    """배너 새로 만들기"""
    pass


class BannerUpdate(BaseModel):
    """배너 수정하기 — 모든 항목 선택적"""
    title: Optional[str] = None
    subtitle: Optional[str] = None
    image_url: Optional[str] = None
    link_url: Optional[str] = None
    sort_order: Optional[int] = None
    is_active: Optional[bool] = None


class BannerOut(BannerBase):
    """배너 응답 형식 — id와 생성 시각 포함"""
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


# ─────────────────────────────────────────
# 🔑 인증 스키마
# ─────────────────────────────────────────

class AdminLogin(BaseModel):
    """관리자 로그인 요청 형식"""
    username: str  # 아이디
    password: str  # 비밀번호


class Token(BaseModel):
    """로그인 성공 시 돌려주는 토큰 형식"""
    access_token: str     # JWT 토큰 문자열
    token_type: str = "bearer"  # 항상 "bearer" 방식 사용


# ─────────────────────────────────────────
# 📤 기타 응답 스키마
# ─────────────────────────────────────────

class UploadOut(BaseModel):
    """이미지 업로드 성공 시 응답 형식"""
    url: str       # 업로드된 이미지에 접근할 수 있는 URL
    filename: str  # 저장된 파일명


class MessageOut(BaseModel):
    """단순 메시지 응답 형식 (삭제 성공 등)"""
    message: str  # 예) "삭제되었습니다"


class PaginatedProducts(BaseModel):
    """
    제품 목록 페이지 응답 형식
    items에 현재 페이지의 제품들, 나머지는 페이지 정보
    """
    items: list[ProductListOut]  # 현재 페이지의 제품 목록
    total: int   # 전체 제품 수
    page: int    # 현재 페이지 번호
    size: int    # 페이지당 개수
    pages: int   # 전체 페이지 수


class PaginatedInquiries(BaseModel):
    """문의 목록 페이지 응답 형식"""
    items: list[InquiryOut]  # 현재 페이지의 문의 목록
    total: int
    page: int
    size: int
    pages: int
