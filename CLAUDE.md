# HESTIA Beauty — 개발 지침 (CLAUDE.md)

## 프로젝트 개요

**브랜드**: HESTIA (헤스티아) — 글루타치온 기반 프리미엄 화장품
**서브 브랜드**: MELASMA-X (기미 전문 라인)
**목적**: 브랜드 소개 및 제품 카탈로그 웹사이트 (결제 기능 없음)
**운영자**: 관리자 1인이 제품/카테고리/문의 게시판을 직접 관리

---

## 기능 범위 (Scope)

### 포함 기능
- 홈페이지 (히어로 배너 슬라이더, 카테고리 그리드, 베스트셀러, 브랜드 소개)
- 카테고리 관리 (추가 / 수정 / 삭제 / 정렬)
- 제품 관리 (카테고리별 등록 / 수정 / 삭제 / 이미지 업로드)
- 제품 상세 페이지 (이미지 갤러리, 성분, 사용법)
- 제품 문의 게시판 (작성 / 목록 / 상세 / 관리자 답변)
- 관리자 로그인 (단일 계정)
- 관리자 대시보드

### 제외 기능 (절대 구현하지 않음)
- 장바구니 / 결제 / 주문 처리
- 회원가입 / 소셜 로그인
- 재고 관리 / 포인트 / 쿠폰

---

## 기술 스택

| 구분 | 기술 | 버전 |
|------|------|------|
| 프론트엔드 | Next.js (App Router) | 14.x |
| 언어 | TypeScript | 5.x |
| UI 컴포넌트 | shadcn/ui | 최신 |
| CSS | Tailwind CSS | 3.x |
| 아이콘 | lucide-react | 최신 |
| 슬라이더 | embla-carousel-react | 최신 |
| 백엔드 | FastAPI | 최신 |
| Python | 3.11 | .venv 사용 |
| DB | SQLite | Python 내장 |
| ORM | SQLAlchemy | 2.x |
| 검증 | Pydantic | 2.x |
| 인증 | JWT (python-jose) | 관리자 전용 |
| 이미지 저장 | 로컬 파일 (backend/static/uploads/) | — |

### 선택 이유
- **Next.js App Router**: SSR/SSG로 SEO 최적화, 화장품 브랜드 특성상 검색 노출 중요
- **shadcn/ui**: 복사 붙여넣기 방식 컴포넌트, Tailwind 기반으로 커스터마이징 자유도 높음
- **FastAPI 분리**: 프론트/백엔드 역할 명확히 분리, 향후 모바일 앱 확장 가능
- **SQLite**: 별도 DB 서버 불필요, 단일 관리자 운영 규모에 충분

---

## 디렉토리 구조

