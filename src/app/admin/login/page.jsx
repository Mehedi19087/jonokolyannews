"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { authApi, setTokens, ApiError } from "@/lib/api-client.js";
import { Button, Input, Label } from "@/components/admin/ui.jsx";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await authApi.login(email.trim(), password);
      const normalizedUser = {
        id: res.user.id,
        email: res.user.email,
        role: res.user.role,
        first_name: res.user.first_name,
        last_name: res.user.last_name,
      };
      setTokens(res.access, res.refresh);
      localStorage.setItem("bdn_admin_session", JSON.stringify(normalizedUser));
      router.push("/admin/dashboard");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "লগইন ব্যর্থ হয়েছে");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen grid place-items-center bg-neutral-50 px-4 font-sans text-neutral-900">
      <div className="w-full max-w-sm bg-white border border-neutral-200 rounded-lg p-8 shadow-sm">
        <div className="text-center mb-6">
          <Link href="/" className="font-serif text-2xl font-black tracking-tight text-neutral-900 hover:text-red-700 transition-colors">
            জনকল্যাণ <span className="text-red-600">নিউজ</span>
          </Link>
          <p className="mt-2 text-sm text-neutral-500">সাংবাদিক ও অ্যাডমিন প্যানেল</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">ইমেইল</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="editor@example.com"
              required
              autoComplete="email"
            />
          </div>
          <div>
            <Label htmlFor="password">পাসওয়ার্ড</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />
          </div>
          {error && <p className="text-sm text-red-600 bg-red-50 p-2 rounded border border-red-200">{error}</p>}
          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? "প্রবেশ করা হচ্ছে…" : "প্রবেশ করুন"}
          </Button>
          <p className="text-sm text-center text-neutral-500 pt-2">
            নতুন এখানে?{" "}
            <Link href="/admin/signup" className="text-neutral-900 font-semibold underline">
              রেজিস্টার করুন
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
