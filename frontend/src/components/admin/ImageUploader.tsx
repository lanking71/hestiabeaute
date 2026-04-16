"use client";

import { useState, useRef, DragEvent, ChangeEvent } from "react";
import Image from "next/image";
import { adminUploadImage } from "@/lib/api";
import { Upload, X } from "lucide-react";
import { getImageUrl } from "@/lib/utils";

interface ImageUploaderProps {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
}

export default function ImageUploader({ value, onChange, label = "이미지 업로드" }: ImageUploaderProps) {
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function upload(file: File) {
    if (!file.type.startsWith("image/")) {
      alert("이미지 파일만 업로드 가능합니다.");
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem("admin_token") || "";
      const { url } = await adminUploadImage(token, file);
      onChange(url);
    } catch {
      alert("이미지 업로드 실패");
    } finally {
      setLoading(false);
    }
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) upload(file);
  }

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) upload(file);
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium">{label}</label>

      {value ? (
        <div className="relative w-40 h-40">
          <Image
            src={getImageUrl(value)}
            alt="업로드된 이미지"
            fill
            className="object-cover rounded border border-gray-200"
          />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onClick={() => inputRef.current?.click()}
          className={`border-2 border-dashed rounded-sm p-8 text-center cursor-pointer transition-colors ${
            dragOver ? "border-hestia-gold bg-hestia-cream" : "border-gray-200 hover:border-hestia-gold"
          }`}
        >
          <Upload className="h-8 w-8 text-hestia-gray mx-auto mb-2" />
          <p className="text-sm text-hestia-gray">
            {loading ? "업로드 중..." : "클릭하거나 파일을 드래그"}
          </p>
          <p className="text-xs text-hestia-gray mt-1">JPG, PNG, WebP (최대 5MB)</p>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleChange}
      />
    </div>
  );
}
