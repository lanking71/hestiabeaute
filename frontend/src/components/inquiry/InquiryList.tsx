import Link from "next/link";
import { Inquiry } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { Lock, CheckCircle } from "lucide-react";

interface InquiryListProps {
  inquiries: Inquiry[];
}

export default function InquiryList({ inquiries }: InquiryListProps) {
  if (!inquiries.length) {
    return (
      <div className="py-20 text-center text-hestia-gray">
        <p>등록된 문의가 없습니다.</p>
      </div>
    );
  }

  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-y border-hestia-light bg-hestia-light">
          <th className="py-3 px-4 text-left font-medium text-hestia-gray w-12">번호</th>
          <th className="py-3 px-4 text-left font-medium text-hestia-gray">제목</th>
          <th className="py-3 px-4 text-left font-medium text-hestia-gray hidden md:table-cell">작성자</th>
          <th className="py-3 px-4 text-left font-medium text-hestia-gray hidden sm:table-cell">날짜</th>
          <th className="py-3 px-4 text-center font-medium text-hestia-gray w-20">상태</th>
        </tr>
      </thead>
      <tbody>
        {inquiries.map((inquiry) => (
          <tr
            key={inquiry.id}
            className="border-b border-hestia-light hover:bg-hestia-cream transition-colors"
          >
            <td className="py-3 px-4 text-hestia-gray">{inquiry.id}</td>
            <td className="py-3 px-4">
              <Link
                href={`/inquiry/${inquiry.id}`}
                className="flex items-center gap-2 hover:text-hestia-gold transition-colors"
              >
                {inquiry.is_secret && <Lock className="h-3 w-3 text-hestia-gray" />}
                <span className={inquiry.is_secret ? "text-hestia-gray" : ""}>
                  {inquiry.is_secret ? "비밀글입니다" : inquiry.title}
                </span>
              </Link>
            </td>
            <td className="py-3 px-4 text-hestia-gray hidden md:table-cell">{inquiry.author_name}</td>
            <td className="py-3 px-4 text-hestia-gray hidden sm:table-cell">
              {formatDate(inquiry.created_at)}
            </td>
            <td className="py-3 px-4 text-center">
              {inquiry.is_answered ? (
                <span className="inline-flex items-center gap-1 text-xs text-hestia-gold font-medium">
                  <CheckCircle className="h-3 w-3" />
                  답변완료
                </span>
              ) : (
                <span className="text-xs text-hestia-gray">대기중</span>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