```
D:\hestiabeaute\
│
├── frontend/                          # Next.js 14 프론트엔드
│   ├── src/
│   │   ├── app/                       # App Router
│   │   │   ├── layout.tsx             # 루트 레이아웃 (헤더+푸터 포함)
│   │   │   ├── page.tsx               # 홈페이지 (/)
│   │   │   ├── products/
│   │   │   │   ├── page.tsx           # 전체 제품 목록
│   │   │   │   ├── [category]/
│   │   │   │   │   └── page.tsx       # 카테고리별 제품 목록
│   │   │   │   └── [category]/[slug]/
│   │   │   │       └── page.tsx       # 제품 상세
│   │   │   ├── inquiry/
│   │   │   │   ├── page.tsx           # 문의 게시판 목록
│   │   │   │   ├── write/
│   │   │   │   │   └── page.tsx       # 문의 작성
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx       # 문의 상세
│   │   │   ├── about/
│   │   │   │   └── page.tsx           # 브랜드 소개
│   │   │   └── admin/                 # 관리자 (로그인 후 접근)
│   │   │       ├── login/
│   │   │       │   └── page.tsx
│   │   │       ├── dashboard/
│   │   │       │   └── page.tsx
│   │   │       ├── categories/
│   │   │       │   └── page.tsx       # 카테고리 CRUD
│   │   │       ├── products/
│   │   │       │   ├── page.tsx       # 제품 목록 관리
│   │   │       │   ├── new/
│   │   │       │   │   └── page.tsx   # 제품 등록
│   │   │       │   └── [id]/
│   │   │       │       └── page.tsx   # 제품 수정
│   │   │       └── inquiry/
│   │   │           └── page.tsx       # 문의 답변 관리
│   │   │
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── Header.tsx         # 헤더 (로고 + 네비 + 언어토글)
│   │   │   │   ├── Navigation.tsx     # 카테고리 드롭다운 메뉴
│   │   │   │   ├── Footer.tsx         # 푸터
│   │   │   │   └── AnnouncementBar.tsx # 상단 공지 띠
│   │   │   ├── home/
│   │   │   │   ├── HeroBanner.tsx     # 풀스크린 슬라이더 (embla-carousel)
│   │   │   │   ├── CategoryGrid.tsx   # 카테고리 카드 그리드
│   │   │   │   ├── BestSellers.tsx    # 베스트셀러 제품 그리드
│   │   │   │   ├── NewArrivals.tsx    # 신제품 슬라이더
│   │   │   │   ├── BrandStory.tsx     # 브랜드 소개 섹션
│   │   │   │   ├── IngredientHighlight.tsx  # 성분 인포그래픽
│   │   │   │   └── PromoBanner.tsx    # 프로모션 배너
│   │   │   ├── product/
│   │   │   │   ├── ProductCard.tsx    # 제품 카드 (목록용)
│   │   │   │   ├── ProductGrid.tsx    # 제품 그리드 래퍼
│   │   │   │   ├── ProductGallery.tsx # 상세 이미지 갤러리
│   │   │   │   └── ProductDetail.tsx  # 상세 정보 섹션
│   │   │   ├── inquiry/
│   │   │   │   ├── InquiryList.tsx
│   │   │   │   ├── InquiryForm.tsx
│   │   │   │   └── InquiryDetail.tsx
│   │   │   ├── admin/
│   │   │   │   ├── AdminLayout.tsx    # 관리자 사이드바 레이아웃
│   │   │   │   ├── CategoryForm.tsx
│   │   │   │   ├── ProductForm.tsx    # 제품 등록/수정 폼
│   │   │   │   └── ImageUploader.tsx  # 이미지 업로드 컴포넌트
│   │   │   └── ui/                    # shadcn/ui 컴포넌트 (자동 생성)
│   │   │
│   │   ├── lib/
│   │   │   ├── api.ts                 # FastAPI 호출 함수 모음
│   │   │   ├── types.ts               # TypeScript 타입 정의
│   │   │   ├── constants.ts           # 카테고리 슬러그, 상수
│   │   │   └── utils.ts               # 공통 유틸 함수
│   │   │
│   │   └── styles/
│   │       └── globals.css            # Tailwind 기본 + 커스텀 CSS
│   │
│   ├── public/
│   │   ├── images/
│   │   │   ├── logo/                  # HESTIA 로고 (SVG 권장)
│   │   │   ├── banners/               # 히어로 배너 이미지
│   │   │   └── icons/                 # 카테고리 아이콘
│   │   └── fonts/                     # 커스텀 웹폰트
│   │
│   ├── next.config.ts                 # Next.js 설정 (이미지 도메인 등)
│   ├── tailwind.config.ts             # Tailwind + HESTIA 브랜드 색상
│   ├── components.json                # shadcn/ui 설정
│   ├── tsconfig.json
│   └── package.json
│
├── backend/                           # FastAPI 백엔드
│   ├── app/
│   │   ├── main.py                    # FastAPI 앱, CORS 설정, 라우터 등록
│   │   ├── database.py                # SQLite 연결, SQLAlchemy 세션
│   │   ├── models.py                  # DB 모델 (Category, Product, Inquiry)
│   │   ├── schemas.py                 # Pydantic 스키마
│   │   ├── crud.py                    # DB CRUD 함수 (라우터에서 직접 DB 접근 금지)
│   │   ├── auth.py                    # JWT 관리자 인증
│   │   ├── config.py                  # 환경변수 로드
│   │   └── routers/
│   │       ├── categories.py          # GET /categories (공개)
│   │       ├── products.py            # GET /products (공개)
│   │       ├── inquiry.py             # GET/POST /inquiry (공개)
│   │       └── admin/
│   │           ├── auth.py            # POST /admin/login
│   │           ├── categories.py      # CRUD /admin/categories
│   │           ├── products.py        # CRUD /admin/products
│   │           ├── inquiry.py         # PATCH /admin/inquiry/{id}/answer
│   │           └── upload.py          # POST /admin/upload (이미지)
│   │
│   ├── static/
│   │   └── uploads/
│   │       └── products/              # 업로드된 제품 이미지 저장
│   │
│   ├── hestia.db                      # SQLite DB 파일
│   ├── .env                           # 환경변수
│   ├── requirements.txt
│   └── seed.py                        # 초기 카테고리 데이터 입력 스크립트
│
├── .venv/                             # Python 가상환경 (기존)
└── CLAUDE.md                          # 이 파일
```

