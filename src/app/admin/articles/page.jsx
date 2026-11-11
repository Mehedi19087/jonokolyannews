"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useState } from "react";
import { AdminLayout, PageHeader } from "@/components/admin/AdminLayout.jsx";
import { articlesApi, isEditorRole, isOwnerRole } from "@/lib/api-client.js";
import { useAdminAuth } from "@/lib/admin-auth.js";
import { Button, Input, Badge, Dialog } from "@/components/admin/ui.jsx";
import {
  FilePlus2,
  RefreshCw,
  Search,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Send,
  Download,
  AlertCircle,
} from "lucide-react";

const STATUS_TABS = [
  { value: "ALL", label: "সব" },
  { value: "DRAFT", label: "ড্রাফট" },
  { value: "PENDING", label: "অনুমোদনের জন্য" },
  { value: "PUBLISHED", label: "প্রকাশিত" },
  { value: "REJECTED", label: "প্রত্যাখ্যাত" },
];

function statusBadge(status) {
  switch (status) {
    case "PUBLISHED":
      return <Badge variant="success">প্রকাশিত</Badge>;
    case "PENDING":
      return <Badge variant="warning">অনুমোদনের অপেক্ষায়</Badge>;
    case "REJECTED":
      return <Badge variant="destructive">প্রত্যাখ্যাত</Badge>;
    case "DRAFT":
    default:
      return <Badge variant="secondary">ড্রাফট</Badge>;
  }
}

function ArticlesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentStatus = searchParams.get("status") || "ALL";
  const { user } = useAdminAuth();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [processingSlug, setProcessingSlug] = useState(null);

  const [previewArticle, setPreviewArticle] = useState(null);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectSlug, setRejectSlug] = useState(null);
  const [rejectFeedback, setRejectFeedback] = useState("");

  const isEditor = isEditorRole(user?.role);
  const isOwner = isOwnerRole(user?.role);

  const fetchArticles = useCallback(() => {
    setLoading(true);
    setError(null);
    articlesApi
      .editorList(currentStatus === "ALL" ? undefined : currentStatus)
      .then((data) => setItems(Array.isArray(data) ? data : []))
      .catch((err) => setError(err.message || "সংবাদ তালিকা লোড ব্যর্থ হয়েছে"))
      .finally(() => setLoading(false));
  }, [currentStatus]);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  const setStatus = (status) => {
    const params = new URLSearchParams(searchParams);
    if (status === "ALL") params.delete("status");
    else params.set("status", status);
    router.push(`/admin/articles?${params.toString()}`);
  };

  const handleDelete = async (slug) => {
    if (!confirm("আপনি কি নিশ্চিতভাবে এই পোস্টটি মুছে ফেলতে চান?")) return;
    setProcessingSlug(slug);
    try {
      await articlesApi.remove(slug);
      setItems((prev) => prev.filter((a) => a.slug !== slug));
      setSuccessMsg("পোস্ট সফলভাবে মুছে ফেলা হয়েছে");
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err) {
      alert(err.message || "মুছে ফেলা ব্যর্থ হয়েছে");
    } finally {
      setProcessingSlug(null);
    }
  };

  const handleApprove = async (slug) => {
    setProcessingSlug(slug);
    try {
      await articlesApi.approve(slug);
      setSuccessMsg("পোস্ট সফলভাবে অনুমোদিত ও প্রকাশিত হয়েছে");
      setTimeout(() => setSuccessMsg(null), 3000);
      fetchArticles();
    } catch (err) {
      alert(err.message || "অনুমোদন ব্যর্থ হয়েছে");
    } finally {
      setProcessingSlug(null);
    }
  };

  const handleRejectSubmit = async () => {
    if (!rejectSlug) return;
    try {
      await articlesApi.reject(rejectSlug, rejectFeedback.trim());
      setRejectDialogOpen(false);
      setRejectFeedback("");
      setRejectSlug(null);
      setSuccessMsg("পোস্টটি ফেরত পাঠানো হয়েছে");
      setTimeout(() => setSuccessMsg(null), 3000);
      fetchArticles();
    } catch (err) {
      alert(err.message || "প্রত্যাখ্যান ব্যর্থ হয়েছে");
    }
  };

  const filtered = items.filter((a) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      a.title?.toLowerCase().includes(q) ||
      a.category?.name?.toLowerCase().includes(q) ||
      a.author?.email?.toLowerCase().includes(q)
    );
  });

  return (
    <AdminLayout>
      <PageHeader title="সব পোস্ট" description="আপনার সংবাদ পোর্টালের পোস্টসমূহ পরিচালনা করুন">
        <Button variant="outline" size="sm" onClick={fetchArticles} disabled={loading}>
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          রিফ্রেশ
        </Button>
        <Link href="/admin/articles/new">
          <Button variant="default" size="sm">
            <FilePlus2 className="w-4 h-4" />
            নতুন পোস্ট লিখুন
          </Button>
        </Link>
      </PageHeader>

      {successMsg && (
        <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded text-sm flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          {successMsg}
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-800 rounded text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          {error}
        </div>
      )}

      {/* Tabs and Search Header */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between mb-4">
        <div className="flex flex-wrap gap-1 border-b sm:border-b-0 pb-2 sm:pb-0">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => setStatus(tab.value)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                currentStatus === tab.value
                  ? "bg-neutral-900 text-white"
                  : "bg-white border text-neutral-600 hover:bg-neutral-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-neutral-400" />
          <Input
            placeholder="সংবাদ খুঁজুন…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 text-xs"
          />
        </div>
      </div>

      {/* Articles Table */}
      <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b bg-neutral-50/80 text-neutral-600 font-semibold uppercase tracking-wider">
                <th className="px-4 py-3">শিরোনাম</th>
                <th className="px-4 py-3">ক্যাটাগরি</th>
                <th className="px-4 py-3">লেখক</th>
                <th className="px-4 py-3">তারিখ</th>
                <th className="px-4 py-3">স্ট্যাটাস</th>
                <th className="px-4 py-3 text-right">পদক্ষেপ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-neutral-400">
                    লোড হচ্ছে…
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-neutral-400">
                    কোনো পোস্ট পাওয়া যায়নি।
                  </td>
                </tr>
              ) : (
                filtered.map((article) => {
                  const authorName =
                    [article.author?.first_name, article.author?.last_name]
                      .filter(Boolean)
                      .join(" ") || article.author?.email || "অজানা";
                  return (
                    <tr key={article.id} className="hover:bg-neutral-50 transition-colors">
                      <td className="px-4 py-3 max-w-md">
                        <p className="font-semibold text-neutral-900 text-sm line-clamp-1">
                          {article.title}
                        </p>
                        {article.is_breaking && (
                          <span className="inline-block mt-0.5 text-[10px] text-red-600 font-bold">
                            • ব্রেকিং নিউজ
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-neutral-600 whitespace-nowrap">
                        {article.category?.name || "N/A"}
                      </td>
                      <td className="px-4 py-3 text-neutral-600 whitespace-nowrap">
                        <span className="font-medium text-neutral-800">{authorName}</span>
                        {article.author?.role && (
                          <span className="block text-[10px] text-neutral-400">
                            {article.author.role}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-neutral-500 whitespace-nowrap">
                        {article.published_at
                          ? new Date(article.published_at).toLocaleDateString("bn-BD")
                          : new Date(article.created_at).toLocaleDateString("bn-BD")}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">{statusBadge(article.status)}</td>
                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            title="প্রিভিউ"
                            onClick={() => setPreviewArticle(article)}
                            className="p-1.5 text-neutral-500 hover:text-neutral-900 rounded hover:bg-neutral-100"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <Link href={`/admin/articles/${encodeURIComponent(article.slug)}/edit`}>
                            <button
                              type="button"
                              title="সম্পাদনা"
                              className="p-1.5 text-neutral-500 hover:text-neutral-900 rounded hover:bg-neutral-100"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                          </Link>
                          {isEditor && article.status === "PENDING" && (
                            <>
                              <button
                                type="button"
                                title="অনুমোদন করুন"
                                onClick={() => handleApprove(article.slug)}
                                disabled={processingSlug === article.slug}
                                className="p-1.5 text-emerald-600 hover:text-emerald-700 rounded hover:bg-emerald-50"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                title="ফেরত পাঠান"
                                onClick={() => {
                                  setRejectSlug(article.slug);
                                  setRejectDialogOpen(true);
                                }}
                                className="p-1.5 text-amber-600 hover:text-amber-700 rounded hover:bg-amber-50"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            </>
                          )}
                          <button
                            type="button"
                            title="মুছে ফেলুন"
                            onClick={() => handleDelete(article.slug)}
                            disabled={processingSlug === article.slug}
                            className="p-1.5 text-red-500 hover:text-red-700 rounded hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Preview Dialog */}
      <Dialog
        open={Boolean(previewArticle)}
        onOpenChange={(open) => !open && setPreviewArticle(null)}
        title={previewArticle?.title}
        description={`বিভাগ: ${previewArticle?.category?.name || "N/A"}`}
        footer={
          <Button variant="outline" onClick={() => setPreviewArticle(null)}>
            বন্ধ করুন
          </Button>
        }
      >
        {previewArticle && (
          <div className="space-y-4 text-xs text-neutral-700">
            {previewArticle.featured_image_url && (
              <img
                src={previewArticle.featured_image_url}
                alt=""
                className="w-full h-48 object-cover rounded border"
              />
            )}
            <div className="p-3 bg-neutral-50 rounded border space-y-1">
              <p>
                <strong>লেখক:</strong>{" "}
                {[previewArticle.author?.first_name, previewArticle.author?.last_name]
                  .filter(Boolean)
                  .join(" ") || previewArticle.author?.email}
              </p>
              <p>
                <strong>স্ট্যাটাস:</strong> {previewArticle.status}
              </p>
              {previewArticle.rejection_feedback && (
                <p className="text-red-600">
                  <strong>প্রত্যাখ্যান কারণ:</strong> {previewArticle.rejection_feedback}
                </p>
              )}
            </div>
            <div className="whitespace-pre-line leading-relaxed max-h-60 overflow-y-auto border p-3 rounded">
              {previewArticle.content}
            </div>
          </div>
        )}
      </Dialog>

      {/* Reject Reason Dialog */}
      <Dialog
        open={rejectDialogOpen}
        onOpenChange={setRejectDialogOpen}
        title="পোস্ট প্রত্যাখ্যান ও মতামত"
        description="লেখকের জন্য কারণ বা সংশোধনের নির্দেশ লিখুন।"
        footer={
          <>
            <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>
              বাতিল
            </Button>
            <Button variant="destructive" onClick={handleRejectSubmit}>
              প্রত্যাখ্যান নিশ্চিত করুন
            </Button>
          </>
        }
      >
        <textarea
          rows={4}
          value={rejectFeedback}
          onChange={(e) => setRejectFeedback(e.target.value)}
          placeholder="কেন এই পোস্টটি সংশোধন করা প্রয়োজন…"
          className="w-full border border-neutral-300 rounded p-2 text-xs focus:ring-2 focus:ring-neutral-400 outline-none"
        />
      </Dialog>
    </AdminLayout>
  );
}

export default function ArticlesPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm text-neutral-500">লোড হচ্ছে…</div>}>
      <ArticlesContent />
    </Suspense>
  );
}
