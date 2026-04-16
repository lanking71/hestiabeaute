import { getInquiries } from "@/lib/api";
import InquiryList from "@/components/inquiry/InquiryList";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "제품 문의" };

interface Props {
  searchParams: { page?: string };
}

export default async function InquiryPage({ searchParams }: Props) {
  const page = Number(searchParams.page) || 1;
  const result = await getInquiries(page).catch(() => ({
    items: [],
    total: 0,
    pages: 1,
    page: 1,
    size: 10,
  }));

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

      <InquiryList inquiries={result.items} />

      {result.pages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: result.pages }, (_, i) => i + 1).map((p) => (
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
