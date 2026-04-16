"use client";

import { useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Product } from "@/lib/types";
import ProductCard from "@/components/product/ProductCard";

interface NewArrivalsProps {
  products: Product[];
}

export default function NewArrivals({ products }: NewArrivalsProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    slidesToScroll: 1,
    containScroll: "trimSnaps",
  });

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  if (!products.length) return null;

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="font-playfair text-3xl font-bold text-hestia-dark mb-1">NEW ARRIVALS</h2>
            <p className="text-hestia-gray text-sm tracking-wider">신제품</p>
            <div className="w-16 h-0.5 bg-hestia-gold mt-4" />
          </div>
          <div className="flex gap-2">
            <button
              onClick={scrollPrev}
              className="p-2 border border-hestia-light hover:border-hestia-gold hover:text-hestia-gold rounded-full transition-colors"
              aria-label="이전"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={scrollNext}
              className="p-2 border border-hestia-light hover:border-hestia-gold hover:text-hestia-gold rounded-full transition-colors"
              aria-label="다음"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="embla overflow-hidden" ref={emblaRef}>
          <div className="flex gap-4 md:gap-6">
            {products.map((product) => (
              <div key={product.id} className="flex-none w-[200px] md:w-[240px]">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-10">
          <Link
            href="/products"
            className="inline-block border border-hestia-dark text-hestia-dark px-10 py-3 text-sm tracking-widest hover:bg-hestia-dark hover:text-white transition-colors"
          >
            더 보기
          </Link>
        </div>
      </div>
    </section>
  );
}
