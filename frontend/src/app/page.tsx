import { getCategories, getProducts } from "@/lib/api";
import HeroBanner from "@/components/home/HeroBanner";
import CategoryGrid from "@/components/home/CategoryGrid";
import BrandStory from "@/components/home/BrandStory";
import BestSellers from "@/components/home/BestSellers";
import PromoBanner from "@/components/home/PromoBanner";
import NewArrivals from "@/components/home/NewArrivals";
import IngredientHighlight from "@/components/home/IngredientHighlight";

export const revalidate = 3600; // 1시간 캐시

export default async function HomePage() {
  const [categories, bestSellers, newArrivals] = await Promise.all([
    getCategories().catch(() => []),
    getProducts({ bestseller: true, size: 8 }).catch(() => ({ items: [] })),
    getProducts({ is_new: true, size: 10 }).catch(() => ({ items: [] })),
  ]);

  return (
    <>
      <HeroBanner />
      <CategoryGrid categories={categories} />
      <BrandStory />
      <BestSellers products={bestSellers.items} />
      <PromoBanner />
      <NewArrivals products={newArrivals.items} />
      <IngredientHighlight />
    </>
  );
}
