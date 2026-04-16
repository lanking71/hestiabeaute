"use client";

import { useState, FormEvent } from "react";
import { Category } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface CategoryFormProps {
  initial?: Partial<Category>;
  onSubmit: (data: Partial<Category>) => Promise<void>;
  onCancel: () => void;
}

export default function CategoryForm({ initial, onSubmit, onCancel }: CategoryFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const form = e.currentTarget;
    const data: Partial<Category> = {
      name_ko: (form.elements.namedItem("name_ko") as HTMLInputElement).value,
      name_en: (form.elements.namedItem("name_en") as HTMLInputElement).value,
      slug: (form.elements.namedItem("slug") as HTMLInputElement).value,
      sort_order: Number((form.elements.namedItem("sort_order") as HTMLInputElement).value) || 0,
    };

    try {
      await onSubmit(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">한글명 *</label>
          <Input name="name_ko" required defaultValue={initial?.name_ko} placeholder="스킨·토너·플루이드" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">영문명 *</label>
          <Input name="name_en" required defaultValue={initial?.name_en} placeholder="SKIN TONER FLUID" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Slug *</label>
          <Input name="slug" required defaultValue={initial?.slug} placeholder="skin-toner-fluid" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">정렬 순서</label>
          <Input name="sort_order" type="number" defaultValue={initial?.sort_order ?? 0} />
        </div>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="flex gap-3">
        <Button type="submit" disabled={loading}>
          {loading ? "저장 중..." : "저장"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>취소</Button>
      </div>
    </form>
  );
}