---

## 생성해야 할 파일 전체 목록

> 개발 시 이 목록을 기준으로 파일을 순서대로 생성합니다.  
> 체크박스로 진행 상황을 추적하세요.

### 백엔드 (backend/)

#### 설정 및 진입점
- [ ] `backend/requirements.txt` — Python 패키지 목록
- [ ] `backend/.env` — 환경변수 (SECRET_KEY, ADMIN 계정, DB 경로)
- [ ] `backend/app/__init__.py` — 패키지 초기화 (빈 파일)
- [ ] `backend/app/config.py` — `.env` 로드, 설정값 클래스
- [ ] `backend/app/database.py` — SQLite 연결, SQLAlchemy 엔진/세션 생성
- [ ] `backend/app/models.py` — Category, Product, Inquiry ORM 모델
- [ ] `backend/app/schemas.py` — Pydantic 요청/응답 스키마 전체
- [ ] `backend/app/crud.py` — 모든 DB CRUD 함수 (라우터 직접 접근 금지)
- [ ] `backend/app/auth.py` — JWT 발급/검증, `get_current_admin` 의존성
- [ ] `backend/app/main.py` — FastAPI 앱 생성, CORS, 라우터 등록, 정적파일 마운트
- [ ] `backend/seed.py` — 초기 카테고리 10개 데이터 입력 스크립트

#### 공개 라우터
- [ ] `backend/app/routers/__init__.py`
- [ ] `backend/app/routers/categories.py` — `GET /api/categories`
- [ ] `backend/app/routers/products.py` — `GET /api/products`, `GET /api/products/{slug}`
- [ ] `backend/app/routers/inquiry.py` — `GET /api/inquiry`, `GET /api/inquiry/{id}`, `POST /api/inquiry`

#### 관리자 라우터
- [ ] `backend/app/routers/admin/__init__.py`
- [ ] `backend/app/routers/admin/auth.py` — `POST /api/admin/login`
- [ ] `backend/app/routers/admin/categories.py` — `GET/POST/PUT/DELETE /api/admin/categories`
- [ ] `backend/app/routers/admin/products.py` — `GET/POST/PUT/DELETE /api/admin/products`
- [ ] `backend/app/routers/admin/inquiry.py` — `GET /api/admin/inquiry`, `PATCH /api/admin/inquiry/{id}/answer`, `DELETE /api/admin/inquiry/{id}`
- [ ] `backend/app/routers/admin/upload.py` — `POST /api/admin/upload` (이미지 업로드)

#### 정적 파일 디렉토리 (파일 아님, 폴더 생성)
- [ ] `backend/static/uploads/products/` — 업로드 이미지 저장 폴더

---

### 프론트엔드 (frontend/)

#### 프로젝트 설정 파일
- [ ] `frontend/package.json` — 의존성 (Next.js, shadcn/ui, embla-carousel 등)
- [ ] `frontend/tsconfig.json` — TypeScript 설정 (`@/*` 경로 alias 포함)
- [ ] `frontend/next.config.ts` — 이미지 도메인, API 리다이렉트 설정
- [ ] `frontend/tailwind.config.ts` — HESTIA 브랜드 컬러/폰트 등록
- [ ] `frontend/postcss.config.js` — Tailwind PostCSS 설정
- [ ] `frontend/components.json` — shadcn/ui 설정
- [ ] `frontend/.env.local` — `NEXT_PUBLIC_API_URL=http://localhost:8000/api`

#### 공통 스타일 및 유틸
- [ ] `frontend/src/styles/globals.css` — Tailwind 지시어, 커스텀 CSS 변수, 폰트 import
- [ ] `frontend/src/lib/types.ts` — Category, Product, Inquiry TypeScript 타입 정의
- [ ] `frontend/src/lib/api.ts` — FastAPI 호출 함수 모음 (fetch 래퍼)
- [ ] `frontend/src/lib/constants.ts` — 카테고리 슬러그, 사이트명, SNS 링크 등 상수
- [ ] `frontend/src/lib/utils.ts` — cn() 유틸, 날짜 포맷, slug 변환 함수

