// =====================================================
// 📁 types.ts — TypeScript 타입(자료형) 정의
// =====================================================
// 이 파일은 프로그램에서 사용하는 데이터의 모양을
// 미리 정의해 두는 파일이에요.
//
// 예를 들어, "제품 정보에는 이름, 가격, 이미지가 있어야 해"
// 처럼 규칙을 만들어두면, 나중에 실수로 잘못된 데이터를
// 사용하려 할 때 TypeScript가 바로 오류를 알려줘요.
//
// interface: 데이터의 설계도(청사진) — 어떤 항목이
// 있어야 하는지, 어떤 타입인지 정의
// =====================================================


// ─────────────────────────────────────────
// 📂 카테고리 타입
// ─────────────────────────────────────────
export interface Category {
  id: number;           // 카테고리 번호 (예: 1, 2, 3...)
  name_ko: string;      // 한글 이름 (예: "스킨·토너·플루이드")
  name_en: string;      // 영문 이름 (예: "SKIN TONER FLUID")
  slug: string;         // URL용 짧은 텍스트 (예: "skin-toner-fluid")
  icon_url?: string;    // 아이콘 이미지 경로 (없을 수도 있음, ?는 선택적)
  sort_order: number;   // 정렬 순서 (숫자 작을수록 먼저 표시)
  is_active: boolean;   // 활성 여부 (true=보임, false=숨김)
  created_at: string;   // 생성 날짜/시간 문자열
}


// ─────────────────────────────────────────
// 💄 제품 타입
// ─────────────────────────────────────────
export interface Product {
  id: number;              // 제품 번호
  category_id: number;     // 어느 카테고리인지 (번호)
  category?: Category;     // 카테고리 전체 정보 (있을 수도, 없을 수도)
  name: string;            // 영문 제품명
  name_ko?: string;        // 한글 제품명 (선택)
  slug: string;            // URL용 짧은 텍스트 (예: "glutathione-cream")
  description?: string;    // 제품 설명 (HTML 포함 가능)
  ingredients?: string;    // 주요 성분
  volume?: string;         // 용량 (예: "150ml")
  skin_type?: string;      // 피부 타입 (예: "모든 피부 타입")
  how_to_use?: string;     // 사용 방법
  image_url?: string;      // 대표 이미지 경로 (목록에서 보이는 이미지)
  image_urls?: string[];   // 상세페이지 이미지 여러 장 (배열)
  is_bestseller: boolean;  // 베스트셀러 여부 → true면 "BEST" 배지 표시
  is_new: boolean;         // 신제품 여부 → true면 "NEW" 배지 표시
  is_active: boolean;      // 활성 여부
  sort_order: number;      // 정렬 순서
  created_at: string;      // 등록 날짜
  updated_at: string;      // 마지막 수정 날짜
}


// ─────────────────────────────────────────
// 🖼️ 배너 타입 (홈 화면 슬라이더)
// ─────────────────────────────────────────
export interface Banner {
  id: number;            // 배너 번호
  title: string;         // 큰 제목
  subtitle?: string;     // 부제목 (선택)
  image_url?: string;    // 배너 이미지 경로
  link_url?: string;     // 클릭 시 이동할 주소
  sort_order: number;    // 표시 순서
  is_active: boolean;    // 활성 여부
  created_at: string;    // 등록 날짜
}


// ─────────────────────────────────────────
// 💬 문의 타입
// ─────────────────────────────────────────
export interface Inquiry {
  id: number;             // 문의 번호
  product_id?: number;    // 어떤 제품 문의인지 (없으면 일반 문의)
  product?: Product;      // 제품 전체 정보 (있을 수도)
  author_name: string;    // 작성자 이름
  author_email: string;   // 작성자 이메일
  title: string;          // 제목
  content: string;        // 내용
  is_secret: boolean;     // 비밀글 여부 → true면 본인과 관리자만 볼 수 있음
  answer?: string;        // 관리자 답변 (아직 없으면 undefined)
  answered_at?: string;   // 답변 날짜
  is_answered: boolean;   // 답변 완료 여부 → false면 "대기중" 표시
  created_at: string;     // 작성 날짜
}


// ─────────────────────────────────────────
// 📝 문의 작성 타입 (보내는 데이터 형식)
// ─────────────────────────────────────────
export interface InquiryCreate {
  product_id?: number;    // 어떤 제품 문의인지 (선택)
  author_name: string;    // 이름 (필수)
  author_email: string;   // 이메일 (필수)
  title: string;          // 제목 (필수)
  content: string;        // 내용 (필수)
  password: string;       // 비밀번호 (나중에 내용 확인용)
  is_secret?: boolean;    // 비밀글 여부 (선택, 기본값 false)
}


// ─────────────────────────────────────────
// 📄 페이지 나누기(페이징) 응답 타입
// ─────────────────────────────────────────
// 제네릭(<T>): 어떤 타입이든 담을 수 있는 만능 형식
// 예) PaginatedResponse<Product> → 제품 목록용
// 예) PaginatedResponse<Inquiry> → 문의 목록용
export interface PaginatedResponse<T> {
  items: T[];     // 현재 페이지의 데이터 목록
  total: number;  // 전체 데이터 수 (예: 150)
  page: number;   // 현재 페이지 번호 (1부터 시작)
  size: number;   // 한 페이지당 데이터 수 (예: 20)
  pages: number;  // 전체 페이지 수 (예: 8)
}


// ─────────────────────────────────────────
// 🔑 관리자 토큰 타입
// ─────────────────────────────────────────
export interface AdminToken {
  access_token: string;   // 로그인 성공 시 받는 JWT 토큰 문자열
  token_type: string;     // 항상 "bearer"
}
