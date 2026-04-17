// =====================================================
// 📁 utils.ts — 여러 곳에서 쓰이는 유틸리티 함수 모음
// =====================================================
// 이 파일은 프로그램 이곳저곳에서 자주 필요한
// 작은 도우미 함수들을 모아두는 파일이에요.
//
// 마치 학교에서 쓰는 도구 상자처럼,
// 자주 필요한 도구들을 한 곳에 모아두면
// 필요할 때마다 꺼내 쓸 수 있어요!
// =====================================================

// clsx: 조건에 따라 CSS 클래스명을 동적으로 조합해주는 도구
import { type ClassValue, clsx } from "clsx";
// twMerge: Tailwind CSS 클래스들이 충돌할 때 올바르게 병합해주는 도구
import { twMerge } from "tailwind-merge";


// ─────────────────────────────────────────
// 🎨 CSS 클래스 합치기
// ─────────────────────────────────────────

/**
 * cn (className) — Tailwind CSS 클래스를 안전하게 합치는 함수
 *
 * 사용 예:
 *   cn("text-red-500", isActive && "font-bold", "p-4")
 *   → isActive가 true면: "text-red-500 font-bold p-4"
 *   → isActive가 false면: "text-red-500 p-4"
 *
 * 왜 필요하냐면? Tailwind 클래스는 같은 속성(예: color)이
 * 여러 개 있을 때 마지막 것만 적용되지 않고 예상치 못한
 * 동작을 할 수 있어요. twMerge가 이걸 올바르게 해결해줘요.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}


// ─────────────────────────────────────────
// 📅 날짜 형식 변환
// ─────────────────────────────────────────

/**
 * formatDate — 날짜 문자열을 한국 형식으로 변환
 *
 * 입력: "2024-01-15T09:30:00Z" (백엔드에서 오는 형식)
 * 출력: "2024. 01. 15." (화면에 보여줄 형식)
 */
export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);  // 문자열을 Date 객체로 변환
  return date.toLocaleDateString("ko-KR", {
    year: "numeric",   // 연도 4자리
    month: "2-digit",  // 월 2자리 (01, 02...)
    day: "2-digit",    // 일 2자리 (01, 02...)
  });
}


// ─────────────────────────────────────────
// 🔗 슬러그(slug) 만들기
// ─────────────────────────────────────────

/**
 * slugify — 텍스트를 URL에 사용할 수 있는 슬러그로 변환
 *
 * 입력: "Glutathione Cream 200ml!"
 * 출력: "glutathione-cream-200ml"
 *
 * 변환 과정:
 * 1. 소문자로 변환 (Glutathione → glutathione)
 * 2. 공백을 하이픈으로 변환 (Cream → cream, Cream → -cream-)
 * 3. 영문/숫자/하이픈 외 문자 제거 (! 제거)
 * 4. 하이픈이 여러 개 연속되면 하나로 줄이기 (-- → -)
 * 5. 앞뒤 공백 제거
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, "-")         // 공백(하나 이상) → 하이픈
    .replace(/[^\w-]+/g, "")     // 영문자, 숫자, 하이픈이 아닌 것 제거
    .replace(/--+/g, "-")        // 하이픈 2개 이상 → 하이픈 1개
    .trim();                      // 앞뒤 공백 제거
}


// ─────────────────────────────────────────
// 🖼️ 이미지 URL 만들기
// ─────────────────────────────────────────

/**
 * getImageUrl — 이미지 경로를 완전한 URL로 변환
 *
 * 이미지 경로가 3가지 경우가 있어요:
 *   1. 없음 (undefined) → 기본 이미지(placeholder.jpg) 사용
 *   2. "http..."로 시작 → 이미 완전한 URL이므로 그대로 사용
 *   3. "/static/uploads/..." → 백엔드 주소를 앞에 붙여서 완성
 *
 * 예)
 *   getImageUrl(undefined) → "/images/placeholder.jpg"
 *   getImageUrl("https://example.com/img.jpg") → "https://example.com/img.jpg"
 *   getImageUrl("/static/uploads/products/abc.jpg")
 *     → "http://localhost:8000/static/uploads/products/abc.jpg"
 */
export function getImageUrl(path?: string): string {
  if (!path) return "/images/placeholder.jpg";  // 이미지 없으면 기본 이미지
  if (path.startsWith("http")) return path;      // 이미 완전한 URL
  // 백엔드 주소를 앞에 붙이기 (API URL에서 "/api" 부분 제거)
  return `${process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "http://localhost:8000"}${path}`;
}


// ─────────────────────────────────────────
// ✂️ 텍스트 자르기
// ─────────────────────────────────────────

/**
 * truncate — 긴 텍스트를 지정된 길이로 잘라서 "..." 붙이기
 *
 * 입력: truncate("안녕하세요 저는 프로그래밍을 배우고 있어요", 10)
 * 출력: "안녕하세요 저는 프로..."
 *
 * length 이하면 그대로 반환, 초과하면 잘라서 "..." 추가
 */
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;  // 짧으면 그대로
  return text.slice(0, length) + "...";   // 길면 잘라서 "..." 붙이기
}
