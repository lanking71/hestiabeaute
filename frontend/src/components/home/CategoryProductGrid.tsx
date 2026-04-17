// =====================================================
// 📁 CategoryProductGrid.tsx — 카테고리별 제품 그리드
// =====================================================
// 홈페이지에서 카테고리마다 제품들을 그리드로 보여주는
// 컴포넌트예요.
//
// 동작 방식:
// 1. 카테고리 목록을 순서대로 나열
// 2. 각 카테고리 아래에 해당 제품들을 카드 형태로 표시
// 3. 제품 카드 클릭 시 제품 상세 페이지로 이동
//
// "use client": Link, Image 등 클라이언트 기능 사용
// =====================================================

"use client";

import Link from "next/link";
import Image from "next/image";
import { Category, Product } from "@/lib/types";
import { getImageUrl } from "@/lib/utils";

// 이 컴포넌트가 받을 props 타입
interface Props {
  categories: Category[];  // 카테고리 목록
  products: Product[];     // 제품 목록 (모든 카테고리 통합)
}

export default function CategoryProductGrid({ categories, products }: Props) {
  // reduce: 카테고리별로 제품을 그룹화
  // 결과: { 1: [제품A, 제품B], 2: [제품C], ... }
  // (카테고리 id를 키로, 해당 카테고리 제품 배열을 값으로)
  const productsByCategory = categories.reduce<Record<number, Product[]>>((acc, cat) => {
    // 이 카테고리에 속하고 활성화된 제품들만 필터링
    acc[cat.id] = products.filter((p) => p.category_id === cat.id && p.is_active);
    return acc;
  }, {});

  // 활성화된 카테고리만 표시
  const activeCategories = categories.filter((cat) => cat.is_active);

  return (
    <section className="bg-[#FAFAF8] py-24">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">

        {/* ── 섹션 상단 제목 ── */}
        <div className="text-center mb-20">
          <p className="text-hestia-gold text-[10px] tracking-[0.6em] uppercase mb-4">
            Our Products
          </p>
          <h2 className="font-cormorant text-4xl md:text-5xl font-light text-hestia-dark tracking-[0.2em] uppercase">
            Product Categories
          </h2>
          {/* 장식용 가로선 + 다이아몬드 아이콘 */}
          <div className="flex items-center justify-center gap-5 mt-6">
            <div className="h-px w-20 bg-hestia-muted" />
            <div className="w-1.5 h-1.5 bg-hestia-gold rotate-45 flex-shrink-0" />
            <div className="h-px w-20 bg-hestia-muted" />
          </div>
        </div>

        {/* 카테고리가 없으면 안내 문구 표시 */}
        {activeCategories.length === 0 ? (
          <div className="text-center py-24 border border-dashed border-hestia-muted rounded-sm">
            <p className="font-cormorant text-xl text-hestia-gray tracking-widest">
              제품을 준비 중입니다
            </p>
            <p className="text-xs text-hestia-muted mt-2 tracking-wider">Products Coming Soon</p>
          </div>
        ) : (
          <div className="space-y-20">
            {/* 카테고리마다 블록 생성 */}
            {activeCategories.map((cat, catIndex) => {
              const catProducts = productsByCategory[cat.id] ?? [];  // 이 카테고리 제품들

              return (
                <div key={cat.id}>
                  {/* ── 카테고리 헤더 ── */}
                  <div className="flex items-end justify-between mb-8">
                    <div className="flex items-end gap-5">
                      {/* 장식용 번호 (01, 02, 03...) */}
                      <span className="font-cormorant text-6xl font-light text-hestia-gold/20 leading-none select-none">
                        {/* padStart: "1" → "01", "10" → "10" (앞에 0 붙이기) */}
                        {String(catIndex + 1).padStart(2, "0")}
                      </span>
                      <div className="pb-1">
                        {/* 카테고리명 (영문 큰 글씨, 한글 작은 글씨) */}
                        <h3 className="font-cormorant text-2xl md:text-3xl font-semibold text-hestia-dark tracking-[0.15em] uppercase leading-tight">
                          {cat.name_en}
                        </h3>
                        <p className="text-hestia-gray text-xs tracking-[0.2em] mt-1">
                          {cat.name_ko}
                        </p>
                      </div>
                    </div>

                    {/* "VIEW ALL" 링크 → 해당 카테고리 전체 보기 페이지로 이동 */}
                    <Link
                      href={`/products/${cat.slug}`}
                      className="group flex items-center gap-2 text-[11px] tracking-[0.3em] text-hestia-gray hover:text-hestia-gold transition-colors uppercase pb-1"
                    >
                      VIEW ALL
                      {/* 호버 시 가로선이 짧은 것 → 긴 것으로 늘어나는 애니메이션 */}
                      <span className="block w-6 h-px bg-current group-hover:w-10 transition-all duration-300" />
                    </Link>
                  </div>

                  {/* ── 구분선 (좌측에 골드색 포인트) ── */}
                  <div className="relative mb-8">
                    <div className="h-px w-full bg-hestia-muted" />
                    <div className="absolute left-0 top-0 h-px w-16 bg-hestia-gold" />
                  </div>

                  {/* ── 제품 그리드 ── */}
                  {catProducts.length === 0 ? (
                    // 등록된 제품이 없을 때 표시
                    <div className="py-16 text-center border border-dashed border-hestia-muted/60">
                      <p className="font-cormorant text-lg text-hestia-gray tracking-widest">
                        등록된 상품이 없습니다
                      </p>
                      <p className="text-[10px] text-hestia-muted mt-1.5 tracking-wider uppercase">
                        No products available
                      </p>
                    </div>
                  ) : (
                    // 반응형 그리드: 모바일 2열 → 태블릿 3~4열 → PC 5~6열
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-10">
                      {catProducts.map((product) => (
                        // 제품 카드: 클릭하면 상세 페이지로 이동
                        <Link
                          key={product.id}
                          href={`/products/${cat.slug}/${product.slug}`}
                          className="group block"
                        >
                          {/* 이미지 컨테이너: aspect-[3/4] = 3:4 비율 유지 */}
                          <div className="relative aspect-[3/4] overflow-hidden bg-white mb-3 shadow-sm group-hover:shadow-md transition-shadow duration-300">
                            {product.image_url ? (
                              <Image
                                src={getImageUrl(product.image_url)}
                                alt={product.name_ko || product.name}
                                fill
                                // 호버 시 이미지가 살짝 확대 (scale-105 = 5% 커짐)
                                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                                // sizes: 브라우저에게 이미지 크기 힌트 (최적화용)
                                sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 16vw"
                              />
                            ) : (
                              // 이미지 없으면 "H" 로고로 대체
                              <div className="absolute inset-0 flex flex-col items-center justify-center bg-hestia-light">
                                <span className="font-cormorant text-4xl text-hestia-gold/30 font-light">
                                  H
                                </span>
                                <span className="text-[9px] tracking-widest text-hestia-muted mt-2 uppercase">
                                  No Image
                                </span>
                              </div>
                            )}

                            {/* NEW / BEST 배지 */}
                            <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5">
                              {product.is_new && (
                                <span className="bg-hestia-dark text-white text-[8px] tracking-[0.15em] px-2 py-0.5 uppercase">
                                  New
                                </span>
                              )}
                              {product.is_bestseller && (
                                <span className="bg-hestia-gold text-white text-[8px] tracking-[0.15em] px-2 py-0.5 uppercase">
                                  Best
                                </span>
                              )}
                            </div>

                            {/* 호버 시 살짝 어두워지는 오버레이 */}
                            <div className="absolute inset-0 bg-hestia-dark/0 group-hover:bg-hestia-dark/8 transition-colors duration-400" />
                          </div>

                          {/* 제품 텍스트 정보 */}
                          <div className="space-y-1 px-0.5">
                            {/* 제품명 (한글 우선, 없으면 영문) */}
                            <p className="text-[12px] font-medium text-hestia-dark group-hover:text-hestia-gold transition-colors duration-200 leading-snug line-clamp-2 tracking-tight">
                              {product.name_ko || product.name}
                            </p>
                            {/* 영문명 (한글명이 있고, 영문명과 다를 때만 표시) */}
                            {product.name_ko && product.name && product.name !== product.name_ko && (
                              <p className="text-[10px] text-hestia-gray leading-snug line-clamp-1">
                                {product.name}
                              </p>
                            )}
                            {/* 용량 */}
                            {product.volume && (
                              <p className="text-[10px] text-hestia-muted tracking-wide">
                                {product.volume}
                              </p>
                            )}
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
