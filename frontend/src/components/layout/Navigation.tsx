"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { Category } from "@/lib/types";
import { cn } from "@/lib/utils";

interface NavigationProps {
  categories: Category[];
}

export default function Navigation({ categories }: NavigationProps) {
  const [open, setOpen] = useState(false);

  return (
    <nav className="hidden md:flex items-center gap-8">
      <Link href="/" className="text-sm font-medium hover:text-hestia-gold transition-colors">
        홈
      </Link>

      {/* 제품 드롭다운 */}
      <div
        className="relative"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        <button className="flex items-center gap-1 text-sm font-medium hover:text-hestia-gold transition-colors">
          제품
          <ChevronDown className={cn("h-4 w-4 transition-transform", open && "rotate-180")} />
        </button>

        {open && (
          <div className="absolute top-full left-0 mt-1 w-56 bg-white shadow-lg border border-hestia-light rounded-md py-2 z-50">
            <Link
              href="/products"
              className="block px-4 py-2 text-sm hover:bg-hestia-cream hover:text-hestia-gold transition-colors"
            >
              전체 제품
            </Link>
            <div className="border-t border-hestia-light my-1" />
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/products/${cat.slug}`}
                className="block px-4 py-2 text-sm hover:bg-hestia-cream hover:text-hestia-gold transition-colors"
              >
                {cat.name_ko}
              </Link>
            ))}
          </div>
        )}
      </div>

      <Link href="/about" className="text-sm font-medium hover:text-hestia-gold transition-colors">
        브랜드 소개
      </Link>
      <Link href="/inquiry" className="text-sm font-medium hover:text-hestia-gold transition-colors">
        제품 문의
      </Link>
    </nav>
  );
}
