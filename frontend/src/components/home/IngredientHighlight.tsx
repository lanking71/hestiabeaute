import { INGREDIENTS } from "@/lib/constants";

export default function IngredientHighlight() {
  return (
    <section className="py-16 bg-hestia-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="font-playfair text-3xl font-bold text-hestia-dark mb-2">KEY INGREDIENTS</h2>
          <p className="text-hestia-gray text-sm tracking-wider">핵심 성분</p>
          <div className="w-16 h-0.5 bg-hestia-gold mx-auto mt-4" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {INGREDIENTS.map((item) => (
            <div
              key={item.name}
              className="text-center p-6 bg-white rounded-sm border border-hestia-light hover:border-hestia-gold hover:shadow-md transition-all"
            >
              <div className="text-3xl text-hestia-gold mb-4">{item.icon}</div>
              <h3 className="font-playfair font-bold text-lg text-hestia-dark mb-1">{item.name}</h3>
              <p className="text-xs text-hestia-gold mb-3">{item.name_ko}</p>
              <p className="text-xs text-hestia-gray leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
