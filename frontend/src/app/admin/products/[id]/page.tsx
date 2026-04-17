"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import AdminLayout from "@/components/admin/AdminLayout";
import ProductForm from "@/components/admin/ProductForm";
import { adminGetCategories, adminGetProduct, adminUpdateProduct } from "@/lib/api";
import { Category, Product } from "@/lib/types";

export default function AdminProductEditPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);
  const [categories, setCategories] = useState<Category[]>([]);
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("admin_token") || "";
    Promise.all([
      adminGetCategories(token),
      adminGetProduct(token, id),
    ]).then(([cats, prod]) => {
      setCategories(cats);
      setProduct(prod);
    }).catch(() => {});
  }, [id]);

  async function handleSubmit(data: Partial<Product> & { image_urls_raw?: string }) {
    const token = localStorage.getItem("admin_token") || "";
    const { image_urls_raw, ...rest } = data;
    // image_urls_raw는 JSON 문자열 → 백엔드 image_urls(str)에 그대로 전달
    await adminUpdateProduct(token, id, { ...rest, image_urls: image_urls_raw as unknown as string[] });
    router.push("/admin/products");
  }

  if (!product) return <AdminLayout><div className="p-6">로딩 중...</div></AdminLayout>;

  return (
    <AdminLayout>
      <h1 className="text-xl font-bold text-hestia-dark mb-6">제품 수정</h1>
      <div className="bg-white rounded-sm border border-gray-200 p-6">
        <ProductForm
          initial={product}
          categories={categories}
          onSubmit={handleSubmit}
          onCancel={() => router.push("/admin/products")}
        />
      </div>
    </AdminLayout>
  );
}
