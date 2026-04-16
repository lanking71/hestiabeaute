"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import CategoryForm from "@/components/admin/CategoryForm";
import { adminGetCategories, adminCreateCategory, adminUpdateCategory, adminDeleteCategory } from "@/lib/api";
import { Category } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Plus } from "lucide-react";

type Mode = "list" | "add" | "edit";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [mode, setMode] = useState<Mode>("list");
  const [editing, setEditing] = useState<Category | null>(null);

  function getToken() {
    return localStorage.getItem("admin_token") || "";
  }

  async function load() {
    const cats = await adminGetCategories(getToken()).catch(() => []);
    setCategories(cats);
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { load(); }, []);

  async function handleCreate(data: Partial<Category>) {
    await adminCreateCategory(getToken(), data);
    await load();
    setMode("list");
  }

  async function handleUpdate(data: Partial<Category>) {
    if (!editing) return;
    await adminUpdateCategory(getToken(), editing.id, data);
    await load();
    setMode("list");
    setEditing(null);
  }

  async function handleDelete(id: number) {
    if (!confirm("삭제하시겠습니까?")) return;
    await adminDeleteCategory(getToken(), id);
    await load();
  }

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-hestia-dark">카테고리 관리</h1>
        {mode === "list" && (
          <Button onClick={() => setMode("add")} size="sm">
            <Plus className="h-4 w-4 mr-1" /> 카테고리 추가
          </Button>
        )}
      </div>

      {mode !== "list" && (
        <div className="bg-white rounded-sm border border-gray-200 p-6 mb-6">
          <h2 className="font-medium mb-4">{mode === "add" ? "카테고리 추가" : "카테고리 수정"}</h2>
          <CategoryForm
            initial={editing ?? {}}
            onSubmit={mode === "add" ? handleCreate : handleUpdate}
            onCancel={() => { setMode("list"); setEditing(null); }}
          />
        </div>
      )}

      <div className="bg-white rounded-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="py-3 px-4 text-left font-medium text-gray-500">순서</th>
              <th className="py-3 px-4 text-left font-medium text-gray-500">한글명</th>
              <th className="py-3 px-4 text-left font-medium text-gray-500 hidden md:table-cell">영문명</th>
              <th className="py-3 px-4 text-left font-medium text-gray-500 hidden sm:table-cell">Slug</th>
              <th className="py-3 px-4 text-right font-medium text-gray-500">액션</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4 text-gray-500">{cat.sort_order}</td>
                <td className="py-3 px-4 font-medium">{cat.name_ko}</td>
                <td className="py-3 px-4 text-gray-500 hidden md:table-cell">{cat.name_en}</td>
                <td className="py-3 px-4 text-gray-500 hidden sm:table-cell text-xs">{cat.slug}</td>
                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => { setEditing(cat); setMode("edit"); }}
                      className="p-1.5 hover:text-hestia-gold transition-colors"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(cat.id)}
                      className="p-1.5 hover:text-red-500 transition-colors"
                    >
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
