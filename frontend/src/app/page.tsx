import { getCategories, getProducts, getBanners } from "@/lib/api";
import HeroBanner from "@/components/home/HeroBanner";
import CategoryProductGrid from "@/components/home/CategoryProductGrid";
import BrandStory from "@/components/home/BrandStory";
import PromoBanner from "@/components/home/PromoBanner";
import IngredientHighlight from "@/components/home/IngredientHighlight";

export const revalidate = 0;

export default async function HomePage() {
  const [categories, banners, allProducts] = await Promise.all([
    getCategories().catch(() => []),
    getBanners().catch(() => []),
    getProducts({ size: 200 }).catch(() => ({ items: [] })),
  ]);

  return (
    <>
      <HeroBanner banners={banners} />
      <CategoryProductGrid categories={categories} products={allProducts.items} />
      <BrandStory />
      <PromoBanner />
      <IngredientHighlight />
    </>
  );
}
