"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { authApi, setTokens, ApiError } from "@/lib/api-client.js";
import { Button, Input, Label } from "@/components/admin/ui.jsx";

function VerifyOtpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState(searchParams.get("email") || "");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await authApi.verifyOtp(email.trim(), otp.trim());
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
      setError(err instanceof ApiError ? err.message : "OTP যাচাই ব্যর্থ হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid place-items-center bg-neutral-50 p-4 font-sans text-neutral-900">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white rounded-lg border border-neutral-200 p-8 shadow-sm space-y-5"
      >
        <div>
          <h1 className="text-2xl font-bold">OTP যাচাই করুন</h1>
          <p className="text-sm text-neutral-500 mt-1">
            আপনার ইমেইলে পাঠানো ৬ ডিজিটের কোডটি লিখুন।
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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="otp">OTP কোড</Label>
          <Input
            id="otp"
            inputMode="numeric"
            pattern="[0-9]{6}"
            maxLength={6}
            required
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
            className="text-center text-2xl tracking-[0.5em] font-mono"
            placeholder="000000"
          />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "যাচাই করা হচ্ছে…" : "যাচাই করুন"}
        </Button>
        <p className="text-sm text-center text-neutral-500 pt-2">
          কোড পাননি?{" "}
          <Link href="/admin/signup" className="text-neutral-900 font-semibold underline">
            পুনরায় সাইন আপ করুন
          </Link>
        </p>
      </form>
    </div>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={<div className="min-h-screen grid place-items-center bg-neutral-50 text-sm">লোড হচ্ছে…</div>}>
      <VerifyOtpContent />
    </Suspense>
  );
}
