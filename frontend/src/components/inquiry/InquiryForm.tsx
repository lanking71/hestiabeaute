"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createInquiry } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface InquiryFormProps {
  productId?: number;
}

export default function InquiryForm({ productId }: InquiryFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const form = e.currentTarget;
    const data = {
      author_name: (form.elements.namedItem("author_name") as HTMLInputElement).value,
      author_email: (form.elements.namedItem("author_email") as HTMLInputElement).value,
      title: (form.elements.namedItem("title") as HTMLInputElement).value,
      content: (form.elements.namedItem("content") as HTMLTextAreaElement).value,
      password: (form.elements.namedItem("password") as HTMLInputElement).value,
      is_secret: (form.elements.namedItem("is_secret") as HTMLInputElement).checked,
      product_id: productId,
    };

    try {
      const inquiry = await createInquiry(data);
      if (data.is_secret) {
        router.push("/inquiry");
      } else {
        router.push(`/inquiry/${inquiry.id}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "문의 등록에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-hestia-dark mb-1">이름 *</label>
          <Input name="author_name" required placeholder="홍길동" />
        </div>
        <div>
          <label className="block text-sm font-medium text-hestia-dark mb-1">이메일 *</label>
          <Input name="author_email" type="email" required placeholder="example@email.com" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-hestia-dark mb-1">제목 *</label>
        <Input name="title" required placeholder="문의 제목을 입력하세요" />
      </div>

      <div>
        <label className="block text-sm font-medium text-hestia-dark mb-1">내용 *</label>
        <Textarea name="content" required rows={6} placeholder="문의 내용을 입력하세요" />
      </div>

      <div>
        <label className="block text-sm font-medium text-hestia-dark mb-1">비밀번호 *</label>
        <Input
          name="password"
          type="password"
          required
          placeholder="문의 확인용 비밀번호"
          className="max-w-xs"
        />
        <p className="text-xs text-hestia-gray mt-1">문의 내용 확인 시 필요합니다</p>
      </div>

      <div className="flex items-center gap-2">
        <input type="checkbox" name="is_secret" id="is_secret" className="rounded" />
        <label htmlFor="is_secret" className="text-sm text-hestia-gray cursor-pointer">
          비밀글로 등록
        </label>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="flex gap-3 pt-2">
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
