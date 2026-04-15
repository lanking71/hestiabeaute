from sqlalchemy import (
    Column, Integer, String, Boolean, Text, DateTime, ForeignKey
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    name_ko = Column(String(100), nullable=False)           # 한글명
    name_en = Column(String(100), nullable=False)           # 영문명
    slug = Column(String(100), nullable=False, unique=True) # URL slug
    icon_url = Column(String(500), nullable=True)           # 카테고리 아이콘
    sort_order = Column(Integer, default=0)                 # 정렬 순서
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    products = relationship("Product", back_populates="category")


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=False)
    name = Column(String(200), nullable=False)              # 영문 제품명
    name_ko = Column(String(200), nullable=True)            # 한글 제품명
    slug = Column(String(200), nullable=False, unique=True) # URL slug
    description = Column(Text, nullable=True)               # 제품 설명 (HTML)
    ingredients = Column(Text, nullable=True)               # 주요 성분
    volume = Column(String(50), nullable=True)              # 용량 (예: 150ml)
    skin_type = Column(String(100), nullable=True)          # 피부 타입
    how_to_use = Column(Text, nullable=True)                # 사용 방법
    image_url = Column(String(500), nullable=True)          # 대표 이미지
    image_urls = Column(Text, nullable=True)                # 추가 이미지 (JSON 배열)
    is_bestseller = Column(Boolean, default=False)
    is_new = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)               # 소프트 삭제
    sort_order = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    category = relationship("Category", back_populates="products")
    inquiries = relationship("Inquiry", back_populates="product")


class Inquiry(Base):
    __tablename__ = "inquiries"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=True)  # NULL = 일반 문의
    author_name = Column(String(100), nullable=False)
    author_email = Column(String(200), nullable=False)
    title = Column(String(300), nullable=False)
    content = Column(Text, nullable=False)
    password = Column(String(200), nullable=False)          # bcrypt 해시
    is_secret = Column(Boolean, default=False)              # 비밀글
    answer = Column(Text, nullable=True)                    # 관리자 답변
    answered_at = Column(DateTime(timezone=True), nullable=True)
    is_answered = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    product = relationship("Product", back_populates="inquiries")
