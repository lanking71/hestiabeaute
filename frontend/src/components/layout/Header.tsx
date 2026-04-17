// =====================================================
// 📁 Header.tsx — 상단 헤더 (로고 + 메뉴)
// =====================================================
// 모든 페이지 상단에 고정되는 헤더 컴포넌트예요.
// 구성:
//   - 위쪽 줄: 로고(HESTIA BEAUTY) + 우측 버튼들
//   - 아래 줄: 카테고리 네비게이션 메뉴 (PC)
//   - 모바일 메뉴: 햄버거 버튼 클릭 시 펼쳐지는 메뉴
//
// "use client": 이 컴포넌트는 브라우저에서 실행
// → useState, useEffect 같은 상호작용 기능 사용 가능
// =====================================================

"use client";

// React 훅: 상태(state)와 부수 효과(effect) 관리
import { useState, useEffect } from "react";
import Link from "next/link";                    // Next.js 링크 컴포넌트
import { Menu, X, Search } from "lucide-react";  // 아이콘 컴포넌트들
import Navigation from "./Navigation";           // 카테고리 메뉴
import { Category } from "@/lib/types";
import { cn } from "@/lib/utils";

// 헤더가 받을 데이터(props) 타입 정의
interface HeaderProps {
  categories: Category[];  // 카테고리 목록 (Navigation에 전달)
}

export default function Header({ categories }: HeaderProps) {
  // 📱 모바일 메뉴 열림/닫힘 상태 (true=열림, false=닫힘)
  const [mobileOpen, setMobileOpen] = useState(false);

  // 📜 스크롤 여부 상태 (스크롤하면 헤더에 그림자 추가)
  const [scrolled, setScrolled] = useState(false);

  // useEffect: 컴포넌트가 화면에 처음 나타날 때 실행
  useEffect(() => {
    // 스크롤 이벤트 감지 함수
    const handler = () => setScrolled(window.scrollY > 10);  // 10px 이상 스크롤하면 true
    window.addEventListener("scroll", handler);  // 스크롤 시 handler 실행
    // cleanup 함수: 컴포넌트가 사라질 때 이벤트 리스너 제거 (메모리 누수 방지)
    return () => window.removeEventListener("scroll", handler);
  }, []); // 빈 배열 = 처음 한 번만 실행

  return (
    <header
      className={cn(
        "sticky top-0 z-40 bg-white transition-shadow",
        // 스크롤되었으면 그림자 추가 (헤더가 내용 위에 떠 있는 느낌)
        scrolled && "shadow-sm"
      )}
    >
      {/* ── 상단 줄: 로고 + 우측 버튼들 ── */}
      <div className="max-w-[1600px] mx-auto px-6 lg:px-10">
        <div className="flex items-center justify-between h-14 border-b border-hestia-muted">

          {/* 로고: 클릭하면 홈으로 이동 */}
          <Link href="/" className="flex items-center gap-2">
            <span className="font-cormorant text-2xl font-semibold tracking-[0.25em] text-hestia-dark">
              HESTIA
            </span>
            {/* sm:block: 작은 화면에서는 숨기고 640px 이상에서만 표시 */}
            <span className="text-[10px] text-hestia-gold font-medium tracking-[0.2em] hidden sm:block">
              BEAUTY
            </span>
          </Link>

          {/* 우측 버튼들: 문의 링크 + 검색 아이콘 + 모바일 메뉴 버튼 */}
          <div className="flex items-center gap-4">
            {/* hidden md:block: 모바일에서는 숨기고 768px 이상(PC)에서만 표시 */}
            <Link
              href="/inquiry"
              className="hidden md:block text-[11px] tracking-[0.2em] text-hestia-gray hover:text-hestia-gold transition-colors uppercase"
            >
              문의
            </Link>

            {/* 검색 버튼 (현재는 아이콘만 있고 기능 미구현) */}
            <button className="p-1.5 hover:text-hestia-gold transition-colors" aria-label="검색">
              <Search className="h-4 w-4" />
            </button>

            {/* 햄버거 메뉴 버튼: lg:hidden = PC에서는 숨김, 모바일에서만 표시 */}
            <button
              className="lg:hidden p-1.5 hover:text-hestia-gold transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}  // 클릭할 때마다 열림/닫힘 토글
              aria-label="메뉴"
            >
              {/* 메뉴가 열려있으면 X 아이콘, 닫혀있으면 햄버거(≡) 아이콘 */}
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* ── 카테고리 네비게이션 줄 (PC에서만 표시) ── */}
        {/* hidden lg:flex: 모바일에서는 숨기고 1024px 이상에서만 표시 */}
        <div className="hidden lg:flex items-center justify-center py-2.5 overflow-x-auto">
          <Navigation categories={categories} />
        </div>
      </div>

      {/* ── 모바일 펼침 메뉴 ── */}
      {/* mobileOpen이 true일 때만 렌더링 (&&는 "그리고"라는 뜻) */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-hestia-muted bg-white">
          <nav className="px-6 py-4 space-y-1">
            {/* 카테고리마다 링크 생성 */}
            {categories.map((cat) => (
              <Link
                key={cat.id}  // React가 목록을 효율적으로 관리하기 위한 고유 키
                href={`/products/${cat.slug}`}  // 템플릿 리터럴로 URL 생성
                className="block py-2.5 text-xs tracking-[0.15em] text-hestia-dark hover:text-hestia-gold border-b border-hestia-muted/50 uppercase"
                onClick={() => setMobileOpen(false)}  // 링크 클릭 시 메뉴 닫기
              >
                {cat.name_en}
                <span className="ml-2 text-hestia-gray normal-case tracking-normal">{cat.name_ko}</span>
              </Link>
            ))}

            {/* 문의 링크 */}
            <Link
              href="/inquiry"
              className="block pt-3 text-xs tracking-[0.15em] text-hestia-dark hover:text-hestia-gold uppercase"
              onClick={() => setMobileOpen(false)}
            >
              제품 문의
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
