import Link from "next/link";
import Image from "next/image";
import { Product } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { getImageUrl } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link
      href={`/products/${product.category?.slug ?? "all"}/${product.slug}`}
      className="group block bg-white rounded-sm border border-hestia-light hover:shadow-md hover:border-hestia-gold transition-all overflow-hidden"
    >
      {/* 이미지 */}
      <div className="relative aspect-square bg-hestia-light overflow-hidden">
        <Image
          src={getImageUrl(product.image_url)}
          alt={product.name_ko || product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
        {/* 배지 */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.is_new && <Badge variant="default">NEW</Badge>}
          {product.is_bestseller && <Badge variant="secondary">BEST</Badge>}
        </div>
      </div>

      {/* 정보 */}
      <div className="p-4">
        <p className="text-xs text-hestia-gold uppercase tracking-wider mb-1">
          {product.category?.name_en}
        </p>
        <h3 className="font-medium text-hestia-dark text-sm leading-snug group-hover:text-hestia-gold transition-colors">
          {product.name_ko || product.name}
        </h3>
        {product.volume && (
          <p className="text-xs text-hestia-gray mt-1">{product.volume}</p>
        )}
      </div>
    </Link>
  );
}
