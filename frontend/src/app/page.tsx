// =====================================================
// 📁 page.tsx (홈) — 웹사이트 첫 화면 (/)
// =====================================================
// 이 파일은 http://localhost:3000/ 에 접속했을 때
// 보이는 홈페이지를 만드는 파일이에요.
//
// 홈페이지 구성 (위에서 아래 순서):
//   1. HeroBanner    — 큰 슬라이더 이미지 (배너)
//   2. CategoryProductGrid — 카테고리별 제품 그리드
//   3. BrandStory    — HESTIA / MELASMA-X 브랜드 소개
//   4. PromoBanner   — MELASMA-X 프로모션 배너
//   5. IngredientHighlight — 핵심 성분 4가지 소개
// =====================================================

// 백엔드 API에서 데이터 가져오는 함수들
import { getCategories, getProducts, getBanners } from "@/lib/api";

// 홈페이지 섹션 컴포넌트들
import HeroBanner from "@/components/home/HeroBanner";
import CategoryProductGrid from "@/components/home/CategoryProductGrid";
import BrandStory from "@/components/home/BrandStory";
import PromoBanner from "@/components/home/PromoBanner";
import IngredientHighlight from "@/components/home/IngredientHighlight";

// revalidate = 0: 이 페이지는 캐시 없이 항상 새로 렌더링
// (제품, 배너가 바뀌어도 즉시 반영)
export const revalidate = 0;

// async function: 서버에서 실행되는 비동기 함수
// Next.js App Router에서는 서버 컴포넌트가 기본이에요.
// 서버에서 미리 데이터를 가져온 후 HTML을 만들어 보내줘요.
// (SEO에 유리하고 첫 로딩이 빨라요)
export default async function HomePage() {
  // Promise.all: 세 개의 API 요청을 동시에 보내기 (하나씩 기다리는 것보다 빠름)
  // 각각 실패하면 catch(() => ...)로 기본값 사용
  const [categories, banners, allProducts] = await Promise.all([
    getCategories().catch(() => []),                          // 카테고리 목록
    getBanners().catch(() => []),                             // 배너 목록
    getProducts({ size: 200 }).catch(() => ({ items: [] })), // 제품 전체 (최대 200개)
  ]);

  return (
    <>
      {/* 1️⃣ 히어로 배너: 화면 전체를 차지하는 슬라이더 */}
      <HeroBanner banners={banners} />

      {/* 2️⃣ 카테고리별 제품 그리드: 카테고리마다 제품들을 나열 */}
      <CategoryProductGrid categories={categories} products={allProducts.items} />

      {/* 3️⃣ 브랜드 이야기: HESTIA와 MELASMA-X 소개 */}
      <BrandStory />

      {/* 4️⃣ 프로모션 배너: MELASMA-X 라인 홍보 */}
      <PromoBanner />

      {/* 5️⃣ 핵심 성분 소개: 글루타치온, 세라마이드, EGF, 콜라겐 */}
      <IngredientHighlight />
    </>
  );
}
