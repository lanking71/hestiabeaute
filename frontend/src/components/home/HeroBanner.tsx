"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Banner } from "@/lib/types";
import { getImageUrl } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface HeroBannerProps {
  banners: Banner[];
}

export default function HeroBanner({ banners }: HeroBannerProps) {
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

  if (!banners.length) {
    return (
      <section className="relative w-full h-[480px] md:h-[600px] bg-hestia-dark flex items-center justify-center">
        <div className="text-center text-white">
          <p className="text-hestia-gold text-xs tracking-[0.4em] mb-4">HESTIA BEAUTY</p>
          <h1 className="font-cormorant text-5xl md:text-7xl font-light tracking-widest mb-4">
            HESTIA
          </h1>
          <p className="text-white/60 tracking-wider text-sm">관리자에서 배너를 등록하세요</p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative w-full overflow-hidden">
      <div className="embla" ref={emblaRef}>
        <div className="embla__container">
          {banners.map((banner) => (
            <div key={banner.id} className="embla__slide">
              <div className="relative h-[480px] md:h-[640px] bg-hestia-dark">
                {/* 배너 이미지 */}
                {banner.image_url && (
                  <Image
                    src={getImageUrl(banner.image_url)}
                    alt={banner.title}
                    fill
                    className="object-cover"
                    priority
                    sizes="100vw"
                  />
                )}
                {/* 오버레이 */}
                <div className="absolute inset-0 bg-gradient-to-r from-hestia-dark/70 via-hestia-dark/30 to-transparent" />

                {/* 텍스트 */}
                <div className="absolute inset-0 flex items-center">
                  <div className="max-w-7xl mx-auto px-8 md:px-16 w-full">
                    <p className="text-hestia-gold font-medium tracking-[0.4em] text-xs mb-5 uppercase">
                      HESTIA BEAUTY
                    </p>
                    <h1 className="font-cormorant text-4xl md:text-6xl lg:text-7xl font-light text-white tracking-wider mb-4 leading-tight">
                      {banner.title}
                    </h1>
                    {banner.subtitle && (
                      <p className="text-white/70 text-base md:text-lg mb-8 tracking-wide max-w-md">
                        {banner.subtitle}
                      </p>
                    )}
                    <Link
                      href={banner.link_url || "/products"}
                      className="inline-block border border-hestia-gold text-hestia-gold px-10 py-3 text-xs tracking-[0.3em] hover:bg-hestia-gold hover:text-white transition-all duration-300"
                    >
                      EXPLORE
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 화살표 */}
      {banners.length > 1 && (
        <>
          <button
            onClick={scrollPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/20 hover:bg-black/40 text-white p-2.5 transition-colors"
            aria-label="이전"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={scrollNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/20 hover:bg-black/40 text-white p-2.5 transition-colors"
            aria-label="다음"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      )}

      {/* 도트 */}
      {banners.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {banners.map((_, i) => (
            <button
              key={i}
              onClick={() => emblaApi?.scrollTo(i)}
              className={cn(
                "h-px transition-all",
                i === current ? "bg-hestia-gold w-8" : "bg-white/50 w-4"
              )}
              aria-label={`슬라이드 ${i + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
