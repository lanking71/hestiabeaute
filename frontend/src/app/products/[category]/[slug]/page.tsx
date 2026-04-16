import { getProduct } from "@/lib/api";
import ProductGallery from "@/components/product/ProductGallery";
import ProductDetail from "@/components/product/ProductDetail";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

interface Props {
  params: { category: string; slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getProduct(params.slug).catch(() => null);
  if (!product) return { title: "제품을 찾을 수 없음" };
  return {
    title: product.name_ko || product.name,
    description: product.description?.slice(0, 150),
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const product = await getProduct(params.slug).catch(() => null);
  if (!product) notFound();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* 브레드크럼 */}
      <nav className="text-xs text-hestia-gray mb-8 flex items-center gap-2">
        <Link href="/" className="hover:text-hestia-gold">홈</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-hestia-gold">제품</Link>
        <span>/</span>
        {product.category && (
          <>
            <Link href={`/products/${product.category.slug}`} className="hover:text-hestia-gold">
              {product.category.name_ko}
            </Link>
            <span>/</span>
          </>
        )}
        <span className="text-hestia-dark">{product.name_ko || product.name}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-12">
        <ProductGallery
          mainImage={product.image_url}
          images={product.image_urls}
          name={product.name_ko || product.name}
        />
        <ProductDetail product={product} />
      </div>
    </div>
  );
}
