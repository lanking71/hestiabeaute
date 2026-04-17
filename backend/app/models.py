# =====================================================
# 📁 models.py — 데이터베이스 테이블 설계도
# =====================================================
# 이 파일은 데이터베이스에 어떤 표(테이블)를 만들고,
# 각 표에 어떤 칸(컬럼)이 있는지 알려주는 파일이에요.
#
# 마치 엑셀 파일을 만들기 전에 "이 시트에는 이런 항목들이
# 들어갈 거야"라고 미리 설계하는 것과 같아요.
#
# 테이블 종류:
#   - Category (카테고리): 스킨, 크림, 앰플 등 제품 분류
#   - Product (제품): 실제 화장품 정보
#   - Banner (배너): 홈 화면 슬라이더 이미지
#   - Inquiry (문의): 고객이 남긴 질문/문의
# =====================================================

from sqlalchemy import (
    Column, Integer, String, Boolean, Text, DateTime, ForeignKey
)
from sqlalchemy.orm import relationship  # 테이블 간 관계 설정
from sqlalchemy.sql import func          # 현재 시각 자동 저장용
from app.database import Base            # 모든 테이블의 부모 클래스


# ─────────────────────────────────────────
# 📂 카테고리 테이블
# ─────────────────────────────────────────
class Category(Base):
    __tablename__ = "categories"  # DB에서 이 표의 이름

    # 🔢 id: 각 카테고리를 구별하는 번호 (1, 2, 3... 자동 증가)
    id = Column(Integer, primary_key=True, index=True)

    # 📝 이름 (한글/영문)
    name_ko = Column(String(100), nullable=False)           # 한글명: "스킨·토너·플루이드"
    name_en = Column(String(100), nullable=False)           # 영문명: "SKIN TONER FLUID"

    # 🔗 슬러그: URL에 사용되는 짧은 텍스트 (예: "skin-toner-fluid")
    # unique=True: 중복 불가 — 같은 슬러그가 두 개 있으면 안 됨
    slug = Column(String(100), nullable=False, unique=True)

    # 🖼️ 아이콘 이미지 경로 (없어도 됨)
    icon_url = Column(String(500), nullable=True)

    # 🔢 정렬 순서: 숫자가 작을수록 먼저 표시 (0, 1, 2...)
    sort_order = Column(Integer, default=0)

    # ✅ 활성 여부: False면 화면에 표시 안 함 (숨기기)
    is_active = Column(Boolean, default=True)

    # 📅 생성 시각: 카테고리를 만든 날짜/시간 (자동 저장)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # 🔗 관계 설정: 이 카테고리에 속한 제품들과 연결
    # back_populates: Product 쪽에서도 category로 반대 접근 가능
    products = relationship("Product", back_populates="category")


