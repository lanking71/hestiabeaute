"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { HERO_BANNERS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export default function HeroBanner() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [current, setCurrent] = useState(0);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", () => setCurrent(emblaApi.selectedScrollSnap()));

    const autoplay = setInterval(() => emblaApi.scrollNext(), 5000);
    return () => clearInterval(autoplay);
  }, [emblaApi]);

  return (
    <section className="relative w-full overflow-hidden">
      <div className="embla" ref={emblaRef}>
        <div className="embla__container">
          {HERO_BANNERS.map((banner) => (
            <div key={banner.id} className="embla__slide">
              <div
                className="relative h-[480px] md:h-[600px] bg-hestia-dark flex items-center justify-center"
                style={{
                  backgroundImage: `linear-gradient(rgba(28,28,28,0.5), rgba(28,28,28,0.5))`,
                }}
              >
                {/* 배경 placeholder — 실제 이미지 업로드 시 next/image로 교체 */}
                <div className="absolute inset-0 bg-gradient-to-r from-hestia-dark/80 to-hestia-dark/30" />

                <div className="relative z-10 text-center text-white px-4">
                  <p className="text-hestia-gold font-medium tracking-[0.3em] text-sm mb-4 uppercase">
                    HESTIA BEAUTY
                  </p>
                  <h1 className="font-playfair text-4xl md:text-6xl font-bold mb-4">
                    {banner.title}
                  </h1>
                  <p className="text-lg md:text-xl text-white/80 mb-8">{banner.subtitle}</p>
                  <Link
                    href={banner.href}
                    className="inline-block border border-hestia-gold text-hestia-gold px-8 py-3 text-sm tracking-widest hover:bg-hestia-gold hover:text-white transition-colors"
                  >
                    EXPLORE
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 화살표 */}
      <button
        onClick={scrollPrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-colors"
        aria-label="이전"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={scrollNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-colors"
        aria-label="다음"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* 도트 */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {HERO_BANNERS.map((_, i) => (
          <button
            key={i}
            onClick={() => emblaApi?.scrollTo(i)}
            className={cn(
              "w-2 h-2 rounded-full transition-all",
              i === current ? "bg-hestia-gold w-6" : "bg-white/50"
            )}
            aria-label={`슬라이드 ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
