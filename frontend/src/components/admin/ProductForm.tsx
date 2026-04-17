"use client";

import { useState, FormEvent } from "react";
import { Product, Category } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import ImageUploader from "./ImageUploader";
import Image from "next/image";
import { getImageUrl } from "@/lib/utils";
import { adminUploadImage } from "@/lib/api";
import { X, Plus } from "lucide-react";

interface ProductFormProps {
  initial?: Partial<Product>;
  categories: Category[];
  onSubmit: (data: Partial<Product> & { image_urls_raw?: string }) => Promise<void>;
  onCancel: () => void;
}

export default function ProductForm({ initial, categories, onSubmit, onCancel }: ProductFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [imageUrl, setImageUrl] = useState(initial?.image_url || "");
  const [detailImages, setDetailImages] = useState<string[]>(initial?.image_urls || []);
  const [isBestseller, setIsBestseller] = useState(initial?.is_bestseller ?? false);
  const [isNew, setIsNew] = useState(initial?.is_new ?? false);
  const [uploading, setUploading] = useState(false);

  async function handleDetailImageAdd(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files) return;
    setUploading(true);
    try {
      const token = localStorage.getItem("admin_token") || "";
      const urls: string[] = [];
      for (const file of Array.from(files)) {
        const { url } = await adminUploadImage(token, file);
        urls.push(url);
      }
      setDetailImages((prev) => [...prev, ...urls]);
    } catch {
      alert("이미지 업로드 실패");
    } finally {
      setUploading(false);
    }
  }

  function removeDetailImage(index: number) {
    setDetailImages((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const form = e.currentTarget;
    const get = (name: string) =>
      (form.elements.namedItem(name) as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement)?.value;

    const data: Partial<Product> & { image_urls_raw?: string } = {
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
      image_urls_raw: JSON.stringify(detailImages),
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

      {/* 썸네일 이미지 */}
      <ImageUploader value={imageUrl} onChange={setImageUrl} label="썸네일 이미지 (목록/카드용)" />

      {/* 상세페이지 이미지 */}
      <div className="space-y-3">
        <label className="block text-sm font-medium">
          상세페이지 이미지 <span className="text-hestia-gray font-normal">(여러 장 업로드 가능 — 순서대로 세로 표시)</span>
        </label>

        {detailImages.length > 0 && (
          <div className="grid grid-cols-3 gap-3">
            {detailImages.map((url, i) => (
              <div key={i} className="relative group">
                <div className="relative aspect-[3/4] overflow-hidden rounded border border-gray-200">
                  <Image
                    src={getImageUrl(url)}
                    alt={`상세 이미지 ${i + 1}`}
                    fill
                    className="object-cover"
                    sizes="200px"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeDetailImage(i)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600"
                >
                  <X className="h-3 w-3" />
                </button>
                <p className="text-xs text-center text-hestia-gray mt-1">{i + 1}번째</p>
              </div>
            ))}
          </div>
        )}

        <label className="flex items-center gap-2 border-2 border-dashed border-gray-200 rounded-sm p-4 cursor-pointer hover:border-hestia-gold transition-colors">
          <Plus className="h-5 w-5 text-hestia-gray" />
          <span className="text-sm text-hestia-gray">
            {uploading ? "업로드 중..." : "이미지 추가 (여러 장 선택 가능)"}
          </span>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            className="hidden"
            onChange={handleDetailImageAdd}
          />
        </label>
      </div>

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
