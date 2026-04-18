"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import InquiryList from "@/components/inquiry/InquiryList";
import type { Inquiry, PaginatedResponse } from "@/lib/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

async function fetchInquiries(page: number, size = 10): Promise<PaginatedResponse<Inquiry>> {
  const res = await fetch(`${API_URL}/inquiry?page=${page}&size=${size}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("문의 목록을 불러오지 못했습니다");
  return res.json();
}

export default function InquiryPageClient() {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;

  const [result, setResult] = useState<PaginatedResponse<Inquiry> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchInquiries(page)
      .then(setResult)
      .catch(() => setResult({ items: [], total: 0, page, size: 10, pages: 0 }))
      .finally(() => setLoading(false));
  }, [page]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-playfair text-3xl font-bold text-hestia-dark mb-2">제품 문의</h1>
            <div className="w-12 h-0.5 bg-hestia-gold" />
          </div>
        </div>
        <div className="py-20 text-center text-hestia-gray text-sm">불러오는 중...</div>
      </div>
    );
  }

  const items = result?.items ?? [];
  const total = result?.total ?? 0;
  const pages = result?.pages ?? 0;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-playfair text-3xl font-bold text-hestia-dark mb-2">제품 문의</h1>
          <div className="w-12 h-0.5 bg-hestia-gold" />
        </div>
        <Link
          href="/inquiry/write"
          className="inline-block bg-hestia-gold text-white px-6 py-2 text-sm hover:bg-hestia-gold/90 transition-colors"
        >
          문의 작성
        </Link>
      </div>

      <InquiryList inquiries={items} total={total} page={page} size={10} />

      {pages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={`/inquiry?page=${p}`}
              className={`w-10 h-10 flex items-center justify-center text-sm border transition-colors ${
                p === page
                  ? "border-hestia-gold bg-hestia-gold text-white"
                  : "border-hestia-light hover:border-hestia-gold hover:text-hestia-gold"
              }`}
            >
              {p}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
