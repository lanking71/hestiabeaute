"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Category } from "@/lib/types";
import { cn } from "@/lib/utils";

interface NavigationProps {
  categories: Category[];
}

export default function Navigation({ categories }: NavigationProps) {
  const pathname = usePathname();

  return (
    <nav className="hidden lg:flex items-center">
      {/* 카테고리 수평 나열 */}
      <div className="flex items-center">
        {categories.map((cat, i) => (
          <Link
            key={cat.id}
            href={`/products/${cat.slug}`}
            className={cn(
              "relative px-3 xl:px-4 py-1 text-[11px] tracking-[0.15em] font-medium uppercase transition-colors whitespace-nowrap",
              "after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:h-px after:bg-hestia-gold after:transition-all after:duration-300",
              pathname === `/products/${cat.slug}`
                ? "text-hestia-gold after:w-full"
                : "text-hestia-dark hover:text-hestia-gold after:w-0 hover:after:w-full",
              i < categories.length - 1 && "border-r border-hestia-muted"
            )}
          >
            {cat.name_en}
          </Link>
        ))}
      </div>
    </nav>
  );
}
