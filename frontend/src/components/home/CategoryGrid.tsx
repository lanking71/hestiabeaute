import Link from "next/link";
import Image from "next/image";
import { Category } from "@/lib/types";
import { getImageUrl } from "@/lib/utils";

interface CategoryGridProps {
  categories: Category[];
}

export default function CategoryGrid({ categories }: CategoryGridProps) {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-hestia-gold text-xs tracking-[0.4em] uppercase mb-3">Collection</p>
          <h2 className="font-cormorant text-4xl font-semibold text-hestia-dark tracking-wider">
            PRODUCT CATEGORIES
          </h2>
          <div className="w-12 h-px bg-hestia-gold mx-auto mt-5" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/products/${cat.slug}`}
              className="group relative overflow-hidden rounded-sm bg-hestia-cream hover:shadow-lg transition-all duration-300"
            >
              {/* 이미지 영역 */}
              <div className="relative aspect-[3/4] overflow-hidden bg-hestia-light">
                {cat.icon_url ? (
                  <Image
                    src={getImageUrl(cat.icon_url)}
                    alt={cat.name_ko}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-hestia-light">
                    <span className="font-cormorant text-3xl text-hestia-gold font-light">
                      {cat.name_en.charAt(0)}
                    </span>
                  </div>
                )}
                {/* 오버레이 */}
                <div className="absolute inset-0 bg-hestia-dark/0 group-hover:bg-hestia-dark/20 transition-colors duration-300" />
              </div>

              {/* 텍스트 */}
              <div className="p-3 text-center">
                <p className="text-xs font-medium text-hestia-dark group-hover:text-hestia-gold transition-colors leading-tight">
                  {cat.name_ko}
                </p>
                <p className="text-[10px] text-hestia-gray tracking-wider mt-0.5">
                  {cat.name_en}
                </p>
              </div>
            </Link>
          ))}
        </div>

        <p className="text-center text-xs text-hestia-gray mt-8">
          카테고리 이미지는 관리자 페이지 → 카테고리에서 등록하세요
        </p>
      </div>
    </section>
  );
}