#### App Router — 페이지
- [ ] `frontend/src/app/layout.tsx` — 루트 레이아웃 (폰트, 메타데이터, Header+Footer 포함)
- [ ] `frontend/src/app/page.tsx` — 홈페이지 (모든 홈 섹션 조합)
- [ ] `frontend/src/app/products/page.tsx` — 전체 제품 목록
- [ ] `frontend/src/app/products/[category]/page.tsx` — 카테고리별 제품 목록
- [ ] `frontend/src/app/products/[category]/[slug]/page.tsx` — 제품 상세
- [ ] `frontend/src/app/inquiry/page.tsx` — 문의 게시판 목록
- [ ] `frontend/src/app/inquiry/write/page.tsx` — 문의 작성
- [ ] `frontend/src/app/inquiry/[id]/page.tsx` — 문의 상세 + 답변
- [ ] `frontend/src/app/about/page.tsx` — 브랜드 소개
- [ ] `frontend/src/app/admin/login/page.tsx` — 관리자 로그인
- [ ] `frontend/src/app/admin/dashboard/page.tsx` — 관리자 대시보드
- [ ] `frontend/src/app/admin/categories/page.tsx` — 카테고리 목록/추가/수정/삭제
- [ ] `frontend/src/app/admin/products/page.tsx` — 제품 목록 관리
- [ ] `frontend/src/app/admin/products/new/page.tsx` — 제품 등록
- [ ] `frontend/src/app/admin/products/[id]/page.tsx` — 제품 수정
- [ ] `frontend/src/app/admin/inquiry/page.tsx` — 문의 답변 관리

#### 레이아웃 컴포넌트
- [ ] `frontend/src/components/layout/AnnouncementBar.tsx` — 상단 공지 띠
- [ ] `frontend/src/components/layout/Header.tsx` — 로고 + 네비 + 언어토글(KR/EN)
- [ ] `frontend/src/components/layout/Navigation.tsx` — 카테고리 드롭다운 메뉴
- [ ] `frontend/src/components/layout/Footer.tsx` — 회사정보, SNS, 고객센터

#### 홈페이지 섹션 컴포넌트
- [ ] `frontend/src/components/home/HeroBanner.tsx` — 풀스크린 슬라이더 (embla-carousel)
- [ ] `frontend/src/components/home/CategoryGrid.tsx` — 카테고리 아이콘+카드 그리드
- [ ] `frontend/src/components/home/BrandStory.tsx` — 브랜드 슬로건 + HESTIA/MELASMA-X 소개
- [ ] `frontend/src/components/home/BestSellers.tsx` — 베스트셀러 4열 그리드
- [ ] `frontend/src/components/home/PromoBanner.tsx` — 프로모션 풀워스 배너
- [ ] `frontend/src/components/home/NewArrivals.tsx` — 신제품 수평 슬라이더
- [ ] `frontend/src/components/home/IngredientHighlight.tsx` — 성분 4종 인포그래픽 카드

#### 제품 컴포넌트
- [ ] `frontend/src/components/product/ProductCard.tsx` — 제품 카드 (이미지+이름+용량)
- [ ] `frontend/src/components/product/ProductGrid.tsx` — 제품 카드 그리드 래퍼
- [ ] `frontend/src/components/product/ProductGallery.tsx` — 상세 이미지 갤러리 (썸네일 + 확대)
- [ ] `frontend/src/components/product/ProductDetail.tsx` — 제품 설명, 성분, 사용법 탭

#### 문의 게시판 컴포넌트
- [ ] `frontend/src/components/inquiry/InquiryList.tsx` — 문의 목록 테이블
- [ ] `frontend/src/components/inquiry/InquiryForm.tsx` — 문의 작성 폼 (이름/이메일/제목/내용/비밀번호)
- [ ] `frontend/src/components/inquiry/InquiryDetail.tsx` — 문의 상세 + 관리자 답변 표시

#### 관리자 컴포넌트
- [ ] `frontend/src/components/admin/AdminLayout.tsx` — 사이드바 + 헤더 레이아웃 래퍼
- [ ] `frontend/src/components/admin/CategoryForm.tsx` — 카테고리 추가/수정 폼
- [ ] `frontend/src/components/admin/ProductForm.tsx` — 제품 등록/수정 폼 (이미지 포함)
- [ ] `frontend/src/components/admin/ImageUploader.tsx` — 드래그&드롭 이미지 업로드

