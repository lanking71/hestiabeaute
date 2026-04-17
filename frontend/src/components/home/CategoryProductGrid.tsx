"use client";

import Link from "next/link";
import Image from "next/image";
import { Category, Product } from "@/lib/types";
import { getImageUrl } from "@/lib/utils";

interface Props {
  categories: Category[];
  products: Product[];
}

export default function CategoryProductGrid({ categories, products }: Props) {
  const productsByCategory = categories.reduce<Record<number, Product[]>>((acc, cat) => {
    acc[cat.id] = products.filter((p) => p.category_id === cat.id && p.is_active);
    return acc;
  }, {});

  const activeCategories = categories.filter((cat) => cat.is_active);

  return (
    <section className="bg-[#FAFAF8] py-24">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">

        {/* 섹션 헤더 */}
        <div className="text-center mb-20">
          <p className="text-hestia-gold text-[10px] tracking-[0.6em] uppercase mb-4">
            Our Products
          </p>
          <h2 className="font-cormorant text-4xl md:text-5xl font-light text-hestia-dark tracking-[0.2em] uppercase">
            Product Categories
          </h2>
          <div className="flex items-center justify-center gap-5 mt-6">
            <div className="h-px w-20 bg-hestia-muted" />
            <div className="w-1.5 h-1.5 bg-hestia-gold rotate-45 flex-shrink-0" />
            <div className="h-px w-20 bg-hestia-muted" />
          </div>
        </div>

        {activeCategories.length === 0 ? (
          <div className="text-center py-24 border border-dashed border-hestia-muted rounded-sm">
            <p className="font-cormorant text-xl text-hestia-gray tracking-widest">
              제품을 준비 중입니다
            </p>
            <p className="text-xs text-hestia-muted mt-2 tracking-wider">Products Coming Soon</p>
          </div>
        ) : (
          <div className="space-y-20">
            {activeCategories.map((cat, catIndex) => {
              const catProducts = productsByCategory[cat.id] ?? [];

              return (
                <div key={cat.id}>
                  {/* 카테고리 헤더 */}
                  <div className="flex items-end justify-between mb-8">
                    <div className="flex items-end gap-5">
                      {/* 인덱스 번호 */}
                      <span className="font-cormorant text-6xl font-light text-hestia-gold/20 leading-none select-none">
                        {String(catIndex + 1).padStart(2, "0")}
                      </span>
                      <div className="pb-1">
                        <h3 className="font-cormorant text-2xl md:text-3xl font-semibold text-hestia-dark tracking-[0.15em] uppercase leading-tight">
                          {cat.name_en}
                        </h3>
                        <p className="text-hestia-gray text-xs tracking-[0.2em] mt-1">
                          {cat.name_ko}
                        </p>
                      </div>
                    </div>

                    <Link
                      href={`/products/${cat.slug}`}
                      className="group flex items-center gap-2 text-[11px] tracking-[0.3em] text-hestia-gray hover:text-hestia-gold transition-colors uppercase pb-1"
                    >
                      VIEW ALL
                      <span className="block w-6 h-px bg-current group-hover:w-10 transition-all duration-300" />
                    </Link>
                  </div>

                  {/* 구분선 */}
                  <div className="relative mb-8">
                    <div className="h-px w-full bg-hestia-muted" />
                    <div className="absolute left-0 top-0 h-px w-16 bg-hestia-gold" />
                  </div>

                  {/* 제품 그리드 — 전체 표시 */}
                  {catProducts.length === 0 ? (
                    <div className="py-16 text-center border border-dashed border-hestia-muted/60">
                      <p className="font-cormorant text-lg text-hestia-gray tracking-widest">
                        등록된 상품이 없습니다
                      </p>
                      <p className="text-[10px] text-hestia-muted mt-1.5 tracking-wider uppercase">
                        No products available
                      </p>
                    </div>
                  ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-10">
                    {catProducts.map((product) => (
                      <Link
                        key={product.id}
                        href={`/products/${cat.slug}/${product.slug}`}
                        className="group block"
                      >
                        {/* 이미지 컨테이너 */}
                        <div className="relative aspect-[3/4] overflow-hidden bg-white mb-3 shadow-sm group-hover:shadow-md transition-shadow duration-300">
                          {product.image_url ? (
                            <Image
                              src={getImageUrl(product.image_url)}
                              alt={product.name_ko || product.name}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 16vw"
                            />
                          ) : (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-hestia-light">
                              <span className="font-cormorant text-4xl text-hestia-gold/30 font-light">
                                H
                              </span>
                              <span className="text-[9px] tracking-widest text-hestia-muted mt-2 uppercase">
                                No Image
                              </span>
                            </div>
                          )}

                          {/* 배지 */}
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

                          {/* 호버 오버레이 */}
                          <div className="absolute inset-0 bg-hestia-dark/0 group-hover:bg-hestia-dark/8 transition-colors duration-400" />
                        </div>

                        {/* 텍스트 정보 */}
                        <div className="space-y-1 px-0.5">
                          <p className="text-[12px] font-medium text-hestia-dark group-hover:text-hestia-gold transition-colors duration-200 leading-snug line-clamp-2 tracking-tight">
                            {product.name_ko || product.name}
                          </p>
                          {product.name_ko && product.name && product.name !== product.name_ko && (
                            <p className="text-[10px] text-hestia-gray leading-snug line-clamp-1">
                              {product.name}
                            </p>
                          )}
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
