"use client";

import { useState, FormEvent } from "react";
import { Product, Category } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import ImageUploader from "./ImageUploader";

interface ProductFormProps {
  initial?: Partial<Product>;
  categories: Category[];
  onSubmit: (data: Partial<Product>) => Promise<void>;
  onCancel: () => void;
}

export default function ProductForm({ initial, categories, onSubmit, onCancel }: ProductFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [imageUrl, setImageUrl] = useState(initial?.image_url || "");
  const [isBestseller, setIsBestseller] = useState(initial?.is_bestseller ?? false);
  const [isNew, setIsNew] = useState(initial?.is_new ?? false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const form = e.currentTarget;
    const get = (name: string) => (form.elements.namedItem(name) as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement)?.value;

    const data: Partial<Product> = {
      category_id: Number(get("category_id")),
      name: get("name"),
      name_ko: get("name_ko"),
      slug: get("slug"),
      description: get("description"),
      ingredients: get("ingredients"),
      volume: get("volume"),
      skin_type: get("skin_type"),
      how_to_use: get("how_to_use"),
      image_url: imageUrl,
      is_bestseller: isBestseller,
      is_new: isNew,
      sort_order: Number(get("sort_order")) || 0,
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
    <form onSubmit={handleSubmit} className="space-y-5 max-w-2xl">
      {/* 카테고리 */}
      <div>
        <label className="block text-sm font-medium mb-1">카테고리 *</label>
        <select
          name="category_id"
          required
          defaultValue={initial?.category_id}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        >
          <option value="">카테고리 선택</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name_ko}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">제품명 (영문) *</label>
          <Input name="name" required defaultValue={initial?.name} placeholder="Glutathione Cream" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">제품명 (한글)</label>
          <Input name="name_ko" defaultValue={initial?.name_ko} placeholder="글루타치온 크림" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Slug *</label>
          <Input name="slug" required defaultValue={initial?.slug} placeholder="glutathione-cream" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">용량</label>
          <Input name="volume" defaultValue={initial?.volume} placeholder="50ml" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">피부 타입</label>
        <Input name="skin_type" defaultValue={initial?.skin_type} placeholder="모든 피부 타입" />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">제품 설명</label>
        <Textarea name="description" rows={4} defaultValue={initial?.description} placeholder="제품 설명 (HTML 가능)" />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">성분</label>
        <Textarea name="ingredients" rows={3} defaultValue={initial?.ingredients} placeholder="주요 성분 목록" />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">사용 방법</label>
        <Textarea name="how_to_use" rows={3} defaultValue={initial?.how_to_use} placeholder="사용 방법 안내" />
      </div>

      <ImageUploader value={imageUrl} onChange={setImageUrl} label="대표 이미지" />

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">정렬 순서</label>
          <Input name="sort_order" type="number" defaultValue={initial?.sort_order ?? 0} />
        </div>
      </div>

      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input type="checkbox" checked={isBestseller} onChange={(e) => setIsBestseller(e.target.checked)} />
          베스트셀러
        </label>
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input type="checkbox" checked={isNew} onChange={(e) => setIsNew(e.target.checked)} />
          신제품 (NEW)
        </label>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={loading}>
          {loading ? "저장 중..." : "저장"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>취소</Button>
      </div>
    </form>
  );
}
