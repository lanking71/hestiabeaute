import { getInquiry } from "@/lib/api";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatDate } from "@/lib/utils";
import { CheckCircle, Lock } from "lucide-react";
import type { Metadata } from "next";

interface Props {
  params: { id: string };
}

export const metadata: Metadata = { title: "문의 상세" };

export default async function InquiryDetailPage({ params }: Props) {
  const id = Number(params.id);
  const inquiry = await getInquiry(id).catch(() => null);

  if (!inquiry) notFound();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <nav className="text-xs text-hestia-gray mb-6 flex items-center gap-2">
        <Link href="/" className="hover:text-hestia-gold">홈</Link>
        <span>/</span>
        <Link href="/inquiry" className="hover:text-hestia-gold">제품 문의</Link>
        <span>/</span>
        <span className="text-hestia-dark">문의 상세</span>
      </nav>

      {/* 문의 내용 */}
      <div className="border border-hestia-light rounded-sm overflow-hidden mb-6">
        <div className="bg-hestia-light px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {inquiry.is_secret && <Lock className="h-4 w-4 text-hestia-gray" />}
            <h1 className="font-medium text-hestia-dark">{inquiry.title}</h1>
          </div>
          {inquiry.is_answered && (
            <span className="inline-flex items-center gap-1 text-xs text-hestia-gold font-medium">
              <CheckCircle className="h-3 w-3" />
              답변완료
            </span>
          )}
        </div>

        <div className="px-6 py-4 border-b border-hestia-light">
          <div className="flex gap-6 text-xs text-hestia-gray mb-4">
            <span>작성자: {inquiry.author_name}</span>
            <span>등록일: {formatDate(inquiry.created_at)}</span>
          </div>
          <div className="text-sm text-hestia-dark whitespace-pre-line leading-relaxed">
            {inquiry.content}
          </div>
        </div>

        {/* 관리자 답변 */}
        {inquiry.is_answered && inquiry.answer && (
          <div className="px-6 py-4 bg-hestia-cream">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-4 bg-hestia-gold" />
              <p className="text-sm font-medium text-hestia-gold">관리자 답변</p>
              {inquiry.answered_at && (
                <p className="text-xs text-hestia-gray">{formatDate(inquiry.answered_at)}</p>
              )}
            </div>
            <p className="text-sm text-hestia-dark whitespace-pre-line leading-relaxed pl-3">
              {inquiry.answer}
            </p>
          </div>
        )}
      </div>

      <Link
        href="/inquiry"
        className="inline-block border border-hestia-light text-hestia-gray px-6 py-2 text-sm hover:border-hestia-dark hover:text-hestia-dark transition-colors"
      >
        목록으로
      </Link>
    </div>
  );
}
