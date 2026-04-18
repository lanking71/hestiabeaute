"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { getInquiryRaw, deleteInquiryByPassword } from "@/lib/api";
import { CheckCircle, Lock, Trash2 } from "lucide-react";
import type { Inquiry } from "@/lib/types";

interface Props {
  params: { id: string };
}

export default function InquiryDetailPage({ params }: Props) {
  const id = Number(params.id);

  const [inquiry, setInquiry] = useState<Inquiry | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // 비밀글 비밀번호 입력 상태
  const [needPassword, setNeedPassword] = useState(false);
  const [viewPassword, setViewPassword] = useState("");
  const [viewError, setViewError] = useState("");
  const [viewLoading, setViewLoading] = useState(false);

  // 삭제 모달 상태
  const [showDelete, setShowDelete] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    fetchInquiry();
  }, [id]);

  async function fetchInquiry(password?: string) {
    const result = await getInquiryRaw(id, password);
    if (result.status === 200 && result.data) {
      setInquiry(result.data);
      setNeedPassword(false);
    } else if (result.status === 403) {
      setNeedPassword(true);
      if (password) setViewError("비밀번호가 올바르지 않습니다.");
    } else {
      setNotFound(true);
    }
    setLoading(false);
  }

  async function handleViewSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!viewPassword.trim()) return;
    setViewLoading(true);
    setViewError("");
    await fetchInquiry(viewPassword);
    setViewLoading(false);
  }

  async function handleDelete(e: React.FormEvent) {
    e.preventDefault();
    if (!deletePassword.trim()) return;
    setDeleteLoading(true);
    setDeleteError("");
    const result = await deleteInquiryByPassword(id, deletePassword);
    if (result.ok) {
      window.location.href = "/inquiry"; // 완전 리로드로 최신 목록 보장
    } else {
      setDeleteError(result.error || "삭제에 실패했습니다.");
      setDeleteLoading(false);
    }
  }

  // ── 로딩 중 ──
  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-24 text-center text-hestia-gray text-sm">
        불러오는 중...
      </div>
    );
  }

  // ── 404 ──
  if (notFound) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-24 text-center">
        <p className="text-hestia-gray mb-6">문의를 찾을 수 없습니다.</p>
        <Link href="/inquiry" className="text-sm text-hestia-gold hover:underline">
          목록으로 돌아가기
        </Link>
      </div>
    );
  }

  // ── 비밀글 비밀번호 입력 ──
  if (needPassword) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <nav className="text-xs text-hestia-gray mb-6 flex items-center gap-2">
          <Link href="/" className="hover:text-hestia-gold">홈</Link>
          <span>/</span>
          <Link href="/inquiry" className="hover:text-hestia-gold">제품 문의</Link>
          <span>/</span>
          <span className="text-hestia-dark">비밀글</span>
        </nav>

        <div className="border border-hestia-light rounded-sm p-10 flex flex-col items-center gap-6 max-w-md mx-auto">
          <Lock className="h-10 w-10 text-hestia-gray" />
          <p className="text-hestia-dark font-medium">비밀글입니다</p>
          <p className="text-xs text-hestia-gray">작성 시 입력한 비밀번호를 입력하세요.</p>
          <form onSubmit={handleViewSubmit} className="w-full flex flex-col gap-3">
            <input
              type="password"
              value={viewPassword}
              onChange={(e) => setViewPassword(e.target.value)}
              placeholder="비밀번호"
              className="w-full border border-hestia-light px-4 py-2 text-sm focus:outline-none focus:border-hestia-gold"
              autoFocus
            />
            {viewError && <p className="text-xs text-red-500">{viewError}</p>}
            <button
              type="submit"
              disabled={viewLoading}
              className="w-full bg-hestia-gold text-white py-2 text-sm hover:bg-hestia-dark transition-colors disabled:opacity-50"
            >
              {viewLoading ? "확인 중..." : "확인"}
            </button>
          </form>
          <Link href="/inquiry" className="text-xs text-hestia-gray hover:text-hestia-dark underline">
            목록으로
          </Link>
        </div>
      </div>
    );
  }

  // ── 문의 상세 ──
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <nav className="text-xs text-hestia-gray mb-6 flex items-center gap-2">
        <Link href="/" className="hover:text-hestia-gold">홈</Link>
        <span>/</span>
        <Link href="/inquiry" className="hover:text-hestia-gold">제품 문의</Link>
        <span>/</span>
        <span className="text-hestia-dark">문의 상세</span>
      </nav>

      <div className="border border-hestia-light rounded-sm overflow-hidden mb-6">
        {/* 제목 헤더 */}
        <div className="bg-hestia-light px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {inquiry!.is_secret && <Lock className="h-4 w-4 text-hestia-gray" />}
            <h1 className="font-medium text-hestia-dark">{inquiry!.title}</h1>
          </div>
          {inquiry!.is_answered && (
            <span className="inline-flex items-center gap-1 text-xs text-hestia-gold font-medium">
              <CheckCircle className="h-3 w-3" />
              답변완료
            </span>
          )}
        </div>

        {/* 본문 */}
        <div className="px-6 py-4 border-b border-hestia-light">
          <div className="flex gap-6 text-xs text-hestia-gray mb-4">
            <span>작성자: {inquiry!.author_name}</span>
            <span>등록일: {formatDate(inquiry!.created_at)}</span>
          </div>
          <div className="text-sm text-hestia-dark whitespace-pre-line leading-relaxed">
            {inquiry!.content}
          </div>
        </div>

        {/* 관리자 답변 */}
        {inquiry!.is_answered && inquiry!.answer && (
          <div className="px-6 py-4 bg-hestia-cream">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-4 bg-hestia-gold" />
              <p className="text-sm font-medium text-hestia-gold">관리자 답변</p>
              {inquiry!.answered_at && (
                <p className="text-xs text-hestia-gray">{formatDate(inquiry!.answered_at)}</p>
              )}
            </div>
            <p className="text-sm text-hestia-dark whitespace-pre-line leading-relaxed pl-3">
              {inquiry!.answer}
            </p>
          </div>
        )}
      </div>

      {/* 하단 버튼 */}
      <div className="flex items-center justify-between">
        <Link
          href="/inquiry"
          className="inline-block border border-hestia-light text-hestia-gray px-6 py-2 text-sm hover:border-hestia-dark hover:text-hestia-dark transition-colors"
        >
          목록으로
        </Link>
        <button
          onClick={() => { setShowDelete(true); setDeletePassword(""); setDeleteError(""); }}
          className="inline-flex items-center gap-1.5 border border-red-200 text-red-400 px-4 py-2 text-sm hover:border-red-400 hover:text-red-500 transition-colors"
        >
          <Trash2 className="h-3.5 w-3.5" />
          삭제
        </button>
      </div>

      {/* 삭제 모달 */}
      {showDelete && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-sm shadow-lg w-full max-w-sm mx-4 p-6">
            <h2 className="font-medium text-hestia-dark mb-1">문의 삭제</h2>
            <p className="text-xs text-hestia-gray mb-4">
              작성 시 입력한 비밀번호를 입력하면 삭제됩니다.
            </p>
            <form onSubmit={handleDelete} className="flex flex-col gap-3">
              <input
                type="password"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                placeholder="비밀번호"
                className="w-full border border-hestia-light px-4 py-2 text-sm focus:outline-none focus:border-hestia-gold"
                autoFocus
              />
              {deleteError && <p className="text-xs text-red-500">{deleteError}</p>}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowDelete(false)}
                  className="flex-1 border border-hestia-light text-hestia-gray py-2 text-sm hover:border-hestia-dark transition-colors"
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={deleteLoading}
                  className="flex-1 bg-red-500 text-white py-2 text-sm hover:bg-red-600 transition-colors disabled:opacity-50"
                >
                  {deleteLoading ? "삭제 중..." : "삭제"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
