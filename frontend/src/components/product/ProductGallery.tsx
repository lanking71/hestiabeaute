"use client";

import Image from "next/image";
import { getImageUrl } from "@/lib/utils";

interface ProductGalleryProps {
  mainImage?: string;
  name: string;
}

export default function ProductGallery({ mainImage, name }: ProductGalleryProps) {
  if (!mainImage) {
    return (
      <div className="aspect-square bg-hestia-light rounded-sm flex items-center justify-center text-hestia-gray text-sm">
        이미지 없음
      </div>
    );
  }

  return (
    <div className="sticky top-20">
      <div className="relative aspect-square bg-hestia-light rounded-sm overflow-hidden">
        <Image
          src={getImageUrl(mainImage)}
          alt={name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />
      </div>
    </div>
  );
}
