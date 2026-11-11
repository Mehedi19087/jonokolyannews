"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { authApi, ApiError } from "@/lib/api-client.js";
import { Button, Input, Label } from "@/components/admin/ui.jsx";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setError(null);
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 30_000);
    try {
      await authApi.signup(email.trim(), password, controller.signal);
      router.push(`/admin/verify-otp?email=${encodeURIComponent(email.trim())}`);
    } catch (err) {
      if (controller.signal.aborted) {
        setError("সার্ভার ৩০ সেকেন্ডের মধ্যে উত্তর দেয়নি। কিছুক্ষণ পর আবার চেষ্টা করুন।");
      } else {
        setError(
          err instanceof ApiError
            ? err.message
            : "সার্ভারের সঙ্গে সংযোগ করা যায়নি। ইন্টারনেট সংযোগ পরীক্ষা করুন।"
        );
      }
    } finally {
      window.clearTimeout(timeout);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid place-items-center bg-neutral-50 p-4 font-sans text-neutral-900">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white rounded-lg border border-neutral-200 p-8 shadow-sm space-y-5"
      >
        <div className="text-center mb-2">
          <Link href="/" className="font-serif text-2xl font-black tracking-tight text-neutral-900 hover:text-red-700 transition-colors">
            জনকল্যাণ <span className="text-red-600">নিউজ</span>
          </Link>
          <h1 className="text-xl font-bold mt-4">অ্যাকাউন্ট তৈরি করুন</h1>
          <p className="text-sm text-neutral-500 mt-1">
            সাইন আপের পর ইমেইলে একটি ওটিপি কোড পাঠানো হবে।
          </p>
        </div>
        {error && (
          <div className="text-sm text-red-600 bg-red-50 border border-red-200 p-2.5 rounded">
            {error}
          </div>
        )}
        <div>
          <Label htmlFor="email">ইমেইল</Label>
          <Input
            id="email"
            type="email"
            required
            placeholder="reporter@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="password">পাসওয়ার্ড (ন্যূনতম ৮ অক্ষর)</Label>
          <Input
            id="password"
            type="password"
            required
            minLength={8}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "প্রক্রিয়াকরণ হচ্ছে…" : "সাইন আপ করুন"}
        </Button>
        <p className="text-sm text-center text-neutral-500 pt-2">
          ইতিমধ্যে অ্যাকাউন্ট আছে?{" "}
          <Link href="/admin/login" className="text-neutral-900 font-semibold underline">
            লগইন করুন
          </Link>
        </p>
      </form>
    </div>
  );
}
