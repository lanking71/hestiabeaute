"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Search } from "lucide-react";
import Navigation from "./Navigation";
import { Category } from "@/lib/types";
import { cn } from "@/lib/utils";

interface HeaderProps {
  categories: Category[];
}

export default function Header({ categories }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 bg-white transition-shadow",
        scrolled && "shadow-sm"
      )}
    >
      {/* 상단 줄: 로고 왼쪽, 문의 오른쪽 */}
      <div className="max-w-[1600px] mx-auto px-6 lg:px-10">
        <div className="flex items-center justify-between h-14 border-b border-hestia-muted">
          {/* 로고 */}
          <Link href="/" className="flex items-center gap-2">
            <span className="font-cormorant text-2xl font-semibold tracking-[0.25em] text-hestia-dark">
              HESTIA
            </span>
            <span className="text-[10px] text-hestia-gold font-medium tracking-[0.2em] hidden sm:block">
              BEAUTY
            </span>
          </Link>

          {/* 우측: 검색 + 문의 + 모바일 메뉴 */}
          <div className="flex items-center gap-4">
            <Link
              href="/inquiry"
              className="hidden md:block text-[11px] tracking-[0.2em] text-hestia-gray hover:text-hestia-gold transition-colors uppercase"
            >
              문의
            </Link>
            <button className="p-1.5 hover:text-hestia-gold transition-colors" aria-label="검색">
              <Search className="h-4 w-4" />
            </button>
            <button
              className="lg:hidden p-1.5 hover:text-hestia-gold transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="메뉴"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* 카테고리 네비 줄 */}
        <div className="hidden lg:flex items-center justify-center py-2.5 overflow-x-auto">
          <Navigation categories={categories} />
        </div>
      </div>

      {/* 모바일 메뉴 */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-hestia-muted bg-white">
          <nav className="px-6 py-4 space-y-1">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/products/${cat.slug}`}
                className="block py-2.5 text-xs tracking-[0.15em] text-hestia-dark hover:text-hestia-gold border-b border-hestia-muted/50 uppercase"
                onClick={() => setMobileOpen(false)}
              >
                {cat.name_en}
                <span className="ml-2 text-hestia-gray normal-case tracking-normal">{cat.name_ko}</span>
              </Link>
            ))}
            <Link
              href="/inquiry"
              className="block pt-3 text-xs tracking-[0.15em] text-hestia-dark hover:text-hestia-gold uppercase"
              onClick={() => setMobileOpen(false)}
            >
              제품 문의
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
