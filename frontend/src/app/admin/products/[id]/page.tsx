"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import AdminLayout from "@/components/admin/AdminLayout";
import ProductForm from "@/components/admin/ProductForm";
import { adminGetCategories, adminGetProducts, adminUpdateProduct } from "@/lib/api";
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
      adminGetProducts(token).then((r) => r.items.find((p) => p.id === id)),
    ]).then(([cats, prod]) => {
      setCategories(cats);
      if (prod) setProduct(prod);
    }).catch(() => {});
  }, [id]);

  async function handleSubmit(data: Partial<Product>) {
    const token = localStorage.getItem("admin_token") || "";
    await adminUpdateProduct(token, id, data);
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
