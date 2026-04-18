// =====================================================
// 📁 api.ts — 백엔드 API 호출 함수 모음
// =====================================================
// 이 파일은 Next.js 프론트엔드에서 FastAPI 백엔드로
// 데이터를 요청하거나 보내는 함수들을 모아놓은 파일이에요.
//
// 예를 들어, 제품 목록을 보고 싶으면 getProducts()를 호출하면
// 자동으로 백엔드에 요청을 보내고 결과를 가져와줘요.
//
// 규칙: 컴포넌트 파일에서 직접 fetch를 쓰지 말고
// 반드시 이 파일의 함수를 통해서만 API를 호출해요!
// =====================================================

import { Category, Product, Inquiry, InquiryCreate, PaginatedResponse, AdminToken, Banner } from "./types";

// 🌐 API 서버 주소 설정
// - 서버사이드(SSR)에서는 내부 네트워크 주소 사용
// - 브라우저에서는 공개 주소(NEXT_PUBLIC_API_URL) 사용
const API_URL =
  typeof window === "undefined"
    ? process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"
    : process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";


// ─────────────────────────────────────────
// 🔧 내부 유틸 함수 (이 파일에서만 사용)
// ─────────────────────────────────────────

// apiFetch: 모든 API 요청에서 공통으로 사용하는 fetch 래퍼 함수
// - 자동으로 Content-Type: application/json 헤더 추가
// - 오류 응답이면 자동으로 예외(Error) 발생
// - 성공하면 JSON 데이터를 파싱해서 반환
async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",  // JSON 형식으로 보내고 받겠다는 선언
      ...options?.headers,                 // 추가 헤더가 있으면 덮어쓰기
    },
  });
  if (!res.ok) {
    // HTTP 상태 코드가 200~299가 아니면 오류 처리
    const error = await res.json().catch(() => ({ detail: "오류가 발생했습니다" }));
    throw new Error(error.detail || `HTTP ${res.status}`);
  }
  return res.json();  // 응답 본문을 JSON으로 파싱하여 반환
}

// authHeaders: 관리자 API 호출 시 Authorization 헤더 생성
// token을 "Bearer 토큰문자열" 형식으로 만들어줘요
function authHeaders(token: string) {
  return { Authorization: `Bearer ${token}` };
}


// ─────────────────────────────────────────
// 🌍 공개 API 함수 (로그인 없이 사용 가능)
// ─────────────────────────────────────────

// 카테고리 전체 목록 가져오기
// cache: "no-store" → 항상 최신 데이터를 서버에서 새로 가져오기
export async function getCategories(): Promise<Category[]> {
  return apiFetch<Category[]>("/categories", { cache: "no-store" });
}

// 배너 전체 목록 가져오기 (홈 화면 슬라이더용)
export async function getBanners(): Promise<Banner[]> {
  return apiFetch<Banner[]>("/banners", { cache: "no-store" });
}

// 제품 목록 가져오기 (여러 조건으로 필터링 가능)
// params.category: 특정 카테고리만 (예: "cream")
// params.bestseller: true면 베스트셀러만
// params.is_new: true면 신제품만
// params.page, params.size: 페이징 처리
export async function getProducts(params?: {
  category?: string;
  bestseller?: boolean;
  is_new?: boolean;
  page?: number;
  size?: number;
}): Promise<PaginatedResponse<Product>> {
  // URLSearchParams: 쿼리 스트링(?category=cream&bestseller=true)을 만들어주는 도구
  const query = new URLSearchParams();
  if (params?.category) query.set("category", params.category);
  if (params?.bestseller) query.set("bestseller", "true");
  if (params?.is_new) query.set("is_new", "true");
  if (params?.page) query.set("page", String(params.page));
  if (params?.size) query.set("size", String(params.size));
  return apiFetch<PaginatedResponse<Product>>(`/products?${query}`);
}

