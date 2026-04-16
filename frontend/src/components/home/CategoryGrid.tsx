import Link from "next/link";
import { Category } from "@/lib/types";

interface CategoryGridProps {
  categories: Category[];
}

const CATEGORY_ICONS: Record<string, string> = {
  "skin-toner-fluid": "💧",
  ampoule: "✨",
  cream: "🌿",
  foundation: "💄",
  "sun-care": "☀️",
  cleansing: "🧴",
  "mask-soothing": "🎭",
  "cica-balm": "🌱",
  "massage-cream": "💆",
  set: "🎁",
};

export default function CategoryGrid({ categories }: CategoryGridProps) {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="font-playfair text-3xl font-bold text-hestia-dark mb-2">
            PRODUCT CATEGORIES
          </h2>
          <p className="text-hestia-gray text-sm tracking-wider">제품 카테고리</p>
          <div className="w-16 h-0.5 bg-hestia-gold mx-auto mt-4" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/products/${cat.slug}`}
              className="group flex flex-col items-center p-4 rounded-lg border border-hestia-light hover:border-hestia-gold hover:shadow-md transition-all bg-hestia-cream"
            >
              <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">
                {CATEGORY_ICONS[cat.slug] || "✦"}
              </div>
              <p className="text-xs font-medium text-center text-hestia-dark group-hover:text-hestia-gold transition-colors">
                {cat.name_ko}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
