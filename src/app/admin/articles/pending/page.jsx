"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CheckCircle2, XCircle, RotateCcw, RefreshCw, Eye } from "lucide-react";
import { AdminLayout, PageHeader } from "@/components/admin/AdminLayout.jsx";
import { articlesApi } from "@/lib/api-client.js";
import { Button, Textarea, Dialog } from "@/components/admin/ui.jsx";

export default function PendingArticlesPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionError, setActionError] = useState(null);
  const [rejectingSlug, setRejectingSlug] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [expandedSlug, setExpandedSlug] = useState(null);

  const load = () => {
    setLoading(true);
    setError(null);
    articlesApi
      .editorList("PENDING")
      .then((data) => setItems(Array.isArray(data) ? data : []))
      .catch((err) => setError(err.message || "পেন্ডিং তালিকা লোড ব্যর্থ"))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const remove = (slug) => setItems((prev) => prev.filter((a) => a.slug !== slug));

  const handleApprove = async (slug) => {
    setActionError(null);
    try {
      await articlesApi.approve(slug);
      remove(slug);
    } catch (err) {
      setActionError(err.message || "অনুমোদন ব্যর্থ হয়েছে");
    }
  };

  const handleReject = async (slug) => {
    if (!feedback.trim()) return;
    setActionError(null);
    try {
      await articlesApi.reject(slug, feedback.trim());
      remove(slug);
      setRejectingSlug(null);
      setFeedback("");
    } catch (err) {
      setActionError(err.message || "প্রত্যাখ্যান ব্যর্থ হয়েছে");
    }
  };

  const handleRecall = async (slug) => {
    setActionError(null);
    try {
      await articlesApi.recall(slug);
      remove(slug);
    } catch (err) {
      setActionError(err.message || "ড্রাফটে ফেরত পাঠানো ব্যর্থ হয়েছে");
    }
  };

  return (
    <AdminLayout>
      <PageHeader
        title="অনুমোদনের জন্য অপেক্ষমাণ"
        description="রিপোর্টারদের সাবমিট করা সংবাদ পর্যালোচনা করে অনুমোদন বা প্রত্যাখ্যান করুন"
      >
        <Button variant="outline" size="sm" onClick={load} disabled={loading}>
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          রিফ্রেশ
        </Button>
      </PageHeader>

      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 p-3 rounded mb-4">
          {error}
        </div>
      )}

      {actionError && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 p-3 rounded mb-4">
          {actionError}
        </div>
      )}

      {loading ? (
        <p className="text-neutral-500 text-sm">লোড হচ্ছে…</p>
      ) : items.length === 0 ? (
        <div className="bg-white rounded-lg border p-12 text-center text-neutral-500 shadow-sm">
          অনুমোদনের অপেক্ষায় এই মুহূর্তে কোনো সংবাদ নেই।
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((a) => {
            const authorName =
              [a.author?.first_name, a.author?.last_name].filter(Boolean).join(" ") ||
              a.author?.email ||
              "অজানা";
            const isExpanded = expandedSlug === a.slug;

            return (
              <div key={a.id} className="bg-white rounded-lg border border-neutral-200 p-5 shadow-sm">
                <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <h3
                      className="font-bold text-lg text-neutral-900 hover:text-red-600 cursor-pointer transition-colors"
                      onClick={() => setExpandedSlug(isExpanded ? null : a.slug)}
                    >
                      {a.title}
                    </h3>
                    <p className="text-xs text-neutral-500 mt-1">
                      লেখক: <strong className="text-neutral-800">{authorName}</strong> • বিভাগ:{" "}
                      {a.category?.name || "N/A"} • জমা দেওয়ার তারিখ:{" "}
                      {new Date(a.created_at).toLocaleDateString("bn-BD")}
                    </p>

                    {a.featured_image_url && (
                      <div className="mt-3">
                        <img
                          src={a.featured_image_url}
                          alt=""
                          className="h-32 rounded border object-cover"
                        />
                      </div>
                    )}

                    {a.content && (
                      <p
                        className={`text-sm text-neutral-700 mt-3 whitespace-pre-line leading-relaxed ${
                          isExpanded ? "" : "line-clamp-3"
                        }`}
                      >
                        {a.content}
                      </p>
                    )}

                    <button
                      type="button"
                      onClick={() => setExpandedSlug(isExpanded ? null : a.slug)}
                      className="text-xs text-blue-600 hover:underline mt-2 font-medium cursor-pointer"
                    >
                      {isExpanded ? "সংক্ষিপ্ত করুন ▲" : "সম্পূর্ণ পড়ুন ▼"}
                    </button>
                  </div>

                  <div className="flex sm:flex-col gap-2 shrink-0 self-end sm:self-start">
                    <Button
                      size="sm"
                      variant="default"
                      onClick={() => handleApprove(a.slug)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      অনুমোদন করুন
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => setRejectingSlug(a.slug)}
                    >
                      <XCircle className="w-4 h-4" />
                      ফেরত পাঠান
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleRecall(a.slug)}
                    >
                      <RotateCcw className="w-4 h-4" />
                      ড্রাফটে রূপান্তর
                    </Button>
                  </div>
                </div>

                {/* Inline rejection box */}
                {rejectingSlug === a.slug && (
                  <div className="mt-4 pt-4 border-t space-y-3 bg-neutral-50 p-3 rounded">
                    <p className="text-xs font-semibold text-neutral-700">
                      লেখকের কাছে ফেরত পাঠানোর কারণ লিখুন:
                    </p>
                    <Textarea
                      rows={3}
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      placeholder="সংশোধনের বিবরণ…"
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="destructive"
                        disabled={!feedback.trim()}
                        onClick={() => handleReject(a.slug)}
                      >
                        প্রত্যাখ্যান নিশ্চিত করুন
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setRejectingSlug(null);
                          setFeedback("");
                        }}
                      >
                        বাতিল
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </AdminLayout>
  );
}
