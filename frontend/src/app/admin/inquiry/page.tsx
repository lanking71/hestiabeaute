"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { adminGetInquiries, adminAnswerInquiry, adminDeleteInquiry } from "@/lib/api";
import { Inquiry } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { CheckCircle, Trash2, ChevronDown, ChevronUp } from "lucide-react";

export default function AdminInquiryPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [answerText, setAnswerText] = useState("");
  const [loading, setLoading] = useState(false);

  function getToken() {
    return localStorage.getItem("admin_token") || "";
  }

  async function load() {
    const result = await adminGetInquiries(getToken()).catch(() => ({ items: [] }));
    setInquiries(result.items);
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { load(); }, []);

  function toggleExpand(id: number, existingAnswer: string) {
    if (expanded === id) {
      setExpanded(null);
      setAnswerText("");
    } else {
      setExpanded(id);
      setAnswerText(existingAnswer || "");
    }
  }

  async function handleAnswer(id: number) {
    if (!answerText.trim()) return;
    setLoading(true);
    try {
      await adminAnswerInquiry(getToken(), id, answerText);
      await load();
      setExpanded(null);
      setAnswerText("");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("삭제하시겠습니까?")) return;
    await adminDeleteInquiry(getToken(), id);
    await load();
  }

  return (
    <AdminLayout>
      <h1 className="text-xl font-bold text-hestia-dark mb-6">문의 관리</h1>

      <div className="space-y-3">
        {inquiries.map((inq) => (
          <div key={inq.id} className="bg-white rounded-sm border border-gray-200 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-3 min-w-0">
                {inq.is_answered && (
                  <CheckCircle className="h-4 w-4 text-hestia-gold flex-none" />
                )}
                <div className="min-w-0">
                  <p className="font-medium text-sm truncate">{inq.title}</p>
                  <p className="text-xs text-hestia-gray mt-0.5">
                    {inq.author_name} · {formatDate(inq.created_at)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-none ml-4">
                <button
                  onClick={() => toggleExpand(inq.id, inq.answer || "")}
                  className="p-1.5 hover:text-hestia-gold transition-colors"
                >
                  {expanded === inq.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>
                <button
                  onClick={() => handleDelete(inq.id)}
                  className="p-1.5 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            {expanded === inq.id && (
              <div className="border-t border-gray-100 px-4 py-4 space-y-4">
                <div className="bg-gray-50 rounded p-3 text-sm text-hestia-dark whitespace-pre-line">
                  {inq.content}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">답변 작성</label>
                  <Textarea
                    rows={4}
                    value={answerText}
                    onChange={(e) => setAnswerText(e.target.value)}
                    placeholder="답변 내용을 입력하세요"
                  />
                  <div className="flex gap-2 mt-2">
                    <Button size="sm" onClick={() => handleAnswer(inq.id)} disabled={loading}>
                      {loading ? "저장 중..." : "답변 등록"}
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setExpanded(null)}>
                      닫기
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        {!inquiries.length && (
          <div className="bg-white rounded-sm border border-gray-200 p-12 text-center text-hestia-gray">
            문의가 없습니다.
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
