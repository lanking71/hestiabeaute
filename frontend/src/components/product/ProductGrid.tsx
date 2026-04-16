import { Product } from "@/lib/types";
import ProductCard from "./ProductCard";

interface ProductGridProps {
  products: Product[];
  cols?: 2 | 3 | 4;
}

const colsMap = {
  2: "grid-cols-2",
  3: "grid-cols-2 md:grid-cols-3",
  4: "grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
};

export default function ProductGrid({ products, cols = 4 }: ProductGridProps) {
  if (!products.length) {
    return (
      <div className="py-20 text-center text-hestia-gray">
        <p>등록된 제품이 없습니다.</p>
      </div>
    );
  }

  return (
    <div className={`grid ${colsMap[cols]} gap-4 md:gap-6`}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
