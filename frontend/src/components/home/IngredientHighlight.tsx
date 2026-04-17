// =====================================================
// 📁 IngredientHighlight.tsx — 핵심 성분 소개 카드
// =====================================================
// 홈페이지 하단에 HESTIA 제품의 핵심 성분 4가지를
// 카드 형태로 소개하는 섹션이에요.
//
// 성분: 글루타치온, 세라마이드, EGF 펩타이드, 콜라겐
// (constants.ts의 INGREDIENTS 배열에서 데이터를 가져와요)
//
// 정적 컴포넌트 (API 호출 없음)
// =====================================================

import { INGREDIENTS } from "@/lib/constants";  // 성분 데이터

export default function IngredientHighlight() {
  return (
    // bg-hestia-light: 약간 베이지빛 연한 배경
    <section className="py-16 bg-hestia-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── 섹션 제목 ── */}
        <div className="text-center mb-10">
          <h2 className="font-playfair text-3xl font-bold text-hestia-dark mb-2">KEY INGREDIENTS</h2>
          <p className="text-hestia-gray text-sm tracking-wider">핵심 성분</p>
          {/* 장식용 골드 가로선 (mx-auto: 가운데 정렬) */}
          <div className="w-16 h-0.5 bg-hestia-gold mx-auto mt-4" />
        </div>

        {/* ── 성분 카드 그리드 ── */}
        {/* grid-cols-2: 모바일 2열, md:grid-cols-4: PC 4열 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {/* INGREDIENTS 배열을 순회하며 카드 생성 */}
          {INGREDIENTS.map((item) => (
            <div
              key={item.name}  // 성분 영문명을 고유 키로 사용
              // hover:border-hestia-gold hover:shadow-md: 마우스 올리면 테두리 골드 + 그림자
              className="text-center p-6 bg-white rounded-sm border border-hestia-light hover:border-hestia-gold hover:shadow-md transition-all"
            >
              {/* 장식 아이콘 (텍스트 기호) */}
              <div className="text-3xl text-hestia-gold mb-4">{item.icon}</div>

              {/* 성분 영문명 */}
              <h3 className="font-playfair font-bold text-lg text-hestia-dark mb-1">{item.name}</h3>

              {/* 성분 한글명 */}
              <p className="text-xs text-hestia-gold mb-3">{item.name_ko}</p>

              {/* 성분 설명 */}
              <p className="text-xs text-hestia-gray leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