#### shadcn/ui 컴포넌트 (npx shadcn-ui add 로 자동 생성)
- [ ] `frontend/src/components/ui/button.tsx`
- [ ] `frontend/src/components/ui/input.tsx`
- [ ] `frontend/src/components/ui/textarea.tsx`
- [ ] `frontend/src/components/ui/select.tsx`
- [ ] `frontend/src/components/ui/badge.tsx`
- [ ] `frontend/src/components/ui/card.tsx`
- [ ] `frontend/src/components/ui/dialog.tsx`
- [ ] `frontend/src/components/ui/table.tsx`
- [ ] `frontend/src/components/ui/tabs.tsx`
- [ ] `frontend/src/components/ui/toast.tsx`
- [ ] `frontend/src/components/ui/switch.tsx`

#### public 에셋 (파일 업로드, 디렉토리만 생성)
- [ ] `frontend/public/images/logo/` — HESTIA 로고 SVG/PNG
- [ ] `frontend/public/images/banners/` — 히어로 배너 이미지 (3~5장)
- [ ] `frontend/public/images/icons/` — 카테고리별 아이콘

---

### 파일 생성 순서 권장

```
1단계 (백엔드 기반)
  backend/requirements.txt → .env → app/config.py → app/database.py
  → app/models.py → app/schemas.py → app/crud.py → app/auth.py
  → app/routers/* → app/main.py → seed.py

2단계 (프론트 기반)
  frontend 초기화(npx create-next-app) → tailwind.config.ts → globals.css
  → lib/types.ts → lib/api.ts → lib/constants.ts → lib/utils.ts

3단계 (레이아웃)
  layout.tsx → Header.tsx → Navigation.tsx → Footer.tsx → AnnouncementBar.tsx

4단계 (홈페이지)
  page.tsx → HeroBanner.tsx → CategoryGrid.tsx → BestSellers.tsx
  → BrandStory.tsx → PromoBanner.tsx → NewArrivals.tsx → IngredientHighlight.tsx

5단계 (제품/문의)
  ProductCard → ProductGrid → ProductGallery → ProductDetail
  → InquiryList → InquiryForm → InquiryDetail → 각 page.tsx

6단계 (관리자)
  AdminLayout → CategoryForm → ProductForm → ImageUploader → 각 admin page.tsx
```

---

## 데이터베이스 스키마

### categories (카테고리)
```sql
id          INTEGER  PRIMARY KEY AUTOINCREMENT
name_ko     TEXT     NOT NULL          -- 한글명 (예: 스킨·토너·플루이드)
name_en     TEXT     NOT NULL          -- 영문명 (예: SKIN TONER FLUID)
slug        TEXT     NOT NULL UNIQUE   -- URL slug (예: skin-toner-fluid)
icon_url    TEXT                       -- 카테고리 아이콘 이미지 경로
sort_order  INTEGER  DEFAULT 0         -- 메뉴 정렬 순서
is_active   BOOLEAN  DEFAULT TRUE
created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
```

### products (제품)
```sql
id              INTEGER  PRIMARY KEY AUTOINCREMENT
category_id     INTEGER  NOT NULL  FK → categories.id
name            TEXT     NOT NULL       -- 제품명 영문
name_ko         TEXT                    -- 제품명 한글
slug            TEXT     NOT NULL UNIQUE
description     TEXT                    -- 제품 설명 (HTML)
ingredients     TEXT                    -- 주요 성분
volume          TEXT                    -- 용량 (예: 150ml)
skin_type       TEXT                    -- 피부 타입
how_to_use      TEXT                    -- 사용 방법
image_url       TEXT                    -- 대표 이미지 경로
image_urls      TEXT                    -- 추가 이미지 (JSON 배열)
is_bestseller   BOOLEAN  DEFAULT FALSE
is_new          BOOLEAN  DEFAULT FALSE
is_active       BOOLEAN  DEFAULT TRUE   -- 소프트 삭제
sort_order      INTEGER  DEFAULT 0
created_at      DATETIME DEFAULT CURRENT_TIMESTAMP
updated_at      DATETIME DEFAULT CURRENT_TIMESTAMP
```