// 제품 상세 정보 가져오기 (slug로 조회)
// 예) getProduct("glutathione-cream") → 글루타치온 크림 상세 정보
export async function getProduct(slug: string): Promise<Product> {
  return apiFetch<Product>(`/products/${slug}`);
}

// 문의 목록 가져오기 (페이징 포함)
// page: 몇 번째 페이지, size: 한 페이지에 몇 개
export async function getInquiries(page = 1, size = 10): Promise<PaginatedResponse<Inquiry>> {
  return apiFetch<PaginatedResponse<Inquiry>>(`/inquiry?page=${page}&size=${size}`, { cache: "no-store" });
}

// 문의 상세 가져오기
// password: 비밀글인 경우 비밀번호 필요
export async function getInquiry(id: number, password?: string): Promise<Inquiry> {
  const query = password ? `?password=${encodeURIComponent(password)}` : "";
  return apiFetch<Inquiry>(`/inquiry/${id}${query}`);
}

// 문의 상세 — HTTP 상태 코드 포함 반환 (비밀글 처리용)
export async function getInquiryRaw(
  id: number,
  password?: string
): Promise<{ status: number; data?: Inquiry; error?: string }> {
  const query = password ? `?password=${encodeURIComponent(password)}` : "";
  const res = await fetch(`${API_URL}/inquiry/${id}${query}`, {
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });
  if (res.ok) return { status: res.status, data: await res.json() };
  const err = await res.json().catch(() => ({ detail: "오류가 발생했습니다" }));
  return { status: res.status, error: err.detail };
}

// 문의 삭제 — 작성 시 입력한 비밀번호로 본인 확인
export async function deleteInquiryByPassword(
  id: number,
  password: string
): Promise<{ ok: boolean; error?: string }> {
  const res = await fetch(`${API_URL}/inquiry/${id}?password=${encodeURIComponent(password)}`, {
    method: "DELETE",
  });
  if (res.ok || res.status === 204) return { ok: true };
  const err = await res.json().catch(() => ({ detail: "오류가 발생했습니다" }));
  return { ok: false, error: err.detail };
}

// 새 문의 작성하기
export async function createInquiry(data: InquiryCreate): Promise<Inquiry> {
  return apiFetch<Inquiry>("/inquiry", {
    method: "POST",           // GET 아닌 POST 방식으로 데이터 보내기
    body: JSON.stringify(data),  // 자바스크립트 객체를 JSON 문자열로 변환
  });
}


// ─────────────────────────────────────────
// 🔒 관리자 API 함수 (JWT 토큰 필요)
// ─────────────────────────────────────────

