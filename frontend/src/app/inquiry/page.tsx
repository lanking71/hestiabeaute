import { Suspense } from "react";
import InquiryPageClient from "@/components/inquiry/InquiryPageClient";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "제품 문의" };

export default function InquiryPage() {
  return (
    <Suspense fallback={
      <div className="max-w-5xl mx-auto px-4 py-24 text-center text-hestia-gray text-sm">
        불러오는 중...
      </div>
    }>
      <InquiryPageClient />
    </Suspense>
  );
}
