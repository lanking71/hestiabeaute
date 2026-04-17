// =====================================================
// 📁 layout.tsx — 모든 페이지의 공통 틀(레이아웃)
// =====================================================
// 이 파일은 웹사이트의 모든 페이지에 공통으로 적용되는
// "뼈대"를 정의해요.
//
// 예를 들어 상단 공지바, 헤더(메뉴), 하단 푸터는
// 모든 페이지에서 똑같이 나오잖아요?
// 이 파일이 그 공통 부분을 담당해요.
//
// children: 각 페이지의 고유한 내용이 여기에 들어가요
// (홈페이지면 홈 내용, 제품 페이지면 제품 내용)
// =====================================================

import type { Metadata } from "next";
// Google Fonts에서 폰트 가져오기
import { Cormorant_Garamond, DM_Sans, Noto_Sans_KR } from "next/font/google";
import "@/styles/globals.css";  // 전체 사이트 공통 CSS
import AnnouncementBar from "@/components/layout/AnnouncementBar";  // 상단 공지 띠
import Header from "@/components/layout/Header";                    // 헤더 (로고+메뉴)
import Footer from "@/components/layout/Footer";                    // 하단 푸터
import { getCategories } from "@/lib/api";
import { SITE_NAME, SITE_DESCRIPTION } from "@/lib/constants";


// ─────────────────────────────────────────
// 🔤 폰트 설정
// ─────────────────────────────────────────

// Cormorant Garamond: 고급스러운 세리프(삐침 있는) 영문 폰트
// → 로고, 큰 제목 등 고급스러운 느낌이 필요한 곳에 사용
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",  // CSS 변수로 사용 가능하게 이름 지정
  weight: ["300", "400", "500", "600", "700"],  // 사용할 두께들
  style: ["normal", "italic"],
  display: "swap",  // 폰트 로딩 전에 임시 폰트로 먼저 표시 (깜빡임 방지)
});

// DM Sans: 깔끔한 산세리프(삐침 없는) 영문 폰트
// → 본문, 버튼 등 읽기 쉬운 곳에 사용
const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

// Noto Sans KR: 한글 폰트
// → 모든 한글 텍스트에 사용
const notoSansKR = Noto_Sans_KR({
  subsets: ["latin"],
  variable: "--font-noto",
  weight: ["300", "400", "500", "700"],
  display: "swap",
});

// force-dynamic: 이 레이아웃은 항상 서버에서 새로 렌더링
// (캐시 없이 최신 카테고리 데이터를 가져오기 위해)
export const dynamic = "force-dynamic";


// ─────────────────────────────────────────
// 📋 SEO 메타데이터 설정
// ─────────────────────────────────────────
// 검색 엔진(구글 등)이 이 사이트를 이해하는 데 필요한 정보
export const metadata: Metadata = {
  title: {
    default: SITE_NAME,                    // 기본 탭 제목: "HESTIA Beauty"
    template: `%s | ${SITE_NAME}`,         // 하위 페이지: "제품 | HESTIA Beauty"
  },
  description: SITE_DESCRIPTION,           // 검색 결과에서 보이는 설명
  keywords: ["헤스티아", "HESTIA", "글루타치온", "화장품", "기미", "MELASMA-X", "스킨케어"],
};


// ─────────────────────────────────────────
// 🏗️ 루트 레이아웃 컴포넌트
// ─────────────────────────────────────────

// async function: 서버에서 실행되는 비동기 함수
// → 백엔드에서 카테고리 목록을 미리 가져와서 헤더에 넘겨줘요
export default async function RootLayout({
  children,  // 각 페이지의 고유 내용
}: {
  children: React.ReactNode;
}) {
  // 카테고리 목록 가져오기 (실패하면 빈 배열로 대체)
  const categories = await getCategories().catch(() => []);

  return (
    // lang="ko": 검색 엔진과 스크린리더에게 "한국어 사이트"임을 알려줌
    // 폰트 변수들을 html 태그에 적용 → 모든 하위 요소에서 CSS 변수로 사용 가능
    <html lang="ko" className={`${cormorant.variable} ${dmSans.variable} ${notoSansKR.variable}`}>
      <body className="antialiased bg-hestia-cream text-hestia-dark min-h-screen flex flex-col">
        {/* 상단 공지 띠 (무료 배송 등 이벤트 공지) */}
        <AnnouncementBar />

        {/* 헤더: 로고 + 카테고리 네비게이션 메뉴 */}
        <Header categories={categories} />

        {/* 메인 콘텐츠: 각 페이지마다 다른 내용이 들어가는 영역 */}
        <main className="flex-1">{children}</main>

        {/* 하단 푸터: 회사 정보, SNS, 고객센터 */}
        <Footer />
      </body>
    </html>
  );
}
