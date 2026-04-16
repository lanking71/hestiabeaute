import { getCategories, getProducts } from "@/lib/api";
import ProductGrid from "@/components/product/ProductGrid";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

interface Props {
  params: { category: string };
  searchParams: { page?: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const categories = await getCategories().catch(() => []);
  const cat = categories.find((c) => c.slug === params.category);
  return { title: cat?.name_ko ?? "제품 목록" };
}

export default async function CategoryProductsPage({ params, searchParams }: Props) {
  const page = Number(searchParams.page) || 1;
  const categories = await getCategories().catch(() => []);
  const category = categories.find((c) => c.slug === params.category);

  if (!category) notFound();

  const result = await getProducts({ category: params.category, page, size: 20 }).catch(() => ({
    items: [],
    total: 0,
    pages: 1,
    page: 1,
    size: 20,
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* 브레드크럼 */}
      <nav className="text-xs text-hestia-gray mb-6 flex items-center gap-2">
        <Link href="/" className="hover:text-hestia-gold">홈</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-hestia-gold">제품</Link>
        <span>/</span>
        <span className="text-hestia-dark">{category.name_ko}</span>
      </nav>

      <div className="mb-8">
        <p className="text-hestia-gold text-xs uppercase tracking-widest mb-1">{category.name_en}</p>
        <h1 className="font-playfair text-3xl font-bold text-hestia-dark mb-2">{category.name_ko}</h1>
        <div className="w-12 h-0.5 bg-hestia-gold" />
      </div>

      {/* 카테고리 탭 */}
      <div className="flex flex-wrap gap-2 mb-8">
        <Link href="/products" className="px-4 py-2 text-sm border border-hestia-light text-hestia-dark hover:border-hestia-gold hover:text-hestia-gold rounded-full transition-colors">
          전체
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/products/${cat.slug}`}
            className={`px-4 py-2 text-sm border rounded-full transition-colors ${
              cat.slug === params.category
                ? "border-hestia-gold bg-hestia-gold text-white"
                : "border-hestia-light text-hestia-dark hover:border-hestia-gold hover:text-hestia-gold"
            }`}
          >
            {cat.name_ko}
          </Link>
        ))}
      </div>

      <ProductGrid products={result.items} cols={4} />

      {result.pages > 1 && (
        <div className="flex justify-center gap-2 mt-10">
          {Array.from({ length: result.pages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={`/products/${params.category}?page=${p}`}
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
