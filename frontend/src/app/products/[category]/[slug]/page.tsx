import { getProduct } from "@/lib/api";
import ProductGallery from "@/components/product/ProductGallery";
import ProductDetail from "@/components/product/ProductDetail";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getImageUrl } from "@/lib/utils";
import type { Metadata } from "next";

interface Props {
  params: { category: string; slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getProduct(params.slug).catch(() => null);
  if (!product) return { title: "제품을 찾을 수 없음" };
  return {
    title: product.name_ko || product.name,
    description: product.description?.replace(/<[^>]*>/g, "").slice(0, 150),
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const product = await getProduct(params.slug).catch(() => null);
  if (!product) notFound();

  const detailImages: string[] = Array.isArray(product.image_urls) ? product.image_urls : [];

  return (
    <div className="bg-white min-h-screen">
      {/* 브레드크럼 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <nav className="text-xs text-hestia-gray flex items-center gap-2 mb-8">
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
      </div>

      {/* 상단: 썸네일 + 제품 정보 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
          <ProductGallery
            mainImage={product.image_url}
            name={product.name_ko || product.name}
          />
          <ProductDetail product={product} />
        </div>
      </div>

      {/* 구분선 */}
      {detailImages.length > 0 && (
        <>
          <div className="border-t border-hestia-muted" />
          {/* 상세 이미지 섹션 — 풀워스 세로 나열 */}
          <div className="bg-white">
            <div className="max-w-3xl mx-auto">
              {detailImages.map((url, i) => (
                <div key={i} className="w-full">
                  <Image
                    src={getImageUrl(url)}
                    alt={`${product.name_ko || product.name} 상세 ${i + 1}`}
                    width={1200}
                    height={800}
                    className="w-full h-auto block"
                    style={{ display: "block" }}
                  />
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* 문의 버튼 하단 고정 영역 */}
      <div className="border-t border-hestia-muted py-12 bg-hestia-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-hestia-gray text-sm mb-4">제품에 대해 궁금한 점이 있으신가요?</p>
          <Link
            href={`/inquiry/write?product=${product.id}`}
            className="inline-block border border-hestia-dark text-hestia-dark px-12 py-3 text-sm tracking-widest hover:bg-hestia-dark hover:text-white transition-colors"
          >
            제품 문의하기
          </Link>
        </div>
      </div>
    </div>
  );
}
