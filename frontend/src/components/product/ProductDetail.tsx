"use client";

import { useState } from "react";
import { Product } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface ProductDetailProps {
  product: Product;
}

const TABS = [
  { id: "description", label: "제품 설명" },
  { id: "ingredients", label: "성분" },
  { id: "how_to_use", label: "사용 방법" },
];

export default function ProductDetail({ product }: ProductDetailProps) {
  const [tab, setTab] = useState("description");

  return (
    <div className="space-y-6">
      {/* 카테고리 */}
      {product.category && (
        <Link
          href={`/products/${product.category.slug}`}
          className="text-xs text-hestia-gold uppercase tracking-widest hover:underline"
        >
          {product.category.name_en}
        </Link>
      )}

      {/* 이름 */}
      <div>
        <h1 className="font-playfair text-3xl font-bold text-hestia-dark mb-1">
          {product.name_ko || product.name}
        </h1>
        <p className="text-hestia-gray text-sm">{product.name}</p>
      </div>

      {/* 배지 */}
      <div className="flex gap-2">
        {product.is_new && <Badge variant="default">NEW</Badge>}
        {product.is_bestseller && <Badge variant="secondary">BEST SELLER</Badge>}
      </div>

      {/* 용량 / 피부타입 */}
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

      <div className="w-full h-px bg-hestia-light" />

      {/* 탭 */}
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
            <div
              dangerouslySetInnerHTML={{
                __html: product.description || "제품 설명이 없습니다.",
              }}
            />
          )}
          {tab === "ingredients" && (
            <p className="whitespace-pre-line">{product.ingredients || "성분 정보가 없습니다."}</p>
          )}
          {tab === "how_to_use" && (
            <p className="whitespace-pre-line">{product.how_to_use || "사용 방법 정보가 없습니다."}</p>
          )}
        </div>
      </div>

    </div>
  );
}