### inquiries (제품 문의 게시판)
```sql
id           INTEGER  PRIMARY KEY AUTOINCREMENT
product_id   INTEGER  FK → products.id  -- NULL 허용 (일반 문의)
author_name  TEXT     NOT NULL
author_email TEXT     NOT NULL
title        TEXT     NOT NULL
content      TEXT     NOT NULL
password     TEXT     NOT NULL           -- bcrypt 해시 (수정/삭제용)
is_secret    BOOLEAN  DEFAULT FALSE      -- 비밀글
answer       TEXT                        -- 관리자 답변
answered_at  DATETIME
is_answered  BOOLEAN  DEFAULT FALSE
created_at   DATETIME DEFAULT CURRENT_TIMESTAMP
```

---

## 카테고리 초기 데이터 (10개)

| sort | name_ko | name_en | slug |
|------|---------|---------|------|
| 1 | 스킨·토너·플루이드 | SKIN TONER FLUID | skin-toner-fluid |
| 2 | 에센스·앰플 | ESSENCE AMPOULE | ampoule |
| 3 | 크림 | CREAM | cream |
| 4 | 파운데이션·쿠션 | FOUNDATION | foundation |
| 5 | 썬크림 | SUN CARE | sun-care |
| 6 | 클렌징 | CLEANSING | cleansing |
| 7 | 마스크팩·수딩젤 | MASK & SOOTHING | mask-soothing |
| 8 | 시카밤 | CICA BALM | cica-balm |
| 9 | 헬스마사지크림 | MASSAGE CREAM | massage-cream |
| 10 | 세트·기획 | SET | set |

---

## 홈페이지 섹션 구성 순서

| 순서 | 섹션 | 컴포넌트 | 데이터 |
|------|------|---------|--------|
| 1 | 공지 바 | AnnouncementBar | 정적 텍스트 |
| 2 | 헤더 + 네비 | Header + Navigation | categories API |
| 3 | 히어로 슬라이더 | HeroBanner | public/images/banners/ |
| 4 | 카테고리 그리드 | CategoryGrid | categories API |
| 5 | 브랜드 슬로건 | BrandStory | 정적 |
| 6 | 베스트셀러 | BestSellers | products?bestseller=true |
| 7 | 프로모션 배너 | PromoBanner | 정적 이미지 |
| 8 | 신제품 슬라이더 | NewArrivals | products?new=true |
| 9 | 성분 하이라이트 | IngredientHighlight | 정적 (글루타치온 등 4종) |
| 10 | 푸터 | Footer | 정적 (SNS, 연락처) |

---

## API 엔드포인트 설계

### 공개 API (인증 불필요)
```
GET  /api/categories                    카테고리 전체 목록
GET  /api/products                      제품 목록 (category, bestseller, new, page 쿼리)
GET  /api/products/{slug}               제품 상세
GET  /api/inquiry                       문의 목록 (page 쿼리)
GET  /api/inquiry/{id}                  문의 상세 (비밀글 시 password 필요)
POST /api/inquiry                       문의 작성
```

### 관리자 API (JWT Bearer 필요)
```
POST   /api/admin/login                 로그인 → JWT 발급
GET    /api/admin/categories            카테고리 목록
POST   /api/admin/categories            카테고리 추가
PUT    /api/admin/categories/{id}       카테고리 수정
DELETE /api/admin/categories/{id}       카테고리 삭제
GET    /api/admin/products              제품 목록 (필터+페이징)
POST   /api/admin/products              제품 등록
PUT    /api/admin/products/{id}         제품 수정
DELETE /api/admin/products/{id}         제품 삭제 (소프트)
POST   /api/admin/upload                이미지 업로드 → URL 반환
GET    /api/admin/inquiry               문의 목록 (미답변 우선)
PATCH  /api/admin/inquiry/{id}/answer   답변 작성/수정
DELETE /api/admin/inquiry/{id}          문의 삭제
```

---

## 브랜드 디자인 가이드

### 컬러 팔레트 (tailwind.config.ts에 등록)
```js
colors: {
  hestia: {
    gold:    '#C9A96E',   // 메인 골드 — 로고, 버튼, 강조
    cream:   '#F9F5EF',   // 배경 크림 — 전체 배경
    dark:    '#1C1C1C',   // 거의 검정 — 텍스트
    gray:    '#6B6B6B',   // 보조 텍스트
    white:   '#FFFFFF',
    light:   '#F0EBE3',   // 섹션 구분 배경
  }
}
```

