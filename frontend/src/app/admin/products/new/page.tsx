"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminLayout from "@/components/admin/AdminLayout";
import ProductForm from "@/components/admin/ProductForm";
import { adminGetCategories, adminCreateProduct } from "@/lib/api";
import { Category, Product } from "@/lib/types";

export default function AdminProductNewPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("admin_token") || "";
    adminGetCategories(token).then(setCategories).catch(() => {});
  }, []);

  async function handleSubmit(data: Partial<Product> & { image_urls_raw?: string }) {
    const token = localStorage.getItem("admin_token") || "";
    const { image_urls_raw, ...rest } = data;
    await adminCreateProduct(token, { ...rest, image_urls: image_urls_raw as unknown as string[] });
    router.push("/admin/products");
  }

  return (
    <AdminLayout>
      <h1 className="text-xl font-bold text-hestia-dark mb-6">제품 등록</h1>
      <div className="bg-white rounded-sm border border-gray-200 p-6">
        <ProductForm
          categories={categories}
          onSubmit={handleSubmit}
          onCancel={() => router.push("/admin/products")}
        />
      </div>
    </AdminLayout>
  );
}
