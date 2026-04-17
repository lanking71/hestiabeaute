// =====================================================
// 📁 InquiryForm.tsx — 문의 작성 폼
// =====================================================
// 고객이 제품 문의를 작성하는 폼 컴포넌트예요.
//
// 입력 항목:
//   - 이름 (필수)
//   - 이메일 (필수)
//   - 제목 (필수)
//   - 내용 (필수)
//   - 비밀번호 (나중에 문의 확인용)
//   - 비밀글 체크박스 (선택)
//
// 제출 성공 시:
//   - 비밀글이면: 문의 목록 페이지로 이동
//   - 일반글이면: 작성한 문의 상세 페이지로 이동
//
// "use client": useState, 폼 이벤트 처리 때문에 브라우저 실행
// =====================================================

"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";  // 페이지 이동 훅
import { createInquiry } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

// InquiryForm이 받을 props 타입
interface InquiryFormProps {
  productId?: number;  // 특정 제품 문의라면 제품 id 전달 (없으면 일반 문의)
}

export default function InquiryForm({ productId }: InquiryFormProps) {
  const router = useRouter();  // 페이지 이동 함수
  const [loading, setLoading] = useState(false);  // 제출 중 여부 (버튼 비활성화용)
  const [error, setError] = useState("");          // 오류 메시지

  // handleSubmit: 폼 제출 시 실행되는 함수
  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    // 기본 동작 차단: HTML form의 기본 제출(페이지 새로고침) 방지
    e.preventDefault();
    setError("");     // 이전 오류 메시지 지우기
    setLoading(true); // 로딩 시작 (버튼 비활성화)

    const form = e.currentTarget;

    // 폼 요소에서 값 꺼내기
    // form.elements.namedItem("name"): name 속성이 "name"인 input 요소 찾기
    const data = {
      author_name: (form.elements.namedItem("author_name") as HTMLInputElement).value,
      author_email: (form.elements.namedItem("author_email") as HTMLInputElement).value,
      title: (form.elements.namedItem("title") as HTMLInputElement).value,
      content: (form.elements.namedItem("content") as HTMLTextAreaElement).value,
      password: (form.elements.namedItem("password") as HTMLInputElement).value,
      is_secret: (form.elements.namedItem("is_secret") as HTMLInputElement).checked,
      product_id: productId,  // 특정 제품 문의면 id 추가
    };

    try {
      // 백엔드에 문의 데이터 전송
      const inquiry = await createInquiry(data);

      // 제출 성공 시 페이지 이동
      if (data.is_secret) {
        // 비밀글이면 목록으로 (상세 내용은 비밀번호가 있어야 볼 수 있음)
        router.push("/inquiry");
      } else {
        // 일반글이면 방금 작성한 문의 상세 페이지로
        router.push(`/inquiry/${inquiry.id}`);
      }
    } catch (err) {
      // 오류 발생 시 메시지 표시
      setError(err instanceof Error ? err.message : "문의 등록에 실패했습니다.");
    } finally {
      setLoading(false);  // 로딩 끝 (성공이든 실패든 버튼 다시 활성화)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">

      {/* ── 이름 + 이메일 (2열 배치) ── */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-hestia-dark mb-1">이름 *</label>
          {/* name 속성: 위에서 form.elements.namedItem("author_name")으로 접근 */}
          <Input name="author_name" required placeholder="홍길동" />
        </div>
        <div>
          <label className="block text-sm font-medium text-hestia-dark mb-1">이메일 *</label>
          <Input name="author_email" type="email" required placeholder="example@email.com" />
        </div>
      </div>

      {/* ── 제목 ── */}
      <div>
        <label className="block text-sm font-medium text-hestia-dark mb-1">제목 *</label>
        <Input name="title" required placeholder="문의 제목을 입력하세요" />
      </div>

      {/* ── 내용 ── */}
      <div>
        <label className="block text-sm font-medium text-hestia-dark mb-1">내용 *</label>
        <Textarea name="content" required rows={6} placeholder="문의 내용을 입력하세요" />
      </div>

      {/* ── 비밀번호 ── */}
      <div>
        <label className="block text-sm font-medium text-hestia-dark mb-1">비밀번호 *</label>
        <Input
          name="password"
          type="password"    // 입력 시 ●●● 표시
          required
          placeholder="문의 확인용 비밀번호"
          className="max-w-xs"
        />
        <p className="text-xs text-hestia-gray mt-1">문의 내용 확인 시 필요합니다</p>
      </div>

      {/* ── 비밀글 체크박스 ── */}
      <div className="flex items-center gap-2">
        <input type="checkbox" name="is_secret" id="is_secret" className="rounded" />
        {/* htmlFor: 이 label과 연결된 input의 id → 라벨 클릭해도 체크 가능 */}
        <label htmlFor="is_secret" className="text-sm text-hestia-gray cursor-pointer">
          비밀글로 등록
        </label>
      </div>

      {/* ── 오류 메시지 ── */}
      {error && <p className="text-sm text-red-500">{error}</p>}

      {/* ── 버튼 ── */}
      <div className="flex gap-3 pt-2">
        {/* disabled={loading}: 제출 중에는 버튼 비활성화 (중복 제출 방지) */}
        <Button type="submit" disabled={loading}>
          {loading ? "등록 중..." : "문의 등록"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          취소
        </Button>
      </div>
    </form>
  );
}
