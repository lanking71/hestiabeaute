// =====================================================
// 📁 constants.ts — 변하지 않는 고정 값들 모음
// =====================================================
// 이 파일은 프로그램 여러 곳에서 사용하는 고정된 값들을
// 한 곳에 모아두는 파일이에요.
//
// "상수(constant)"란 절대 변하지 않는 값을 말해요.
// 예) 사이트 이름, 카테고리 목록, 연락처 정보 등
//
// 한 곳에 모아두면 나중에 값을 바꿀 때
// 이 파일 하나만 수정하면 돼서 편리해요!
// =====================================================

// 🏷️ 사이트 기본 정보
export const SITE_NAME = "HESTIA Beauty";
export const SITE_DESCRIPTION = "글루타치온 기반 프리미엄 화장품 브랜드 HESTIA";
export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

// 📂 카테고리 슬러그 목록 (URL에 사용되는 영문 텍스트들)
// "as const": 이 배열은 절대 변경 불가 (읽기 전용)
export const CATEGORY_SLUGS = [
  "skin-toner-fluid",  // 스킨·토너·플루이드
  "ampoule",           // 에센스·앰플
  "cream",             // 크림
  "foundation",        // 파운데이션·쿠션
  "sun-care",          // 썬크림
  "cleansing",         // 클렌징
  "mask-soothing",     // 마스크팩·수딩젤
  "cica-balm",         // 시카밤
  "massage-cream",     // 헬스마사지크림
  "set",               // 세트·기획
] as const;

// 🔗 상단 네비게이션 메뉴 링크
// label: 화면에 보이는 텍스트, href: 클릭 시 이동할 주소
export const NAV_LINKS = [
  { label: "홈", href: "/" },
  { label: "제품", href: "/products" },
  { label: "브랜드 소개", href: "/about" },
  { label: "제품 문의", href: "/inquiry" },
];

// 📱 소셜 미디어 링크 (현재는 # 임시 처리 — 실제 주소로 교체 필요)
export const BRAND_SNS = {
  instagram: "#",  // 인스타그램
  facebook: "#",   // 페이스북
  youtube: "#",    // 유튜브
  kakao: "#",      // 카카오
};

// 📞 고객센터 연락처 정보
export const BRAND_CONTACT = {
  phone: "1234-5678",
  email: "contact@hestiabeauty.com",
  hours: "평일 09:00 ~ 18:00 (주말·공휴일 휴무)",
};

// 🖼️ 히어로 배너 기본 데이터 (DB에 배너가 없을 때 대신 사용)
// 현재는 DB의 배너 데이터를 사용하므로 이 상수는 참고용
export const HERO_BANNERS = [
  {
    id: 1,
    title: "글루타치온의 힘",
    subtitle: "피부 깊은 곳부터 빛나는 투명함",
    image: "/images/banners/banner1.jpg",  // public/images/banners/에 저장된 이미지
    href: "/products",
  },
  {
    id: 2,
    title: "MELASMA-X",
    subtitle: "기미·잡티 전문 집중 케어 라인",
    image: "/images/banners/banner2.jpg",
    href: "/products/cream",
  },
  {
    id: 3,
    title: "HESTIA 헤스티아",
    subtitle: "자연에서 온 성분, 과학으로 완성한 아름다움",
    image: "/images/banners/banner3.jpg",
    href: "/about",
  },
];

// 🧴 핵심 성분 4가지 정보 (IngredientHighlight 컴포넌트에서 사용)
export const INGREDIENTS = [
  {
    name: "Glutathione",
    name_ko: "글루타치온",
    description: "강력한 항산화 성분으로 멜라닌 생성을 억제하고 피부 톤을 균일하게 개선",
    icon: "✦",  // 화면에 표시할 장식 아이콘
  },
  {
    name: "Ceramide",
    name_ko: "세라마이드",
    description: "피부 장벽을 강화하고 수분 손실을 막아 촉촉하고 건강한 피부 유지",
    icon: "◈",
  },
  {
    name: "EGF",
    name_ko: "EGF 펩타이드",
    description: "표피 성장 인자로 피부 재생을 촉진하고 탄력과 윤기를 되찾아 줌",
    icon: "◉",
  },
  {
    name: "Collagen",
    name_ko: "콜라겐",
    description: "피부 탄력의 핵심 단백질로 주름 개선 및 피부 볼륨 회복에 도움",
    icon: "◆",
  },
];
