"use client";

import { useState } from "react";
import Image from "next/image";
import { getImageUrl } from "@/lib/utils";

interface ProductGalleryProps {
  mainImage?: string;
  images?: string[];
  name: string;
}

export default function ProductGallery({ mainImage, images = [], name }: ProductGalleryProps) {
  const allImages = [mainImage, ...images].filter(Boolean) as string[];
  const [selected, setSelected] = useState(0);

  if (!allImages.length) {
    return (
      <div className="aspect-square bg-hestia-light rounded-sm flex items-center justify-center text-hestia-gray">
        이미지 없음
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* 메인 이미지 */}
      <div className="relative aspect-square bg-hestia-light rounded-sm overflow-hidden">
        <Image
          src={getImageUrl(allImages[selected])}
          alt={name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />
      </div>

      {/* 썸네일 */}
      {allImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {allImages.map((img, i) => (
            <button
              key={i}
              onClick={() => setSelected(i)}
              className={`relative w-16 h-16 flex-none rounded overflow-hidden border-2 transition-all ${
                i === selected ? "border-hestia-gold" : "border-transparent"
              }`}
            >
              <Image
                src={getImageUrl(img)}
                alt={`${name} ${i + 1}`}
                fill
                className="object-cover"
                sizes="64px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
