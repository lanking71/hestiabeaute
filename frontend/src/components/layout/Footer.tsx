// =====================================================
// 📁 Footer.tsx — 하단 푸터
// =====================================================
// 모든 페이지 맨 아래에 표시되는 푸터 컴포넌트예요.
// 구성:
//   - 브랜드 이름 + 설명 + SNS 링크
//   - 사이트 메뉴 링크
//   - 고객센터 정보 (전화, 이메일, 운영 시간)
//   - 저작권 표시
// =====================================================

import Link from "next/link";
import { ExternalLink } from "lucide-react";  // 외부 링크 아이콘
import { BRAND_CONTACT, NAV_LINKS } from "@/lib/constants";  // 연락처, 메뉴 상수

export default function Footer() {
  return (
    // bg-hestia-dark: 거의 검정 배경 | text-white: 흰 글씨
    <footer className="bg-hestia-dark text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* grid: 격자 레이아웃 — 모바일:1열, PC:4열 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* ── 브랜드 소개 영역 (4열 중 2열 차지) ── */}
          <div className="md:col-span-2">
            {/* 브랜드 이름 */}
            <div className="font-playfair text-2xl font-bold tracking-widest mb-2">HESTIA</div>
            <p className="text-hestia-gray text-sm mb-4">
              글루타치온 기반 프리미엄 화장품<br />
              아름다운 피부를 위한 과학적 케어
            </p>

            {/* SNS 링크들 */}
            <div className="flex gap-4">
              <a href="#" className="text-hestia-gray hover:text-hestia-gold transition-colors text-xs flex items-center gap-1" aria-label="Instagram">
                <ExternalLink className="h-4 w-4" /> Instagram
              </a>
              <a href="#" className="text-hestia-gray hover:text-hestia-gold transition-colors text-xs flex items-center gap-1" aria-label="YouTube">
                <ExternalLink className="h-4 w-4" /> YouTube
              </a>
            </div>
          </div>

          {/* ── 메뉴 링크 영역 ── */}
          <div>
            <h4 className="text-sm font-semibold mb-4 text-hestia-gold uppercase tracking-wider">메뉴</h4>
            <ul className="space-y-2">
              {/* NAV_LINKS 배열을 반복하여 메뉴 항목 생성 */}
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-hestia-gray hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── 고객센터 정보 영역 ── */}
          <div>
            <h4 className="text-sm font-semibold mb-4 text-hestia-gold uppercase tracking-wider">고객센터</h4>
            <ul className="space-y-2 text-sm text-hestia-gray">
              <li>Tel: {BRAND_CONTACT.phone}</li>
              <li>Email: {BRAND_CONTACT.email}</li>
              <li className="text-xs">{BRAND_CONTACT.hours}</li>
            </ul>
          </div>
        </div>

        {/* ── 하단 저작권 표시 ── */}
        <div className="border-t border-white/10 mt-10 pt-6 text-center text-xs text-hestia-gray">
          {/* new Date().getFullYear(): 현재 연도를 자동으로 가져오기 (매년 자동 갱신) */}
          <p>© {new Date().getFullYear()} HESTIA Beauty. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
