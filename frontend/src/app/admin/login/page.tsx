"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { adminLogin } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AdminLoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const form = e.currentTarget;
    const username = (form.elements.namedItem("username") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;

    try {
      const { access_token } = await adminLogin(username, password);
      localStorage.setItem("admin_token", access_token);
      router.push("/admin/dashboard");
    } catch {
      setError("아이디 또는 비밀번호가 올바르지 않습니다.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-hestia-cream">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="font-playfair text-3xl font-bold tracking-widest text-hestia-dark mb-1">
            HESTIA
          </div>
          <p className="text-hestia-gray text-sm">관리자 로그인</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-sm shadow-sm p-8 space-y-4">
          <div>
            <label className="block text-sm font-medium text-hestia-dark mb-1">아이디</label>
            <Input name="username" required placeholder="admin" />
          </div>
          <div>
            <label className="block text-sm font-medium text-hestia-dark mb-1">비밀번호</label>
            <Input name="password" type="password" required placeholder="••••••••" />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <Button type="submit" disabled={loading} className="w-full mt-2">
            {loading ? "로그인 중..." : "로그인"}
          </Button>
        </form>
      </div>
    </div>
  );
}
