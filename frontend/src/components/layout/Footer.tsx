import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { BRAND_CONTACT, NAV_LINKS } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="bg-hestia-dark text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* 브랜드 */}
          <div className="md:col-span-2">
            <div className="font-playfair text-2xl font-bold tracking-widest mb-2">HESTIA</div>
            <p className="text-hestia-gray text-sm mb-4">
              글루타치온 기반 프리미엄 화장품<br />
              아름다운 피부를 위한 과학적 케어
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-hestia-gray hover:text-hestia-gold transition-colors text-xs flex items-center gap-1" aria-label="Instagram">
                <ExternalLink className="h-4 w-4" /> Instagram
              </a>
              <a href="#" className="text-hestia-gray hover:text-hestia-gold transition-colors text-xs flex items-center gap-1" aria-label="YouTube">
                <ExternalLink className="h-4 w-4" /> YouTube
              </a>
            </div>
          </div>

          {/* 메뉴 */}
          <div>
            <h4 className="text-sm font-semibold mb-4 text-hestia-gold uppercase tracking-wider">메뉴</h4>
            <ul className="space-y-2">
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

          {/* 고객센터 */}
          <div>
            <h4 className="text-sm font-semibold mb-4 text-hestia-gold uppercase tracking-wider">고객센터</h4>
            <ul className="space-y-2 text-sm text-hestia-gray">
              <li>Tel: {BRAND_CONTACT.phone}</li>
              <li>Email: {BRAND_CONTACT.email}</li>
              <li className="text-xs">{BRAND_CONTACT.hours}</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 text-center text-xs text-hestia-gray">
          <p>© {new Date().getFullYear()} HESTIA Beauty. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