# ─────────────────────────────────────────
# 💄 제품 테이블
# ─────────────────────────────────────────
class Product(Base):
    __tablename__ = "products"  # DB에서 이 표의 이름

    # 🔢 id: 각 제품을 구별하는 번호 (자동 증가)
    id = Column(Integer, primary_key=True, index=True)

    # 🔗 카테고리 연결: 이 제품이 어떤 카테고리에 속하는지 (숫자 번호)
    # ForeignKey: 다른 테이블(categories)의 id와 연결
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=False)

    # 📝 제품명 (영문/한글)
    name = Column(String(200), nullable=False)              # 영문 제품명: "Glutathione Cream"
    name_ko = Column(String(200), nullable=True)            # 한글 제품명: "글루타치온 크림"

    # 🔗 슬러그: URL에 사용 (예: "glutathione-cream")
    slug = Column(String(200), nullable=False, unique=True)

    # 📄 텍스트 정보들 (없어도 됨)
    description = Column(Text, nullable=True)               # 제품 설명 (HTML 형식도 OK)
    ingredients = Column(Text, nullable=True)               # 주요 성분 목록
    volume = Column(String(50), nullable=True)              # 용량: "150ml"
    skin_type = Column(String(100), nullable=True)          # 피부 타입: "건성, 복합성"
    how_to_use = Column(Text, nullable=True)                # 사용 방법

    # 🖼️ 이미지
    image_url = Column(String(500), nullable=True)          # 대표 이미지 1장 (목록에서 보이는 이미지)
    image_urls = Column(Text, nullable=True)                # 상세 이미지 여러 장 (JSON 배열로 저장)

    # 🏆 특별 표시
    is_bestseller = Column(Boolean, default=False)          # True면 "BEST" 배지 표시
    is_new = Column(Boolean, default=False)                 # True면 "NEW" 배지 표시
    is_active = Column(Boolean, default=True)               # False면 화면에서 숨기기 (소프트 삭제)

    # 🔢 정렬 순서
    sort_order = Column(Integer, default=0)

    # 📅 날짜 (자동 저장)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # 🔗 관계 설정
    category = relationship("Category", back_populates="products")  # 어느 카테고리인지
    inquiries = relationship("Inquiry", back_populates="product")   # 이 제품에 달린 문의들


# ─────────────────────────────────────────
# 🖼️ 배너 테이블 (홈 화면 슬라이더)
# ─────────────────────────────────────────
class Banner(Base):
    __tablename__ = "banners"

    # 🔢 id: 각 배너를 구별하는 번호
    id = Column(Integer, primary_key=True, index=True)

    # 📝 배너 텍스트
    title = Column(String(200), nullable=False)             # 큰 제목: "글루타치온의 힘"
    subtitle = Column(String(500), nullable=True)           # 부제목: "피부 깊은 곳부터..."

    # 🖼️ 배너 이미지 경로
    image_url = Column(String(500), nullable=True)

    # 🔗 클릭 시 이동할 주소 (기본값: 제품 목록 페이지)
    link_url = Column(String(500), nullable=True, default="/products")

    # 🔢 표시 순서 (숫자 작을수록 먼저)
    sort_order = Column(Integer, default=0)

    # ✅ 활성 여부
    is_active = Column(Boolean, default=True)

    # 📅 생성 시각
    created_at = Column(DateTime(timezone=True), server_default=func.now())


# ─────────────────────────────────────────
# 💬 문의 게시판 테이블
# ─────────────────────────────────────────
class Inquiry(Base):
    __tablename__ = "inquiries"

    # 🔢 id: 각 문의를 구별하는 번호
    id = Column(Integer, primary_key=True, index=True)

    # 🔗 어떤 제품에 대한 문의인지 (없으면 일반 문의)
    # nullable=True: 특정 제품이 아닌 일반 문의도 가능
    product_id = Column(Integer, ForeignKey("products.id"), nullable=True)

    # 👤 작성자 정보
    author_name = Column(String(100), nullable=False)       # 이름
    author_email = Column(String(200), nullable=False)      # 이메일

    # 📝 문의 내용
    title = Column(String(300), nullable=False)             # 제목
    content = Column(Text, nullable=False)                  # 내용

    # 🔒 비밀번호: 나중에 자신의 문의를 확인할 때 필요
    # bcrypt 해시로 저장 — 평문이 아닌 암호화된 형태로 저장
    password = Column(String(200), nullable=False)

    # 🔐 비밀글 여부: True면 작성자와 관리자만 볼 수 있음
    is_secret = Column(Boolean, default=False)

    # 💬 관리자 답변
    answer = Column(Text, nullable=True)                    # 관리자가 작성한 답변 내용
    answered_at = Column(DateTime(timezone=True), nullable=True)  # 답변한 시각
    is_answered = Column(Boolean, default=False)            # 답변 완료 여부

    # 📅 작성 시각
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # 🔗 관계 설정: 어떤 제품의 문의인지
    product = relationship("Product", back_populates="inquiries")
