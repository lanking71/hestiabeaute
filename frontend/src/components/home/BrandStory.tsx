export default function BrandStory() {
  return (
    <section className="py-20 bg-hestia-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* HESTIA */}
          <div className="text-center md:text-left">
            <p className="text-hestia-gold font-medium tracking-[0.3em] text-xs uppercase mb-4">
              Premium Skincare
            </p>
            <h2 className="font-playfair text-4xl md:text-5xl font-bold text-hestia-dark mb-6">
              HESTIA
            </h2>
            <p className="text-hestia-gray leading-relaxed mb-6">
              헤스티아는 글루타치온을 핵심 성분으로 하는 프리미엄 스킨케어 브랜드입니다.
              자연에서 온 순수한 성분과 최첨단 피부 과학이 만나 당신의 피부 본연의 아름다움을 되찾아 드립니다.
            </p>
            <div className="w-12 h-0.5 bg-hestia-gold" />
          </div>

          {/* MELASMA-X */}
          <div className="text-center md:text-left bg-hestia-dark text-white p-10 rounded-sm">
            <p className="text-hestia-gold font-medium tracking-[0.3em] text-xs uppercase mb-4">
              Specialist Line
            </p>
            <h2 className="font-playfair text-4xl md:text-5xl font-bold mb-6">
              MELASMA-X
            </h2>
            <p className="text-white/70 leading-relaxed mb-6">
              멜라즈마-X는 기미와 잡티 케어에 특화된 전문 라인입니다.
              고농도 글루타치온과 집중 미백 성분의 시너지로 피부 톤을 균일하게 개선합니다.
            </p>
            <div className="w-12 h-0.5 bg-hestia-gold" />
          </div>
        </div>
      </div>
    </section>
  );
}
