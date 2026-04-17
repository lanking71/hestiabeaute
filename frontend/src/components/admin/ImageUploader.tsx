// =====================================================
// 📁 ImageUploader.tsx — 이미지 업로드 컴포넌트
// =====================================================
// 관리자 페이지에서 이미지를 업로드하는 컴포넌트예요.
//
// 기능:
//   - 클릭해서 파일 선택
//   - 드래그 앤 드롭으로 파일 올리기
//   - 이미지 미리보기 표시
//   - X 버튼으로 이미지 제거
//
// 업로드 과정:
//   1. 사용자가 파일 선택
//   2. 백엔드 /api/admin/upload로 파일 전송
//   3. 백엔드가 이미지를 저장하고 URL 반환
//   4. 반환된 URL을 상위 컴포넌트(ProductForm 등)에 전달
//
// "use client": 파일 선택, 드래그 이벤트 처리 때문에 브라우저 실행
// =====================================================

"use client";

import { useState, useRef, DragEvent, ChangeEvent } from "react";
import Image from "next/image";
import { adminUploadImage } from "@/lib/api";
import { Upload, X } from "lucide-react";
import { getImageUrl } from "@/lib/utils";

// ImageUploader가 받을 props 타입
interface ImageUploaderProps {
  value?: string;             // 현재 저장된 이미지 URL (없으면 빈 상태)
  onChange: (url: string) => void;  // 이미지가 바뀌면 호출되는 함수
  label?: string;             // 업로더 제목 (기본값: "이미지 업로드")
}

export default function ImageUploader({ value, onChange, label = "이미지 업로드" }: ImageUploaderProps) {
  const [loading, setLoading] = useState(false);    // 업로드 중 여부
  const [dragOver, setDragOver] = useState(false);  // 드래그 중 여부 (스타일 변경용)
  // useRef: 숨겨진 input[type=file] 요소를 직접 제어하기 위한 참조
  const inputRef = useRef<HTMLInputElement>(null);

  // upload: 실제 파일 업로드 처리
  async function upload(file: File) {
    // 이미지 파일인지 확인 (MIME 타입 체크)
    // file.type 예시: "image/jpeg", "image/png", "video/mp4"
    if (!file.type.startsWith("image/")) {
      alert("이미지 파일만 업로드 가능합니다.");
      return;
    }

    setLoading(true);
    try {
      // localStorage에서 관리자 토큰 가져오기
      const token = localStorage.getItem("admin_token") || "";
      // 백엔드에 파일 전송, 성공 시 이미지 URL 반환
      const { url } = await adminUploadImage(token, file);
      // 부모 컴포넌트에 새 URL 전달
      onChange(url);
    } catch {
      alert("이미지 업로드 실패");
    } finally {
      setLoading(false);
    }
  }

  // 드래그 앤 드롭 처리
  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();  // 기본 동작(파일 열기) 방지
    setDragOver(false);
    // 드롭된 파일들 중 첫 번째 파일만 사용
    const file = e.dataTransfer.files[0];
    if (file) upload(file);
  }

  // 파일 선택 dialog에서 파일 선택 시 처리
  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    // e.target.files: FileList 객체 (선택된 파일들의 배열 같은 것)
    // ?.는 옵셔널 체이닝 (files가 null이면 undefined 반환)
    const file = e.target.files?.[0];
    if (file) upload(file);
  }

  return (
    <div className="space-y-2">
      {/* 제목 */}
      <label className="block text-sm font-medium">{label}</label>

      {/* 이미지가 있으면 미리보기, 없으면 업로드 영역 */}
      {value ? (
        // ── 이미지 미리보기 ──
        <div className="relative w-40 h-40">
          <Image
            src={getImageUrl(value)}
            alt="업로드된 이미지"
            fill
            className="object-cover rounded border border-gray-200"
          />
          {/* X 버튼: 이미지 제거 */}
          <button
            type="button"
            onClick={() => onChange("")}  // 빈 문자열로 이미지 삭제
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      ) : (
        // ── 파일 드롭 영역 ──
        <div
          onDrop={handleDrop}  // 파일을 끌어다 놓으면 실행
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}   // 드래그 중 (진입)
          onDragLeave={() => setDragOver(false)}  // 드래그 중 (이탈)
          onClick={() => inputRef.current?.click()}  // 클릭 시 숨겨진 파일 입력 트리거
          className={`border-2 border-dashed rounded-sm p-8 text-center cursor-pointer transition-colors ${
            // 드래그 중이면 골드 테두리, 아니면 회색 테두리
            dragOver ? "border-hestia-gold bg-hestia-cream" : "border-gray-200 hover:border-hestia-gold"
          }`}
        >
          {/* 업로드 아이콘 */}
          <Upload className="h-8 w-8 text-hestia-gray mx-auto mb-2" />
          {/* 안내 텍스트 (업로드 중이면 "업로드 중..." 표시) */}
          <p className="text-sm text-hestia-gray">
            {loading ? "업로드 중..." : "클릭하거나 파일을 드래그"}
          </p>
          <p className="text-xs text-hestia-gray mt-1">JPG, PNG, WebP (최대 5MB)</p>
        </div>
      )}

      {/* 숨겨진 파일 input: 실제 파일 선택 dialog를 열어주는 요소 */}
      {/* ref={inputRef}: inputRef.current.click()으로 프로그래밍적으로 클릭 가능 */}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"  // jpg, png, webp만 허용
        className="hidden"  // 화면에는 보이지 않음
        onChange={handleChange}
      />
    </div>
  );
}
