import { getCategories, getProducts } from "@/lib/api";
import ProductGrid from "@/components/product/ProductGrid";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "전체 제품" };

interface Props {
  searchParams: { page?: string };
}

export default async function ProductsPage({ searchParams }: Props) {
  const page = Number(searchParams.page) || 1;
  const [categories, result] = await Promise.all([
    getCategories().catch(() => []),
    getProducts({ page, size: 20 }).catch(() => ({ items: [], total: 0, pages: 1, page: 1, size: 20 })),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* 헤더 */}
      <div className="mb-8">
        <h1 className="font-playfair text-3xl font-bold text-hestia-dark mb-2">전체 제품</h1>
        <div className="w-12 h-0.5 bg-hestia-gold" />
      </div>

      {/* 카테고리 필터 */}
      <div className="flex flex-wrap gap-2 mb-8">
        <Link
          href="/products"
          className="px-4 py-2 text-sm border border-hestia-gold bg-hestia-gold text-white rounded-full"
        >
          전체
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/products/${cat.slug}`}
            className="px-4 py-2 text-sm border border-hestia-light text-hestia-dark hover:border-hestia-gold hover:text-hestia-gold rounded-full transition-colors"
          >
            {cat.name_ko}
          </Link>
        ))}
      </div>

      <ProductGrid products={result.items} cols={4} />

      {/* 페이지네이션 */}
      {result.pages > 1 && (
        <div className="flex justify-center gap-2 mt-10">
          {Array.from({ length: result.pages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={`/products?page=${p}`}
              className={`w-10 h-10 flex items-center justify-center text-sm border transition-colors ${
                p === page
                  ? "border-hestia-gold bg-hestia-gold text-white"
                  : "border-hestia-light hover:border-hestia-gold hover:text-hestia-gold"
              }`}
            >
              {p}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
