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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* 로고 */}
          <Link href="/" className="flex items-center">
            <span className="font-playfair text-2xl font-bold tracking-widest text-hestia-dark">
              HESTIA
            </span>
            <span className="ml-1 text-xs text-hestia-gold font-medium tracking-wider">
              BEAUTY
            </span>
          </Link>

          {/* 데스크탑 네비 */}
          <Navigation categories={categories} />

          {/* 우측 아이콘 */}
          <div className="flex items-center gap-3">
            <button className="p-2 hover:text-hestia-gold transition-colors" aria-label="검색">
              <Search className="h-5 w-5" />
            </button>
            {/* 모바일 메뉴 버튼 */}
            <button
              className="md:hidden p-2 hover:text-hestia-gold transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="메뉴"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* 모바일 메뉴 */}
      {mobileOpen && (
        <div className="md:hidden border-t border-hestia-light bg-white">
          <nav className="px-4 py-4 space-y-2">
            <Link
              href="/"
              className="block py-2 text-sm font-medium hover:text-hestia-gold"
              onClick={() => setMobileOpen(false)}
            >
              홈
            </Link>
            <Link
              href="/products"
              className="block py-2 text-sm font-medium hover:text-hestia-gold"
              onClick={() => setMobileOpen(false)}
            >
              전체 제품
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/products/${cat.slug}`}
                className="block py-2 pl-4 text-sm text-hestia-gray hover:text-hestia-gold"
                onClick={() => setMobileOpen(false)}
              >
                {cat.name_ko}
              </Link>
            ))}
            <Link
              href="/about"
              className="block py-2 text-sm font-medium hover:text-hestia-gold"
              onClick={() => setMobileOpen(false)}
            >
              브랜드 소개
            </Link>
            <Link
              href="/inquiry"
              className="block py-2 text-sm font-medium hover:text-hestia-gold"
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
