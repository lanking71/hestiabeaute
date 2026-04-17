"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import ImageUploader from "@/components/admin/ImageUploader";
import { adminGetBanners, adminCreateBanner, adminUpdateBanner, adminDeleteBanner } from "@/lib/api";
import { Banner } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Pencil, Trash2, X, Check } from "lucide-react";
import Image from "next/image";
import { getImageUrl } from "@/lib/utils";

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editBanner, setEditBanner] = useState<Banner | null>(null);

  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [linkUrl, setLinkUrl] = useState("/products");
  const [imageUrl, setImageUrl] = useState("");
  const [sortOrder, setSortOrder] = useState(0);
  const [loading, setLoading] = useState(false);

  function getToken() {
    return localStorage.getItem("admin_token") || "";
  }

  async function loadBanners() {
    const data = await adminGetBanners(getToken()).catch(() => []);
    setBanners(data);
  }

  useEffect(() => { loadBanners(); }, []);

  function openCreate() {
    setEditBanner(null);
    setTitle(""); setSubtitle(""); setLinkUrl("/products"); setImageUrl(""); setSortOrder(banners.length);
    setShowForm(true);
  }

  function openEdit(b: Banner) {
    setEditBanner(b);
    setTitle(b.title); setSubtitle(b.subtitle || ""); setLinkUrl(b.link_url || "/products");
    setImageUrl(b.image_url || ""); setSortOrder(b.sort_order);
    setShowForm(true);
  }

  async function handleSave() {
    if (!title.trim()) { alert("제목을 입력하세요"); return; }
    setLoading(true);
    try {
      const data = { title, subtitle, link_url: linkUrl, image_url: imageUrl, sort_order: sortOrder, is_active: true };
      if (editBanner) {
        await adminUpdateBanner(getToken(), editBanner.id, data);
      } else {
        await adminCreateBanner(getToken(), data);
      }
      setShowForm(false);
      await loadBanners();
    } catch {
      alert("저장 실패");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("배너를 삭제하시겠습니까?")) return;
    await adminDeleteBanner(getToken(), id).catch(() => {});
    await loadBanners();
  }

  async function toggleActive(b: Banner) {
    await adminUpdateBanner(getToken(), b.id, { is_active: !b.is_active }).catch(() => {});
    await loadBanners();
  }

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-hestia-dark">히어로 배너 관리</h1>
        <Button onClick={openCreate} className="flex items-center gap-2">
          <Plus className="h-4 w-4" /> 배너 추가
        </Button>
      </div>

      {/* 폼 */}
      {showForm && (
        <div className="bg-white border border-gray-200 rounded-sm p-6 mb-6">
          <h2 className="font-medium mb-4">{editBanner ? "배너 수정" : "새 배너"}</h2>
          <div className="space-y-4 max-w-xl">
            <div>
              <label className="block text-sm font-medium mb-1">제목 *</label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="글루타치온의 힘" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">부제목</label>
              <Input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} placeholder="피부 깊은 곳부터 빛나는 투명함" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">링크 URL</label>
              <Input value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} placeholder="/products" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">정렬 순서</label>
              <Input type="number" value={sortOrder} onChange={(e) => setSortOrder(Number(e.target.value))} />
            </div>
            <ImageUploader value={imageUrl} onChange={setImageUrl} label="배너 이미지 (권장: 1920×640px)" />
          </div>
          <div className="flex gap-3 mt-4">
            <Button onClick={handleSave} disabled={loading}>
              {loading ? "저장 중..." : "저장"}
            </Button>
            <Button variant="outline" onClick={() => setShowForm(false)}>취소</Button>
          </div>
        </div>
      )}

      {/* 배너 목록 */}
      <div className="space-y-3">
        {banners.length === 0 && (
          <div className="bg-white border border-dashed border-gray-200 rounded-sm p-12 text-center text-hestia-gray text-sm">
            등록된 배너가 없습니다. 배너를 추가해주세요.
          </div>
        )}
        {banners.map((b) => (
          <div key={b.id} className="bg-white border border-gray-200 rounded-sm p-4 flex items-center gap-4">
            {/* 썸네일 */}
            <div className="relative w-32 h-20 flex-none bg-hestia-light rounded overflow-hidden">
              {b.image_url ? (
                <Image src={getImageUrl(b.image_url)} alt={b.title} fill className="object-cover" sizes="128px" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-hestia-gray text-xs">
                  이미지 없음
                </div>
              )}
            </div>

            {/* 정보 */}
            <div className="flex-1 min-w-0">
              <p className="font-medium text-hestia-dark truncate">{b.title}</p>
              {b.subtitle && <p className="text-sm text-hestia-gray truncate">{b.subtitle}</p>}
              <p className="text-xs text-hestia-gray mt-1">링크: {b.link_url} | 순서: {b.sort_order}</p>
            </div>

            {/* 액션 */}
            <div className="flex items-center gap-2 flex-none">
              <button
                onClick={() => toggleActive(b)}
                className={`flex items-center gap-1 text-xs px-2 py-1 rounded ${b.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}
              >
                {b.is_active ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                {b.is_active ? "활성" : "비활성"}
              </button>
              <button onClick={() => openEdit(b)} className="p-1.5 hover:text-hestia-gold transition-colors">
                <Pencil className="h-4 w-4" />
              </button>
              <button onClick={() => handleDelete(b.id)} className="p-1.5 hover:text-red-500 transition-colors">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
