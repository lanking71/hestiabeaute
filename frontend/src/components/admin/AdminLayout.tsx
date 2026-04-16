"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Layers,
  Package,
  MessageSquare,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/admin/dashboard", label: "대시보드", icon: LayoutDashboard },
  { href: "/admin/categories", label: "카테고리", icon: Layers },
  { href: "/admin/products", label: "제품 관리", icon: Package },
  { href: "/admin/inquiry", label: "문의 관리", icon: MessageSquare },
];

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) router.replace("/admin/login");
  }, [router]);

  function handleLogout() {
    localStorage.removeItem("admin_token");
    router.push("/admin/login");
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* 사이드바 */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-hestia-dark text-white flex flex-col transition-transform",
          "md:relative md:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="p-6 border-b border-white/10">
          <div className="font-playfair text-xl font-bold tracking-widest">HESTIA</div>
          <p className="text-white/50 text-xs mt-1">관리자 페이지</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-4 py-2.5 rounded-md text-sm transition-colors",
                pathname === href
                  ? "bg-hestia-gold text-white"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              )}
              onClick={() => setSidebarOpen(false)}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2.5 w-full text-sm text-white/70 hover:text-white hover:bg-white/10 rounded-md transition-colors"
          >
            <LogOut className="h-4 w-4" />
            로그아웃
          </button>
        </div>
      </aside>

      {/* 모바일 오버레이 */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* 메인 */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* 상단 헤더 */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-4">
          <button
            className="md:hidden p-1 hover:text-hestia-gold transition-colors"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <h2 className="font-medium text-hestia-dark">
            {NAV_ITEMS.find((n) => n.href === pathname)?.label || "관리자"}
          </h2>
        </header>

        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
