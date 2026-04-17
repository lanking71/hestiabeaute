// =====================================================
// 📁 ProductForm.tsx — 제품 등록/수정 폼
// =====================================================
// 관리자가 제품을 새로 등록하거나 기존 제품을 수정할 때
// 사용하는 폼 컴포넌트예요.
//
// 입력 항목:
//   - 카테고리 선택 (드롭다운)
//   - 제품명 (영문/한글)
//   - Slug (URL용)
//   - 용량, 피부 타입
//   - 제품 설명, 성분, 사용 방법
//   - 썸네일 이미지 (1장, ImageUploader 사용)
//   - 상세 이미지 (여러 장, 직접 업로드)
//   - 정렬 순서
//   - 베스트셀러 / 신제품 체크박스
//
// initial이 있으면 수정 모드, 없으면 신규 등록 모드
// "use client": useState, 파일 업로드 처리 때문에 브라우저 실행
// =====================================================

"use client";

import { useState, FormEvent } from "react";
import { Product, Category } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import ImageUploader from "./ImageUploader";  // 단일 이미지 업로더
import Image from "next/image";
import { getImageUrl } from "@/lib/utils";
import { adminUploadImage } from "@/lib/api";
import { X, Plus } from "lucide-react";

// ProductForm이 받을 props 타입
interface ProductFormProps {
  initial?: Partial<Product>;  // 수정 시 기존 데이터 (없으면 신규 등록)
  categories: Category[];      // 카테고리 선택 드롭다운용
  // 제출 성공 시 호출되는 함수 (상위 페이지에서 실제 API 호출)
  onSubmit: (data: Partial<Product> & { image_urls_raw?: string }) => Promise<void>;
  onCancel: () => void;  // 취소 시 호출되는 함수
}

