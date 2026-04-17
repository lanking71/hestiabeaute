// =====================================================
// 📁 Navigation.tsx — PC 카테고리 가로 메뉴
// =====================================================
// PC 화면(1024px 이상)에서 헤더 아랫줄에 표시되는
// 카테고리 가로 메뉴 컴포넌트예요.
//
// 기능:
// - 모든 카테고리를 가로로 나열
// - 현재 보고 있는 카테고리에 골드 밑줄 표시
// - 마우스 호버 시 밑줄이 슥 나타나는 애니메이션
//
// "use client": usePathname 훅(현재 URL 감지)을 사용하기 때문에
// 브라우저에서 실행되어야 함
// =====================================================

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";  // 현재 URL 경로를 알려주는 훅
import { Category } from "@/lib/types";
import { cn } from "@/lib/utils";

// Navigation이 받을 props 타입
interface NavigationProps {
  categories: Category[];  // 표시할 카테고리 목록
}

export default function Navigation({ categories }: NavigationProps) {
  // usePathname: 현재 URL 경로를 문자열로 반환
  // 예) /products/cream → "/products/cream"
  const pathname = usePathname();

  return (
    // hidden lg:flex: PC에서만 보임 (모바일은 Header.tsx에서 별도 처리)
    <nav className="hidden lg:flex items-center">
      <div className="flex items-center">
        {categories.map((cat, i) => (
          <Link
            key={cat.id}
            href={`/products/${cat.slug}`}
            className={cn(
              // 기본 스타일: 패딩, 글씨 크기, 간격, 대문자 변환
              "relative px-3 xl:px-4 py-1 text-[11px] tracking-[0.15em] font-medium uppercase transition-colors whitespace-nowrap",
              // after: CSS 의사 요소(::after)로 밑줄 효과 구현
              // absolute, 하단에 위치, 중앙 정렬, 1px 높이
              "after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:h-px after:bg-hestia-gold after:transition-all after:duration-300",
              // 현재 페이지의 카테고리는 골드 색상 + 밑줄 full 너비
              pathname === `/products/${cat.slug}`
                ? "text-hestia-gold after:w-full"
                // 호버 시: 골드 색상으로 변경 + 밑줄이 0에서 full로 확장
                : "text-hestia-dark hover:text-hestia-gold after:w-0 hover:after:w-full",
              // 마지막 항목 제외하고 오른쪽에 얇은 구분선 추가
              i < categories.length - 1 && "border-r border-hestia-muted"
            )}
          >
            {cat.name_en}  {/* 영문 카테고리명 표시 */}
          </Link>
        ))}
      </div>
    </nav>
  );
}
