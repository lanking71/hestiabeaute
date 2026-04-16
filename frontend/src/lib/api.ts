import { Category, Product, Inquiry, InquiryCreate, PaginatedResponse, AdminToken } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: "오류가 발생했습니다" }));
    throw new Error(error.detail || `HTTP ${res.status}`);
  }
  return res.json();
}

function authHeaders(token: string) {
  return { Authorization: `Bearer ${token}` };
}

// ─── 공개 API ────────────────────────────────────────────────────────────────

export async function getCategories(): Promise<Category[]> {
  return apiFetch<Category[]>("/categories");
}

export async function getProducts(params?: {
  category?: string;
  bestseller?: boolean;
  is_new?: boolean;
  page?: number;
  size?: number;
}): Promise<PaginatedResponse<Product>> {
  const query = new URLSearchParams();
  if (params?.category) query.set("category", params.category);
  if (params?.bestseller) query.set("bestseller", "true");
  if (params?.is_new) query.set("is_new", "true");
  if (params?.page) query.set("page", String(params.page));
  if (params?.size) query.set("size", String(params.size));
  return apiFetch<PaginatedResponse<Product>>(`/products?${query}`);
}

export async function getProduct(slug: string): Promise<Product> {
  return apiFetch<Product>(`/products/${slug}`);
}

export async function getInquiries(page = 1, size = 10): Promise<PaginatedResponse<Inquiry>> {
  return apiFetch<PaginatedResponse<Inquiry>>(`/inquiry?page=${page}&size=${size}`);
}

export async function getInquiry(id: number, password?: string): Promise<Inquiry> {
  const query = password ? `?password=${encodeURIComponent(password)}` : "";
  return apiFetch<Inquiry>(`/inquiry/${id}${query}`);
}

export async function createInquiry(data: InquiryCreate): Promise<Inquiry> {
  return apiFetch<Inquiry>("/inquiry", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// ─── 관리자 API ───────────────────────────────────────────────────────────────

export async function adminLogin(username: string, password: string): Promise<AdminToken> {
  const form = new URLSearchParams({ username, password });
  const res = await fetch(`${API_URL}/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: form,
  });
  if (!res.ok) throw new Error("로그인 실패");
  return res.json();
}

export async function adminGetCategories(token: string): Promise<Category[]> {
  return apiFetch<Category[]>("/admin/categories", { headers: authHeaders(token) });
}

export async function adminCreateCategory(token: string, data: Partial<Category>): Promise<Category> {
  return apiFetch<Category>("/admin/categories", {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
}

export async function adminUpdateCategory(token: string, id: number, data: Partial<Category>): Promise<Category> {
  return apiFetch<Category>(`/admin/categories/${id}`, {
    method: "PUT",
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
}

export async function adminDeleteCategory(token: string, id: number): Promise<void> {
  await apiFetch(`/admin/categories/${id}`, {
    method: "DELETE",
    headers: authHeaders(token),
  });
}

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

export async function adminCreateProduct(token: string, data: Partial<Product>): Promise<Product> {
  return apiFetch<Product>("/admin/products", {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
}

export async function adminUpdateProduct(token: string, id: number, data: Partial<Product>): Promise<Product> {
  return apiFetch<Product>(`/admin/products/${id}`, {
    method: "PUT",
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
}

export async function adminDeleteProduct(token: string, id: number): Promise<void> {
  await apiFetch(`/admin/products/${id}`, {
    method: "DELETE",
    headers: authHeaders(token),
  });
}

export async function adminUploadImage(token: string, file: File): Promise<{ url: string }> {
  const form = new FormData();
  form.append("file", file);
  const res = await fetch(`${API_URL}/admin/upload`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  });
  if (!res.ok) throw new Error("이미지 업로드 실패");
  return res.json();
}

export async function adminGetInquiries(token: string, page = 1): Promise<PaginatedResponse<Inquiry>> {
  return apiFetch<PaginatedResponse<Inquiry>>(`/admin/inquiry?page=${page}`, {
    headers: authHeaders(token),
  });
}

export async function adminAnswerInquiry(token: string, id: number, answer: string): Promise<Inquiry> {
  return apiFetch<Inquiry>(`/admin/inquiry/${id}/answer`, {
    method: "PATCH",
    headers: authHeaders(token),
    body: JSON.stringify({ answer }),
  });
}

export async function adminDeleteInquiry(token: string, id: number): Promise<void> {
  await apiFetch(`/admin/inquiry/${id}`, {
    method: "DELETE",
    headers: authHeaders(token),
  });
}
