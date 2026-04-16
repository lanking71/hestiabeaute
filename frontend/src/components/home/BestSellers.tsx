import Link from "next/link";
import { Product } from "@/lib/types";
import ProductGrid from "@/components/product/ProductGrid";

interface BestSellersProps {
  products: Product[];
}

export default function BestSellers({ products }: BestSellersProps) {
  return (
    <section className="py-16 bg-hestia-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="font-playfair text-3xl font-bold text-hestia-dark mb-2">BEST SELLERS</h2>
          <p className="text-hestia-gray text-sm tracking-wider">베스트셀러</p>
          <div className="w-16 h-0.5 bg-hestia-gold mx-auto mt-4" />
        </div>

        <ProductGrid products={products.slice(0, 8)} cols={4} />

        <div className="text-center mt-10">
          <Link
            href="/products"
            className="inline-block border border-hestia-dark text-hestia-dark px-10 py-3 text-sm tracking-widest hover:bg-hestia-dark hover:text-white transition-colors"
          >
            전체 제품 보기
          </Link>
        </div>
      </div>
    </section>
  );
}
