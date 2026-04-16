"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { adminGetCategories, adminGetProducts, adminGetInquiries } from "@/lib/api";
import { Package, Layers, MessageSquare } from "lucide-react";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({ products: 0, categories: 0, inquiries: 0 });

  useEffect(() => {
    const token = localStorage.getItem("admin_token") || "";
    Promise.all([
      adminGetCategories(token).catch(() => []),
      adminGetProducts(token).catch(() => ({ items: [], total: 0 })),
      adminGetInquiries(token).catch(() => ({ items: [], total: 0 })),
    ]).then(([cats, prods, inqs]) => {
      setStats({
        categories: cats.length,
        products: prods.total,
        inquiries: inqs.total,
      });
    });
  }, []);

  const CARDS = [
    { label: "카테고리", value: stats.categories, icon: Layers, href: "/admin/categories" },
    { label: "전체 제품", value: stats.products, icon: Package, href: "/admin/products" },
    { label: "총 문의", value: stats.inquiries, icon: MessageSquare, href: "/admin/inquiry" },
  ];

  return (
    <AdminLayout>
      <h1 className="text-xl font-bold text-hestia-dark mb-6">대시보드</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {CARDS.map(({ label, value, icon: Icon, href }) => (
          <a key={label} href={href} className="bg-white rounded-sm border border-gray-200 p-6 hover:border-hestia-gold transition-colors">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-hestia-gray">{label}</p>
              <Icon className="h-5 w-5 text-hestia-gold" />
            </div>
            <p className="text-3xl font-bold text-hestia-dark">{value}</p>
          </a>
        ))}
      </div>

      <div className="bg-white rounded-sm border border-gray-200 p-6">
        <h2 className="font-medium text-hestia-dark mb-4">빠른 메뉴</h2>
        <div className="grid grid-cols-2 gap-3">
          <a href="/admin/products/new" className="text-center py-3 border border-hestia-gold text-hestia-gold text-sm hover:bg-hestia-gold hover:text-white transition-colors rounded">
            제품 등록
          </a>
          <a href="/admin/categories" className="text-center py-3 border border-hestia-light text-hestia-dark text-sm hover:border-hestia-gold hover:text-hestia-gold transition-colors rounded">
            카테고리 관리
          </a>
        </div>
      </div>
    </AdminLayout>
  );
}
