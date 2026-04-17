// =====================================================
// 📁 PromoBanner.tsx — MELASMA-X 프로모션 배너
// =====================================================
// 홈페이지에서 MELASMA-X 라인을 홍보하는
// 어두운 배경의 풀 너비 배너 섹션이에요.
//
// "SHOP NOW" 버튼 클릭 시 제품 목록 페이지로 이동
// 정적 컴포넌트 (API 호출 없음)
// =====================================================

import Link from "next/link";

export default function PromoBanner() {
  return (
    // bg-hestia-dark: 어두운 배경으로 고급스러운 느낌
    <section className="py-20 bg-hestia-dark">
      {/* text-center: 텍스트 가운데 정렬 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

        {/* 작은 분류 텍스트 */}
        <p className="text-hestia-gold font-medium tracking-[0.3em] text-xs uppercase mb-4">
          Special Line
        </p>

        {/* 큰 브랜드명 */}
        <h2 className="font-playfair text-4xl md:text-5xl font-bold text-white mb-6">
          MELASMA-X
        </h2>

        {/* 홍보 문구 (text-white/70: 흰색 70% 투명도) */}
        <p className="text-white/70 max-w-xl mx-auto mb-8 leading-relaxed">
          기미·잡티 전문 집중 케어 라인.<br />
          글루타치온 고농도 배합으로 피부 톤을 균일하게 개선합니다.
        </p>

        {/* CTA 버튼: 테두리만 있는 버튼 (outline 스타일) */}
        {/* 호버 시: 골드 배경 채워지고 글씨 흰색으로 변경 */}
        <Link
          href="/products"
          className="inline-block border border-hestia-gold text-hestia-gold px-10 py-3 text-sm tracking-widest hover:bg-hestia-gold hover:text-white transition-colors"
        >
          SHOP NOW
        </Link>

      </div>
    </section>
  );
}
