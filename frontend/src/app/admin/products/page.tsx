"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { adminGetProducts, adminDeleteProduct } from "@/lib/api";
import { Product } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Plus } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { getImageUrl } from "@/lib/utils";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);

  function getToken() {
    return localStorage.getItem("admin_token") || "";
  }

  async function load() {
    const result = await adminGetProducts(getToken(), { size: 1000 }).catch(() => ({ items: [], total: 0 }));
    setProducts(result.items);
    setTotal(result.total);
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { load(); }, []);

  async function handleDelete(id: number) {
    if (!confirm("제품을 삭제하시겠습니까?")) return;
    await adminDeleteProduct(getToken(), id);
    await load();
  }

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-hestia-dark">제품 관리</h1>
          <p className="text-sm text-hestia-gray mt-1">총 {total}개</p>
        </div>
        <Link href="/admin/products/new">
          <Button size="sm">
            <Plus className="h-4 w-4 mr-1" /> 제품 등록
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="py-3 px-4 text-left font-medium text-gray-500 w-16">이미지</th>
              <th className="py-3 px-4 text-left font-medium text-gray-500">제품명</th>
              <th className="py-3 px-4 text-left font-medium text-gray-500 hidden md:table-cell">카테고리</th>
              <th className="py-3 px-4 text-left font-medium text-gray-500 hidden sm:table-cell">용량</th>
              <th className="py-3 px-4 text-right font-medium text-gray-500">액션</th>
            </tr>
          </thead>
          <tbody>
            {products.map((prod) => (
              <tr key={prod.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4">
                  <div className="relative w-10 h-10 bg-hestia-light rounded overflow-hidden">
                    {prod.image_url && (
                      <Image
                        src={getImageUrl(prod.image_url)}
                        alt={prod.name}
                        fill
                        className="object-cover"
                        sizes="40px"
                      />
                    )}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <p className="font-medium">{prod.name_ko || prod.name}</p>
                  <p className="text-xs text-hestia-gray">{prod.name}</p>
                </td>
                <td className="py-3 px-4 text-gray-500 hidden md:table-cell">
                  {prod.category?.name_ko}
                </td>
                <td className="py-3 px-4 text-gray-500 hidden sm:table-cell">{prod.volume}</td>
                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link href={`/admin/products/${prod.id}`} className="p-1.5 hover:text-hestia-gold transition-colors">
                      <Pencil className="h-4 w-4" />
                    </Link>
                    <button onClick={() => handleDelete(prod.id)} className="p-1.5 hover:text-red-500 transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
