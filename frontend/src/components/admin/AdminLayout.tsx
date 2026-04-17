// =====================================================
// 📁 AdminLayout.tsx — 관리자 페이지 공통 레이아웃
// =====================================================
// 관리자 페이지들의 공통 레이아웃을 제공하는 컴포넌트예요.
//
// 구성:
//   - 왼쪽 사이드바: 메뉴 목록 + 로그아웃
//   - 오른쪽 메인: 각 관리자 페이지 내용
//
// 기능:
//   - 로그인 확인: 토큰 없으면 로그인 페이지로 자동 이동
//   - 현재 페이지 메뉴 강조 (골드 배경)
//   - 모바일: 햄버거 버튼으로 사이드바 열기/닫기
//
// "use client": useEffect, useState, usePathname 사용
// =====================================================

"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
// lucide-react 아이콘들
import {
  LayoutDashboard,  // 대시보드 아이콘
  Layers,          // 카테고리 아이콘 (레이어)
  Package,         // 제품 아이콘 (상자)
  MessageSquare,   // 문의 아이콘 (말풍선)
  LogOut,          // 로그아웃 아이콘
  Menu,            // 햄버거 메뉴 아이콘
  X,               // 닫기 X 아이콘
  ImageIcon,       // 이미지 아이콘 (배너)
} from "lucide-react";
import { cn } from "@/lib/utils";

// 사이드바 메뉴 항목 목록 정의
// href: 이동할 주소, label: 표시 텍스트, icon: 아이콘 컴포넌트
const NAV_ITEMS = [
  { href: "/admin/dashboard", label: "대시보드", icon: LayoutDashboard },
  { href: "/admin/banners", label: "배너 관리", icon: ImageIcon },
  { href: "/admin/categories", label: "카테고리", icon: Layers },
  { href: "/admin/products", label: "제품 관리", icon: Package },
  { href: "/admin/inquiry", label: "문의 관리", icon: MessageSquare },
];

// AdminLayout이 받을 props 타입
interface AdminLayoutProps {
  children: React.ReactNode;  // 각 관리자 페이지의 고유 내용
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();    // 페이지 이동
  const pathname = usePathname(); // 현재 URL 경로 (메뉴 강조에 사용)
  const [sidebarOpen, setSidebarOpen] = useState(false);  // 모바일 사이드바 열림 상태

  // 관리자 인증 확인
  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      // 토큰이 없으면 로그인 페이지로 강제 이동 (replace: 뒤로가기 방지)
      router.replace("/admin/login");
    }
  }, [router]);

  // 로그아웃 함수
  function handleLogout() {
    localStorage.removeItem("admin_token");  // 저장된 토큰 삭제
    router.push("/admin/login");              // 로그인 페이지로 이동
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">

      {/* ── 사이드바 ── */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-hestia-dark text-white flex flex-col transition-transform",
          // md:relative md:translate-x-0: 768px 이상 PC에서는 항상 보임
          "md:relative md:translate-x-0",
          // 모바일: sidebarOpen이 true면 보임, false면 왼쪽으로 숨김
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* 사이드바 헤더: 브랜드명 */}
        <div className="p-6 border-b border-white/10">
          <div className="font-playfair text-xl font-bold tracking-widest">HESTIA</div>
          <p className="text-white/50 text-xs mt-1">관리자 페이지</p>
        </div>

        {/* 사이드바 메뉴 목록 */}
        <nav className="flex-1 p-4 space-y-1">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-4 py-2.5 rounded-md text-sm transition-colors",
                // 현재 페이지: 골드 배경 + 흰 글씨
                pathname === href
                  ? "bg-hestia-gold text-white"
                  // 다른 페이지: 흰색 70% 투명 글씨, 호버 시 흰색
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              )}
              onClick={() => setSidebarOpen(false)}  // 링크 클릭 시 모바일 메뉴 닫기
            >
              <Icon className="h-4 w-4" />  {/* 아이콘 */}
              {label}                        {/* 메뉴 텍스트 */}
            </Link>
          ))}
        </nav>

        {/* 로그아웃 버튼 (사이드바 맨 아래) */}
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

      {/* ── 모바일 오버레이 ── */}
      {/* 사이드바가 열렸을 때 사이드바 외부를 클릭하면 닫히도록 */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── 메인 콘텐츠 영역 ── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* 상단 헤더 */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-4">
          {/* 모바일 햄버거 버튼 (PC에서는 숨김) */}
          <button
            className="md:hidden p-1 hover:text-hestia-gold transition-colors"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          {/* 현재 페이지 제목 (사이드바 메뉴에서 찾아서 표시) */}
          <h2 className="font-medium text-hestia-dark">
            {NAV_ITEMS.find((n) => n.href === pathname)?.label || "관리자"}
          </h2>
        </header>

        {/* 각 관리자 페이지의 내용 */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
