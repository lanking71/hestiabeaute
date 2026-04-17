// =====================================================
// 📁 ProductDetail.tsx — 제품 상세 정보 컴포넌트
// =====================================================
// 제품 상세 페이지 오른쪽에 표시되는 제품 정보 컴포넌트예요.
//
// 구성:
//   - 카테고리 링크
//   - 제품명 (한글/영문)
//   - NEW / BEST SELLER 배지
//   - 용량 / 피부 타입
//   - 탭 (제품 설명 / 성분 / 사용 방법)
//
// 탭 기능: 클릭한 탭에 따라 다른 내용 표시
// "use client": useState 사용으로 브라우저에서 실행
// =====================================================

"use client";

import { useState } from "react";
import { Product } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Link from "next/link";

// ProductDetail이 받을 props 타입
interface ProductDetailProps {
  product: Product;
}

const ALL_TABS = [
  { id: "description", label: "제품 설명" },
  { id: "ingredients", label: "성분" },
  { id: "how_to_use", label: "사용 방법" },
];

export default function ProductDetail({ product }: ProductDetailProps) {
  // 값이 있는 탭만 필터링
  const TABS = ALL_TABS.filter(({ id }) => {
    if (id === "description") return !!product.description;
    if (id === "ingredients") return !!product.ingredients;
    if (id === "how_to_use") return !!product.how_to_use;
    return false;
  });

  // 첫 번째 유효 탭을 기본값으로
  const [tab, setTab] = useState(TABS[0]?.id || "");

  return (
    <div className="space-y-6">

      {/* ── 카테고리 링크 ── */}
      {/* product.category가 있을 때만 렌더링 */}
      {product.category && (
        <Link
          href={`/products/${product.category.slug}`}
          className="text-xs text-hestia-gold uppercase tracking-widest hover:underline"
        >
          {product.category.name_en}
        </Link>
      )}

      {/* ── 제품명 ── */}
      <div>
        {/* 한글명 큰 글씨, 영문명 작은 보조 텍스트 */}
        <h1 className="font-playfair text-3xl font-bold text-hestia-dark mb-1">
          {product.name_ko || product.name}
        </h1>
        <p className="text-hestia-gray text-sm">{product.name}</p>
      </div>

      {/* ── 배지 ── */}
      <div className="flex gap-2">
        {product.is_new && <Badge variant="default">NEW</Badge>}
        {product.is_bestseller && <Badge variant="secondary">BEST SELLER</Badge>}
      </div>

      {/* ── 용량 / 피부 타입 ── */}
      <div className="flex gap-6 text-sm text-hestia-gray">
        {product.volume && (
          <div>
            <span className="font-medium text-hestia-dark">용량</span>{" "}
            <span>{product.volume}</span>
          </div>
        )}
        {product.skin_type && (
          <div>
            <span className="font-medium text-hestia-dark">피부 타입</span>{" "}
            <span>{product.skin_type}</span>
          </div>
        )}
      </div>

      {/* 구분선 */}
      <div className="w-full h-px bg-hestia-light" />

      {/* ── 탭 메뉴 (값이 있는 탭만 표시) ── */}
      {TABS.length > 0 && (
        <div>
          <div className="flex border-b border-hestia-light">
            {TABS.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={cn(
                  "px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors",
                  tab === id
                    ? "border-hestia-gold text-hestia-gold"
                    : "border-transparent text-hestia-gray hover:text-hestia-dark"
                )}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="py-6 text-sm text-hestia-dark leading-relaxed">
            {tab === "description" && (
              <div dangerouslySetInnerHTML={{ __html: product.description! }} />
            )}
            {tab === "ingredients" && (
              <p className="whitespace-pre-line">{product.ingredients}</p>
            )}
            {tab === "how_to_use" && (
              <p className="whitespace-pre-line">{product.how_to_use}</p>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
