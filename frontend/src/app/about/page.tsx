import { INGREDIENTS } from "@/lib/constants";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "브랜드 소개" };

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* 히어로 */}
      <section className="py-24 bg-hestia-dark text-white text-center">
        <p className="text-hestia-gold font-medium tracking-[0.3em] text-xs uppercase mb-6">ABOUT US</p>
        <h1 className="font-playfair text-5xl md:text-7xl font-bold mb-6">HESTIA</h1>
        <p className="text-white/70 max-w-xl mx-auto text-lg leading-relaxed">
          자연에서 온 순수한 성분과 과학이 만나<br />
          당신의 피부 본연의 아름다움을 되찾아 드립니다
        </p>
      </section>

      {/* 브랜드 철학 */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-hestia-gold text-xs uppercase tracking-widest mb-4">Brand Philosophy</p>
              <h2 className="font-playfair text-4xl font-bold text-hestia-dark mb-6">
                피부 과학으로<br />완성한 아름다움
              </h2>
              <div className="w-12 h-0.5 bg-hestia-gold mb-6" />
              <p className="text-hestia-gray leading-relaxed mb-4">
                헤스티아는 그리스 신화의 가정의 여신 헤스티아에서 이름을 따왔습니다.
                따뜻하고 안전한 집처럼, 우리의 제품은 피부를 지키고 돌봅니다.
              </p>
              <p className="text-hestia-gray leading-relaxed">
                글루타치온, 세라마이드, EGF 펩타이드, 콜라겐 등 검증된 프리미엄 성분만을 사용하여
                피부 본연의 건강함을 되찾아 드립니다.
              </p>
            </div>
            <div className="bg-hestia-cream rounded-sm p-12 text-center">
              <div className="font-playfair text-6xl font-bold text-hestia-gold opacity-30 mb-4">H</div>
              <h3 className="font-playfair text-2xl font-bold text-hestia-dark mb-2">Healthy · Healing · Harmony</h3>
              <p className="text-xs text-hestia-gray uppercase tracking-widest">헤스티아의 세 가지 가치</p>
            </div>
          </div>
        </div>
      </section>

      {/* MELASMA-X */}
      <section className="py-20 bg-hestia-cream">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-hestia-gold text-xs uppercase tracking-widest mb-4">Specialist Line</p>
          <h2 className="font-playfair text-4xl font-bold text-hestia-dark mb-6">MELASMA-X</h2>
          <div className="w-12 h-0.5 bg-hestia-gold mx-auto mb-8" />
          <p className="text-hestia-gray leading-relaxed max-w-2xl mx-auto mb-4">
            멜라즈마-X는 기미와 잡티 케어에 특화된 전문 라인입니다.
            고농도 글루타치온과 집중 미백 성분의 강력한 시너지로 피부 깊은 곳부터 케어합니다.
          </p>
          <p className="text-hestia-gray leading-relaxed max-w-2xl mx-auto">
            더마 코스메틱 수준의 효능과 럭셔리 스킨케어의 감성을 동시에 담았습니다.
          </p>
        </div>
      </section>

      {/* 핵심 성분 */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-hestia-gold text-xs uppercase tracking-widest mb-4">Key Ingredients</p>
            <h2 className="font-playfair text-4xl font-bold text-hestia-dark">핵심 성분</h2>
            <div className="w-12 h-0.5 bg-hestia-gold mx-auto mt-6" />
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {INGREDIENTS.map((item) => (
              <div key={item.name} className="flex gap-6 p-6 border border-hestia-light hover:border-hestia-gold transition-colors">
                <div className="text-3xl text-hestia-gold flex-none w-12 text-center">{item.icon}</div>
                <div>
                  <h3 className="font-playfair font-bold text-lg text-hestia-dark">{item.name}</h3>
                  <p className="text-xs text-hestia-gold mb-2">{item.name_ko}</p>
                  <p className="text-sm text-hestia-gray leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
