// =====================================================
// 📁 InquiryList.tsx — 문의 목록 테이블
// =====================================================
// 문의 게시판 목록 페이지에서 문의들을 테이블 형태로
// 보여주는 컴포넌트예요.
//
// 테이블 열:
//   - 번호 (id)
//   - 제목 (비밀글이면 "비밀글입니다"로 표시 + 자물쇠 아이콘)
//   - 작성자
//   - 작성 날짜
//   - 상태 (답변완료 / 대기중)
//
// 제목 클릭 시 해당 문의 상세 페이지로 이동
// =====================================================

import Link from "next/link";
import { Inquiry } from "@/lib/types";
import { formatDate } from "@/lib/utils";            // 날짜 형식 변환 함수
import { Lock, CheckCircle } from "lucide-react";    // 아이콘 컴포넌트

// InquiryList가 받을 props 타입
interface InquiryListProps {
  inquiries: Inquiry[];  // 표시할 문의 목록
}

export default function InquiryList({ inquiries }: InquiryListProps) {
  // 문의가 없으면 안내 메시지 표시
  if (!inquiries.length) {
    return (
      <div className="py-20 text-center text-hestia-gray">
        <p>등록된 문의가 없습니다.</p>
      </div>
    );
  }

  return (
    // w-full: 가로 전체 너비로 테이블 확장
    <table className="w-full text-sm">
      {/* ── 테이블 헤더 ── */}
      <thead>
        <tr className="border-y border-hestia-light bg-hestia-light">
          <th className="py-3 px-4 text-left font-medium text-hestia-gray w-12">번호</th>
          <th className="py-3 px-4 text-left font-medium text-hestia-gray">제목</th>
          {/* hidden md:table-cell: 모바일에서는 숨기고 768px 이상에서만 표시 */}
          <th className="py-3 px-4 text-left font-medium text-hestia-gray hidden md:table-cell">작성자</th>
          <th className="py-3 px-4 text-left font-medium text-hestia-gray hidden sm:table-cell">날짜</th>
          <th className="py-3 px-4 text-center font-medium text-hestia-gray w-20">상태</th>
        </tr>
      </thead>

      {/* ── 테이블 바디 ── */}
      <tbody>
        {inquiries.map((inquiry) => (
          <tr
            key={inquiry.id}
            className="border-b border-hestia-light hover:bg-hestia-cream transition-colors"
          >
            {/* 번호 열 */}
            <td className="py-3 px-4 text-hestia-gray">{inquiry.id}</td>

            {/* 제목 열 */}
            <td className="py-3 px-4">
              <Link
                href={`/inquiry/${inquiry.id}`}
                className="flex items-center gap-2 hover:text-hestia-gold transition-colors"
              >
                {/* 비밀글이면 자물쇠 아이콘 표시 */}
                {inquiry.is_secret && <Lock className="h-3 w-3 text-hestia-gray" />}
                <span className={inquiry.is_secret ? "text-hestia-gray" : ""}>
                  {/* 비밀글이면 제목 대신 "비밀글입니다" 표시 */}
                  {inquiry.is_secret ? "비밀글입니다" : inquiry.title}
                </span>
              </Link>
            </td>

            {/* 작성자 열 (모바일 숨김) */}
            <td className="py-3 px-4 text-hestia-gray hidden md:table-cell">{inquiry.author_name}</td>

            {/* 날짜 열 (작은 화면 숨김) */}
            <td className="py-3 px-4 text-hestia-gray hidden sm:table-cell">
              {formatDate(inquiry.created_at)}  {/* "2024-01-15T..." → "2024. 01. 15." */}
            </td>

            {/* 상태 열 */}
            <td className="py-3 px-4 text-center">
              {inquiry.is_answered ? (
                // 답변 완료: 체크 아이콘 + "답변완료" 골드 텍스트
                <span className="inline-flex items-center gap-1 text-xs text-hestia-gold font-medium">
                  <CheckCircle className="h-3 w-3" />
                  답변완료
                </span>
              ) : (
                // 답변 대기: 회색 "대기중" 텍스트
                <span className="text-xs text-hestia-gray">대기중</span>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