### 폰트
- 영문 헤딩: `Playfair Display` (Google Fonts) — 고급스러운 세리프
- 영문 본문: `Inter` — 가독성 좋은 산세리프
- 한글: `Noto Sans KR` (Google Fonts)

### 톤 앤 매너
- 고급스럽고 깔끔한 미니멀 디자인
- 흰색/크림색 배경에 골드 포인트 컬러
- coszonemall.com 레이아웃 참조하되 더 세련되게

---

## 코딩 규칙

### Next.js (TypeScript)
- 컴포넌트명: PascalCase
- 파일명: PascalCase (컴포넌트), kebab-case (페이지 폴더)
- Server Component 기본, 인터랙션 필요한 경우만 `"use client"`
- API 호출: `lib/api.ts`에서만 수행 (컴포넌트 내 fetch 직접 작성 금지)
- 타입: `lib/types.ts`에 중앙 관리
- 이미지: 반드시 `next/image` 컴포넌트 사용

### FastAPI (Python)
- 함수명: snake_case
- 모든 DB 조작: `crud.py`에서만 수행 (라우터 직접 DB 접근 금지)
- 요청/응답: Pydantic 스키마로 반드시 검증
- 파일 업로드: jpg/jpeg/png/webp만 허용, 최대 5MB, 저장명 UUID 재생성
- 관리자 라우터: 전체에 `Depends(get_current_admin)` 의존성 주입
- CORS: 개발 시 localhost:3000, 운영 시 실제 도메인만 허용

### 보안
- 관리자 비밀번호: bcrypt 해시, `.env`에 저장, 평문 절대 금지
- JWT: `python-jose`, SECRET_KEY는 `.env`에서 로드
- 이미지: 저장 경로 traversal 방지, UUID 파일명 강제
- SQL: SQLAlchemy ORM만 사용 (raw query 금지)

---

## 환경변수

### backend/.env
```env
SECRET_KEY=your-very-long-secret-key-here
ADMIN_USERNAME=admin
ADMIN_PASSWORD_HASH=bcrypt-hashed-password
DATABASE_URL=sqlite:///./hestia.db
UPLOAD_DIR=static/uploads/products
MAX_UPLOAD_SIZE_MB=5
CORS_ORIGINS=http://localhost:3000
```

### frontend/.env.local
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

---

## 개발 실행 방법

```bash
# 백엔드 실행
cd backend
source ../.venv/Scripts/activate   # Windows Git Bash
pip install -r requirements.txt
python seed.py                     # 초기 카테고리 데이터 입력
uvicorn app.main:app --reload --port 8000

# 프론트엔드 실행 (별도 터미널)
cd frontend
npm install
npm run dev                        # http://localhost:3000
```

---

## requirements.txt (백엔드)
```
fastapi
uvicorn[standard]
sqlalchemy
pydantic[email]
python-dotenv
python-jose[cryptography]
passlib[bcrypt]
python-multipart
aiofiles
pillow
```

## package.json 주요 의존성 (프론트엔드)
```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "embla-carousel-react": "latest",
    "lucide-react": "latest",
    "clsx": "latest",
    "tailwind-merge": "latest"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "@types/node": "latest",
    "@types/react": "latest",
    "tailwindcss": "^3.0.0",
    "autoprefixer": "latest",
    "postcss": "latest"
  }
}
```

---

## 참조
- 레이아웃 참조: https://coszonemall.com/
- 브랜드 자료: D:\화장품\홈피\홈피자료1.xlsx

## 개발 진행 현황
- [x] 프로젝트 기획 및 CLAUDE.md 작성 (Next.js + FastAPI)
- [ ] 백엔드 기본 구조 생성 (FastAPI + SQLite)
- [ ] DB 모델 및 초기 카테고리 데이터 (seed.py)
- [ ] 백엔드 API 전체 구현
- [ ] Next.js 프로젝트 초기화 (shadcn/ui 세팅)
- [ ] 공통 레이아웃 (Header, Footer, Navigation)
- [ ] 홈페이지 섹션별 컴포넌트 개발
- [ ] 제품 목록 / 상세 페이지
- [ ] 문의 게시판
- [ ] 관리자 페이지 (카테고리, 제품, 문의 CRUD)
- [ ] 브랜드 디자인 완성 (골드 팔레트, Playfair Display)
- [ ] 테스트 및 배포
