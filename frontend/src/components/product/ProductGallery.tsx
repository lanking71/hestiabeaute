// =====================================================
// 📁 ProductGallery.tsx — 제품 상세 이미지 갤러리
// =====================================================
// 제품 상세 페이지에서 제품 대표 이미지를 크게 보여주는
// 컴포넌트예요.
//
// 현재는 대표 이미지 1장만 표시하는 단순한 버전이에요.
// (여러 이미지 슬라이더로 확장 가능)
//
// "sticky top-20": 스크롤해도 이미지가 화면에 고정되어
// 항상 보이도록 해요 (제품 설명과 함께 보기 편하게)
// =====================================================

"use client";

import Image from "next/image";
import { getImageUrl } from "@/lib/utils";

// ProductGallery가 받을 props 타입
interface ProductGalleryProps {
  mainImage?: string;  // 표시할 이미지 경로 (없으면 "이미지 없음" 표시)
  name: string;        // 제품명 (이미지 alt 텍스트용)
}

export default function ProductGallery({ mainImage, name }: ProductGalleryProps) {
  // 이미지가 없으면 회색 박스에 안내 텍스트 표시
  if (!mainImage) {
    return (
      <div className="aspect-square bg-hestia-light rounded-sm flex items-center justify-center text-hestia-gray text-sm">
        이미지 없음
      </div>
    );
  }

  return (
    // sticky top-20: 페이지를 스크롤해도 이 이미지는 상단 20(80px) 아래에 고정
    // → 긴 제품 설명을 읽으면서도 이미지를 계속 볼 수 있어요
    <div className="sticky top-20">
      {/* 정사각형 비율 이미지 컨테이너 */}
      <div className="relative aspect-square bg-hestia-light rounded-sm overflow-hidden">
        <Image
          src={getImageUrl(mainImage)}  // 백엔드 URL 변환
          alt={name}                   // 스크린리더와 SEO용 대체 텍스트
          fill                         // 컨테이너 꽉 채우기
          className="object-cover"     // 비율 유지하며 꽉 채우기
          // 반응형 힌트: 모바일 전체 너비, PC 절반 너비
          sizes="(max-width: 768px) 100vw, 50vw"
          priority                     // 제품 상세의 메인 이미지이므로 우선 로딩
        />
      </div>
    </div>
  );
}
