export interface Category {
  id: number;
  name_ko: string;
  name_en: string;
  slug: string;
  icon_url?: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export interface Product {
  id: number;
  category_id: number;
  category?: Category;
  name: string;
  name_ko?: string;
  slug: string;
  description?: string;
  ingredients?: string;
  volume?: string;
  skin_type?: string;
  how_to_use?: string;
  image_url?: string;
  image_urls?: string[];   // 상세페이지 이미지 목록
  is_bestseller: boolean;
  is_new: boolean;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Banner {
  id: number;
  title: string;
  subtitle?: string;
  image_url?: string;
  link_url?: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export interface Inquiry {
  id: number;
  product_id?: number;
  product?: Product;
  author_name: string;
  author_email: string;
  title: string;
  content: string;
  is_secret: boolean;
  answer?: string;
  answered_at?: string;
  is_answered: boolean;
  created_at: string;
}

export interface InquiryCreate {
  product_id?: number;
  author_name: string;
  author_email: string;
  title: string;
  content: string;
  password: string;
  is_secret?: boolean;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

export interface AdminToken {
  access_token: string;
  token_type: string;
}