export default function ProductForm({ initial, categories, onSubmit, onCancel }: ProductFormProps) {
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  // 썸네일 이미지 URL (기존 이미지 있으면 초기값으로 설정)
  const [imageUrl, setImageUrl] = useState(initial?.image_url || "");

  // 상세 이미지 URL 목록 (기존 이미지들 있으면 초기값으로 설정)
  const [detailImages, setDetailImages] = useState<string[]>(initial?.image_urls || []);

  // 베스트셀러 / 신제품 체크박스 상태
  const [isBestseller, setIsBestseller] = useState(initial?.is_bestseller ?? false);
  const [isNew, setIsNew] = useState(initial?.is_new ?? false);

  const [uploading, setUploading] = useState(false);  // 상세 이미지 업로드 중 여부

  // 상세 이미지 추가 (여러 장 한번에 업로드 가능)
  async function handleDetailImageAdd(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files) return;

    setUploading(true);
    try {
      const token = localStorage.getItem("admin_token") || "";
      const urls: string[] = [];

      // for...of: 파일 하나씩 순서대로 업로드
      for (const file of Array.from(files)) {
        const { url } = await adminUploadImage(token, file);
        urls.push(url);  // 업로드된 URL을 배열에 추가
      }
      // 기존 이미지 뒤에 새 이미지들 추가 (스프레드 연산자)
      setDetailImages((prev) => [...prev, ...urls]);
    } catch {
      alert("이미지 업로드 실패");
    } finally {
      setUploading(false);
    }
  }

  // 상세 이미지 제거
  function removeDetailImage(index: number) {
    // filter: 해당 인덱스를 제외한 나머지 이미지만 유지
    setDetailImages((prev) => prev.filter((_, i) => i !== index));
  }

  // 폼 제출 처리
  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const form = e.currentTarget;

    // input/select/textarea 값을 이름으로 가져오는 헬퍼 함수
    const get = (name: string) =>
      (form.elements.namedItem(name) as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement)?.value;

    // 제출할 데이터 객체 조합
    const data: Partial<Product> & { image_urls_raw?: string } = {
      category_id: Number(get("category_id")),  // 문자열 → 숫자 변환
      name: get("name"),
      name_ko: get("name_ko"),
      slug: get("slug"),
      description: get("description"),
      ingredients: get("ingredients"),
      volume: get("volume"),
      skin_type: get("skin_type"),
      how_to_use: get("how_to_use"),
      image_url: imageUrl,
      // 상세 이미지 배열을 JSON 문자열로 변환 (DB에 저장 형식)
      image_urls_raw: JSON.stringify(detailImages),
      is_bestseller: isBestseller,
      is_new: isNew,
      sort_order: Number(get("sort_order")) || 0,
    };

    try {
      await onSubmit(data);  // 상위 컴포넌트의 API 호출 함수 실행
    } catch (err) {
      setError(err instanceof Error ? err.message : "오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-2xl">

      {/* ── 카테고리 선택 드롭다운 ── */}
      <div>
        <label className="block text-sm font-medium mb-1">카테고리 *</label>
        <select
          name="category_id"
          required
          defaultValue={initial?.category_id}  // 수정 시 기존 카테고리 선택
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        >
          <option value="">카테고리 선택</option>
          {/* 카테고리 목록을 option으로 변환 */}
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name_ko}</option>
          ))}
        </select>
      </div>

      {/* ── 제품명 (영문/한글) ── */}
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

      {/* ── Slug + 용량 ── */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Slug *</label>
          {/* Slug: URL에 사용되는 영문 소문자 + 하이픈 형식 */}
          <Input name="slug" required defaultValue={initial?.slug} placeholder="glutathione-cream" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">용량</label>
          <Input name="volume" defaultValue={initial?.volume} placeholder="50ml" />
        </div>
      </div>

      {/* ── 피부 타입 ── */}
      <div>
        <label className="block text-sm font-medium mb-1">피부 타입</label>
        <Input name="skin_type" defaultValue={initial?.skin_type} placeholder="모든 피부 타입" />
      </div>

      {/* ── 제품 설명 (HTML 입력 가능) ── */}
      <div>
        <label className="block text-sm font-medium mb-1">제품 설명</label>
        <Textarea name="description" rows={4} defaultValue={initial?.description} placeholder="제품 설명 (HTML 가능)" />
      </div>

      {/* ── 성분 ── */}
      <div>
        <label className="block text-sm font-medium mb-1">성분</label>
        <Textarea name="ingredients" rows={3} defaultValue={initial?.ingredients} placeholder="주요 성분 목록" />
      </div>

      {/* ── 사용 방법 ── */}
      <div>
        <label className="block text-sm font-medium mb-1">사용 방법</label>
        <Textarea name="how_to_use" rows={3} defaultValue={initial?.how_to_use} placeholder="사용 방법 안내" />
      </div>

      {/* ── 썸네일 이미지 (목록/카드에 표시되는 대표 이미지) ── */}
      <ImageUploader value={imageUrl} onChange={setImageUrl} label="썸네일 이미지 (목록/카드용)" />

      {/* ── 상세페이지 이미지 (여러 장) ── */}
      <div className="space-y-3">
        <label className="block text-sm font-medium">
          상세페이지 이미지{" "}
          <span className="text-hestia-gray font-normal">(여러 장 업로드 가능 — 순서대로 세로 표시)</span>
        </label>

        {/* 업로드된 이미지 미리보기 그리드 */}
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
                {/* 각 이미지의 제거 버튼 */}
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

        {/* 이미지 추가 버튼 (클릭 시 파일 선택 dialog 열림) */}
        <label className="flex items-center gap-2 border-2 border-dashed border-gray-200 rounded-sm p-4 cursor-pointer hover:border-hestia-gold transition-colors">
          <Plus className="h-5 w-5 text-hestia-gray" />
          <span className="text-sm text-hestia-gray">
            {uploading ? "업로드 중..." : "이미지 추가 (여러 장 선택 가능)"}
          </span>
          {/* multiple: 여러 파일 동시 선택 가능 */}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            className="hidden"  // 보이지 않는 input (label의 cursor-pointer로 클릭)
            onChange={handleDetailImageAdd}
          />
        </label>
      </div>

      {/* ── 정렬 순서 ── */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">정렬 순서</label>
          <Input name="sort_order" type="number" defaultValue={initial?.sort_order ?? 0} />
        </div>
      </div>

      {/* ── 베스트셀러 / 신제품 체크박스 ── */}
      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input
            type="checkbox"
            checked={isBestseller}
            onChange={(e) => setIsBestseller(e.target.checked)}  // 체크 변경 시 상태 업데이트
          />
          베스트셀러
        </label>
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input
            type="checkbox"
            checked={isNew}
            onChange={(e) => setIsNew(e.target.checked)}
          />
          신제품 (NEW)
        </label>
      </div>

      {/* ── 오류 메시지 ── */}
      {error && <p className="text-sm text-red-500">{error}</p>}

      {/* ── 저장 / 취소 버튼 ── */}
      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={loading}>
          {loading ? "저장 중..." : "저장"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>취소</Button>
      </div>
    </form>
  );
}
