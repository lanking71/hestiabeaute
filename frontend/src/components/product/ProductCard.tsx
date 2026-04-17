// =====================================================
// 📁 ProductCard.tsx — 제품 카드 컴포넌트
// =====================================================
// 제품 목록 페이지에서 각 제품을 카드 형태로 보여주는
// 컴포넌트예요.
//
// 카드 구성:
//   - 제품 이미지 (호버 시 살짝 확대)
//   - NEW / BEST 배지
//   - 카테고리명 (골드)
//   - 제품명
//   - 용량
//
// 카드 클릭 시 해당 제품 상세 페이지로 이동
// =====================================================

import Link from "next/link";
import Image from "next/image";
import { Product } from "@/lib/types";
import { Badge } from "@/components/ui/badge";  // shadcn/ui 배지 컴포넌트
import { getImageUrl } from "@/lib/utils";

// ProductCard가 받을 props 타입
interface ProductCardProps {
  product: Product;  // 표시할 제품 데이터
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    // Link: 카드 전체가 링크 (클릭 시 제품 상세로 이동)
    // group: 이 요소에 마우스를 올리면 group-hover: 스타일이 적용됨
    <Link
      href={`/products/${product.category?.slug ?? "all"}/${product.slug}`}
      className="group block bg-white rounded-sm border border-hestia-light hover:shadow-md hover:border-hestia-gold transition-all overflow-hidden"
    >
      {/* ── 이미지 영역 ── */}
      {/* aspect-square: 정사각형 비율 유지 */}
      <div className="relative aspect-square bg-hestia-light overflow-hidden">
        <Image
          src={getImageUrl(product.image_url)}  // 없으면 placeholder 이미지
          alt={product.name_ko || product.name}  // 접근성용 대체 텍스트
          fill                                   // 부모 요소 꽉 채우기
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          // 반응형 이미지 크기 힌트 (브라우저 최적화용)
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />

        {/* NEW / BEST 배지 (이미지 왼쪽 상단에 표시) */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {/* product.is_new가 true일 때만 NEW 배지 표시 */}
          {product.is_new && <Badge variant="default">NEW</Badge>}
          {/* product.is_bestseller가 true일 때만 BEST 배지 표시 */}
          {product.is_bestseller && <Badge variant="secondary">BEST</Badge>}
        </div>
      </div>

      {/* ── 텍스트 정보 영역 ── */}
      <div className="p-4">
        {/* 카테고리명 (골드색 작은 글씨) */}
        <p className="text-xs text-hestia-gold uppercase tracking-wider mb-1">
          {product.category?.name_en}
          {/* ?.는 옵셔널 체이닝 — category가 없으면 undefined 반환 (오류 없음) */}
        </p>

        {/* 제품명 (한글 우선, 없으면 영문) */}
        {/* group-hover:text-hestia-gold: 카드에 마우스 올리면 골드 색으로 변경 */}
        <h3 className="font-medium text-hestia-dark text-sm leading-snug group-hover:text-hestia-gold transition-colors">
          {product.name_ko || product.name}
        </h3>

        {/* 용량 (있을 때만 표시) */}
        {product.volume && (
          <p className="text-xs text-hestia-gray mt-1">{product.volume}</p>
        )}
      </div>
    </Link>
  );
}
