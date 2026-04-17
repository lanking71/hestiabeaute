// =====================================================
// 📁 HeroBanner.tsx — 홈 화면 히어로 슬라이더
// =====================================================
// 홈페이지 가장 위에 표시되는 큰 슬라이더 컴포넌트예요.
// 배너 이미지들이 5초마다 자동으로 넘어가고,
// 화살표 버튼이나 하단 점(dot)으로 수동으로도 넘길 수 있어요.
//
// embla-carousel-react: 슬라이더 기능을 제공하는 라이브러리
// (직접 구현하면 복잡하지만 이 라이브러리가 대신 해줘요)
//
// "use client": useCallback, useEffect, useState 사용하기 때문에
// 브라우저에서 실행되어야 해요
// =====================================================

"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";  // 슬라이더 라이브러리
import Link from "next/link";
import Image from "next/image";  // Next.js 최적화 이미지 컴포넌트
import { ChevronLeft, ChevronRight } from "lucide-react";  // 화살표 아이콘
import { Banner } from "@/lib/types";
import { getImageUrl } from "@/lib/utils";
import { cn } from "@/lib/utils";

// HeroBanner가 받을 props 타입
interface HeroBannerProps {
  banners: Banner[];  // 표시할 배너 목록
}

export default function HeroBanner({ banners }: HeroBannerProps) {
  // useEmblaCarousel: 슬라이더를 생성하는 훅
  // - emblaRef: 슬라이더 DOM 요소에 연결 (ref={emblaRef})
  // - emblaApi: 슬라이더 제어 함수들 (scrollPrev, scrollNext 등)
  // loop: true = 마지막 슬라이드 다음에 첫 슬라이드로 돌아옴 (무한 반복)
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

  // 현재 몇 번째 슬라이드를 보고 있는지 (0부터 시작)
  const [current, setCurrent] = useState(0);

  // useCallback: 불필요한 함수 재생성을 방지하는 최적화
  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);  // 이전으로
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);  // 다음으로

  // emblaApi가 준비되면 자동 슬라이드 시작
  useEffect(() => {
    if (!emblaApi) return;

    // 슬라이드가 바뀔 때마다 current 상태 업데이트
    emblaApi.on("select", () => setCurrent(emblaApi.selectedScrollSnap()));

    // setInterval: 5000ms(5초)마다 다음 슬라이드로 이동
    const autoplay = setInterval(() => emblaApi.scrollNext(), 5000);

    // cleanup: 컴포넌트가 사라질 때 타이머 정리 (메모리 낭비 방지)
    return () => clearInterval(autoplay);
  }, [emblaApi]);

  // 배너가 없으면 기본 화면 표시 (관리자에서 배너를 등록하라는 안내)
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
      {/* embla 슬라이더 컨테이너: ref={emblaRef}로 라이브러리와 연결 */}
      <div className="embla" ref={emblaRef}>
        {/* embla__container: 슬라이드들을 가로로 나열하는 컨테이너 */}
        <div className="embla__container">
          {banners.map((banner) => (
            <div key={banner.id} className="embla__slide">
              <div className="relative h-[480px] md:h-[640px] bg-hestia-dark">

                {/* 배너 배경 이미지 */}
                {banner.image_url && (
                  <Image
                    src={getImageUrl(banner.image_url)}
                    alt={banner.title}
                    fill              // 부모 요소를 꽉 채움
                    className="object-cover"  // 이미지 비율 유지하며 꽉 채우기
                    priority          // 첫 화면에 보이는 이미지는 우선 로딩
                    sizes="100vw"     // 화면 너비 100% (성능 최적화 힌트)
                  />
                )}

                {/* 오버레이: 이미지 위에 어두운 그라데이션을 덮어서 텍스트가 잘 보이게 */}
                <div className="absolute inset-0 bg-gradient-to-r from-hestia-dark/70 via-hestia-dark/30 to-transparent" />

                {/* 배너 텍스트 콘텐츠 */}
                <div className="absolute inset-0 flex items-center">
                  <div className="max-w-7xl mx-auto px-8 md:px-16 w-full">
                    {/* 브랜드 서브 텍스트 */}
                    <p className="text-hestia-gold font-medium tracking-[0.4em] text-xs mb-5 uppercase">
                      HESTIA BEAUTY
                    </p>
                    {/* 큰 제목 */}
                    <h1 className="font-cormorant text-4xl md:text-6xl lg:text-7xl font-light text-white tracking-wider mb-4 leading-tight">
                      {banner.title}
                    </h1>
                    {/* 부제목 (없으면 표시 안 함) */}
                    {banner.subtitle && (
                      <p className="text-white/70 text-base md:text-lg mb-8 tracking-wide max-w-md">
                        {banner.subtitle}
                      </p>
                    )}
                    {/* CTA 버튼 (EXPLORE) */}
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

      {/* ── 좌우 화살표 버튼 (배너가 2개 이상일 때만 표시) ── */}
      {banners.length > 1 && (
        <>
          {/* 이전 버튼 (왼쪽) */}
          <button
            onClick={scrollPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/20 hover:bg-black/40 text-white p-2.5 transition-colors"
            aria-label="이전"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          {/* 다음 버튼 (오른쪽) */}
          <button
            onClick={scrollNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/20 hover:bg-black/40 text-white p-2.5 transition-colors"
            aria-label="다음"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      )}

      {/* ── 하단 점(dot) 인디케이터 (배너가 2개 이상일 때만 표시) ── */}
      {banners.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {banners.map((_, i) => (
            <button
              key={i}
              onClick={() => emblaApi?.scrollTo(i)}  // 클릭 시 해당 슬라이드로 이동
              className={cn(
                "h-px transition-all",
                // 현재 슬라이드: 골드색 + 넓게, 나머지: 흰색 반투명 + 좁게
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
