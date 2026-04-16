import Link from "next/link";

export default function PromoBanner() {
  return (
    <section className="py-20 bg-hestia-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-hestia-gold font-medium tracking-[0.3em] text-xs uppercase mb-4">
          Special Line
        </p>
        <h2 className="font-playfair text-4xl md:text-5xl font-bold text-white mb-6">
          MELASMA-X
        </h2>
        <p className="text-white/70 max-w-xl mx-auto mb-8 leading-relaxed">
          기미·잡티 전문 집중 케어 라인.<br />
          글루타치온 고농도 배합으로 피부 톤을 균일하게 개선합니다.
        </p>
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
