import InquiryForm from "@/components/inquiry/InquiryForm";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "문의 작성" };

interface Props {
  searchParams: { product?: string };
}

export default function InquiryWritePage({ searchParams }: Props) {
  const productId = searchParams.product ? Number(searchParams.product) : undefined;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <nav className="text-xs text-hestia-gray mb-6 flex items-center gap-2">
        <Link href="/" className="hover:text-hestia-gold">홈</Link>
        <span>/</span>
        <Link href="/inquiry" className="hover:text-hestia-gold">제품 문의</Link>
        <span>/</span>
        <span className="text-hestia-dark">문의 작성</span>
      </nav>

      <div className="mb-8">
        <h1 className="font-playfair text-3xl font-bold text-hestia-dark mb-2">문의 작성</h1>
        <div className="w-12 h-0.5 bg-hestia-gold" />
      </div>

      <InquiryForm productId={productId} />
    </div>
  );
}
