from pydantic import BaseModel, EmailStr, field_validator
from datetime import datetime
from typing import Optional
import json


# ─────────────────────────────────────────
# Category 스키마
# ─────────────────────────────────────────

class CategoryBase(BaseModel):
    name_ko: str
    name_en: str
    slug: str
    icon_url: Optional[str] = None
    sort_order: int = 0
    is_active: bool = True


class CategoryCreate(CategoryBase):
    pass


class CategoryUpdate(BaseModel):
    name_ko: Optional[str] = None
    name_en: Optional[str] = None
    slug: Optional[str] = None
    icon_url: Optional[str] = None
    sort_order: Optional[int] = None
    is_active: Optional[bool] = None


class CategoryOut(CategoryBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


# ─────────────────────────────────────────
# Product 스키마
# ─────────────────────────────────────────

class ProductBase(BaseModel):
    category_id: int
    name: str
    name_ko: Optional[str] = None
    slug: str
    description: Optional[str] = None
    ingredients: Optional[str] = None
    volume: Optional[str] = None
    skin_type: Optional[str] = None
    how_to_use: Optional[str] = None
    image_url: Optional[str] = None
    image_urls: Optional[str] = None  # JSON 문자열
    is_bestseller: bool = False
    is_new: bool = False
    is_active: bool = True
    sort_order: int = 0


class ProductCreate(ProductBase):
    pass


class ProductUpdate(BaseModel):
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
    id: int
    category: CategoryOut
    image_urls: Optional[list[str]] = None  # JSON 문자열 → 리스트로 변환
    created_at: datetime
    updated_at: datetime

    @field_validator("image_urls", mode="before")
    @classmethod
    def parse_image_urls(cls, v):
        if isinstance(v, str):
            try:
                return json.loads(v)
            except Exception:
                return []
        return v or []

    class Config:
        from_attributes = True


class ProductListOut(BaseModel):
    id: int
    name: str
    name_ko: Optional[str]
    slug: str
    volume: Optional[str]
    image_url: Optional[str]
    is_bestseller: bool
    is_new: bool
    category: CategoryOut

    class Config:
        from_attributes = True


# ─────────────────────────────────────────
# Inquiry 스키마
# ─────────────────────────────────────────

class InquiryCreate(BaseModel):
    product_id: Optional[int] = None
    author_name: str
    author_email: EmailStr
    title: str
    content: str
    password: str
    is_secret: bool = False


class InquiryAnswer(BaseModel):
    answer: str


class InquiryVerify(BaseModel):
    password: str


class InquiryOut(BaseModel):
    id: int
    product_id: Optional[int]
    author_name: str
    title: str
    is_secret: bool
    is_answered: bool
    created_at: datetime
    # 비밀글이면 content/answer는 별도 엔드포인트에서 제공

    class Config:
        from_attributes = True


class InquiryDetailOut(BaseModel):
    id: int
    product_id: Optional[int]
    author_name: str
    author_email: str
    title: str
    content: str
    is_secret: bool
    answer: Optional[str]
    answered_at: Optional[datetime]
    is_answered: bool
    created_at: datetime

    class Config:
        from_attributes = True


# ─────────────────────────────────────────
# Banner 스키마
# ─────────────────────────────────────────

class BannerBase(BaseModel):
    title: str
    subtitle: Optional[str] = None
    image_url: Optional[str] = None
    link_url: Optional[str] = "/products"
    sort_order: int = 0
    is_active: bool = True


class BannerCreate(BannerBase):
    pass


class BannerUpdate(BaseModel):
    title: Optional[str] = None
    subtitle: Optional[str] = None
    image_url: Optional[str] = None
    link_url: Optional[str] = None
    sort_order: Optional[int] = None
    is_active: Optional[bool] = None


class BannerOut(BannerBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


# ─────────────────────────────────────────
# 인증 스키마
# ─────────────────────────────────────────

class AdminLogin(BaseModel):
    username: str
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


# ─────────────────────────────────────────
# 이미지 업로드 응답
# ─────────────────────────────────────────

class UploadOut(BaseModel):
    url: str
    filename: str


# ─────────────────────────────────────────
# 공통 응답
# ─────────────────────────────────────────

class MessageOut(BaseModel):
    message: str


class PaginatedProducts(BaseModel):
    items: list[ProductListOut]
    total: int
    page: int
    size: int
    pages: int


class PaginatedInquiries(BaseModel):
    items: list[InquiryOut]
    total: int
    page: int
    size: int
    pages: int