// 관리자 로그인 — 성공하면 토큰 반환
export async function adminLogin(username: string, password: string): Promise<AdminToken> {
  const res = await fetch(`${API_URL}/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) throw new Error("로그인 실패");
  return res.json();  // { access_token: "...", token_type: "bearer" }
}

// 관리자: 카테고리 전체 목록 가져오기
export async function adminGetCategories(token: string): Promise<Category[]> {
  return apiFetch<Category[]>("/admin/categories", { headers: authHeaders(token) });
}

// 관리자: 새 카테고리 만들기
export async function adminCreateCategory(token: string, data: Partial<Category>): Promise<Category> {
  return apiFetch<Category>("/admin/categories", {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
}

// 관리자: 카테고리 수정하기 (id로 지정)
export async function adminUpdateCategory(token: string, id: number, data: Partial<Category>): Promise<Category> {
  return apiFetch<Category>(`/admin/categories/${id}`, {
    method: "PUT",
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
}

// 관리자: 카테고리 삭제하기
export async function adminDeleteCategory(token: string, id: number): Promise<void> {
  await apiFetch(`/admin/categories/${id}`, {
    method: "DELETE",
    headers: authHeaders(token),
  });
}

// 관리자: 제품 목록 가져오기 (필터/페이징 가능)
export async function adminGetProducts(token: string, params?: {
  category_id?: number;
  page?: number;
  size?: number;
}): Promise<PaginatedResponse<Product>> {
  const query = new URLSearchParams();
  if (params?.category_id) query.set("category_id", String(params.category_id));
  if (params?.page) query.set("page", String(params.page));
  if (params?.size) query.set("size", String(params.size));
  return apiFetch<PaginatedResponse<Product>>(`/admin/products?${query}`, {
    headers: authHeaders(token),
  });
}

// 관리자: 제품 단건 조회 (수정 폼용)
export async function adminGetProduct(token: string, id: number): Promise<Product> {
  return apiFetch<Product>(`/admin/products/${id}`, { headers: authHeaders(token) });
}

// 관리자: 새 제품 등록하기
export async function adminCreateProduct(token: string, data: Partial<Product>): Promise<Product> {
  return apiFetch<Product>("/admin/products", {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
}

// 관리자: 제품 수정하기
export async function adminUpdateProduct(token: string, id: number, data: Partial<Product>): Promise<Product> {
  return apiFetch<Product>(`/admin/products/${id}`, {
    method: "PUT",
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
}

// 관리자: 제품 삭제하기
export async function adminDeleteProduct(token: string, id: number): Promise<void> {
  await apiFetch(`/admin/products/${id}`, {
    method: "DELETE",
    headers: authHeaders(token),
  });
}

// 관리자: 이미지 파일 업로드하기
// FormData: 파일을 HTTP로 전송할 때 사용하는 특별한 형식
// JSON이 아닌 multipart/form-data 방식으로 전송
export async function adminUploadImage(token: string, file: File): Promise<{ url: string }> {
  const form = new FormData();
  form.append("file", file);  // "file"이라는 키로 파일 첨부
  const res = await fetch(`${API_URL}/admin/upload`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },  // Content-Type은 브라우저가 자동 설정
    body: form,
  });
  if (!res.ok) throw new Error("이미지 업로드 실패");
  return res.json();  // { url: "/static/uploads/products/uuid.jpg" }
}

// 관리자: 문의 목록 가져오기
export async function adminGetInquiries(token: string, page = 1): Promise<PaginatedResponse<Inquiry>> {
  return apiFetch<PaginatedResponse<Inquiry>>(`/admin/inquiry?page=${page}`, {
    headers: authHeaders(token),
  });
}

// 관리자: 문의에 답변 달기 (PATCH: 일부만 수정)
export async function adminAnswerInquiry(token: string, id: number, answer: string): Promise<Inquiry> {
  return apiFetch<Inquiry>(`/admin/inquiry/${id}/answer`, {
    method: "PATCH",
    headers: authHeaders(token),
    body: JSON.stringify({ answer }),
  });
}

// 관리자: 문의 삭제하기
export async function adminDeleteInquiry(token: string, id: number): Promise<void> {
  await apiFetch(`/admin/inquiry/${id}`, {
    method: "DELETE",
    headers: authHeaders(token),
  });
}


// ─────────────────────────────────────────
// 🖼️ 배너 관리 API
// ─────────────────────────────────────────

// 관리자: 배너 전체 목록 가져오기
export async function adminGetBanners(token: string): Promise<Banner[]> {
  return apiFetch<Banner[]>("/admin/banners", { headers: authHeaders(token) });
}

// 관리자: 새 배너 만들기
export async function adminCreateBanner(token: string, data: Partial<Banner>): Promise<Banner> {
  return apiFetch<Banner>("/admin/banners", {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
}

// 관리자: 배너 수정하기
export async function adminUpdateBanner(token: string, id: number, data: Partial<Banner>): Promise<Banner> {
  return apiFetch<Banner>(`/admin/banners/${id}`, {
    method: "PUT",
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
}

// 관리자: 배너 삭제하기
export async function adminDeleteBanner(token: string, id: number): Promise<void> {
  await apiFetch(`/admin/banners/${id}`, {
    method: "DELETE",
    headers: authHeaders(token),
  });
}
