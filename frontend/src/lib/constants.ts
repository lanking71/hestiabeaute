export const SITE_NAME = "HESTIA Beauty";
export const SITE_DESCRIPTION = "글루타치온 기반 프리미엄 화장품 브랜드 HESTIA";
export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export const CATEGORY_SLUGS = [
  "skin-toner-fluid",
  "ampoule",
  "cream",
  "foundation",
  "sun-care",
  "cleansing",
  "mask-soothing",
  "cica-balm",
  "massage-cream",
  "set",
] as const;

export const NAV_LINKS = [
  { label: "홈", href: "/" },
  { label: "제품", href: "/products" },
  { label: "브랜드 소개", href: "/about" },
  { label: "제품 문의", href: "/inquiry" },
];

export const BRAND_SNS = {
  instagram: "#",
  facebook: "#",
  youtube: "#",
  kakao: "#",
};

export const BRAND_CONTACT = {
  phone: "1234-5678",
  email: "contact@hestiabeauty.com",
  hours: "평일 09:00 ~ 18:00 (주말·공휴일 휴무)",
};

export const HERO_BANNERS = [
  {
    id: 1,
    title: "글루타치온의 힘",
    subtitle: "피부 깊은 곳부터 빛나는 투명함",
    image: "/images/banners/banner1.jpg",
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

export const INGREDIENTS = [
  {
    name: "Glutathione",
    name_ko: "글루타치온",
    description: "강력한 항산화 성분으로 멜라닌 생성을 억제하고 피부 톤을 균일하게 개선",
    icon: "✦",
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
