"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  Share2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  RefreshCw,
  Trash2,
  Send,
  Eye,
  Key,
  Plus,
} from "lucide-react";
import { FacebookIcon } from "@/components/common/SocialIcons.jsx";
import { AdminLayout, PageHeader } from "@/components/admin/AdminLayout.jsx";
import { facebookApi, articlesApi } from "@/lib/api-client.js";
import { Button, Input, Label, Switch, Badge, Dialog } from "@/components/admin/ui.jsx";

export default function FacebookIntegrationPage() {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const [notification, setNotification] = useState(null);

  const [recentArticles, setRecentArticles] = useState([]);
  const [loadingArticles, setLoadingArticles] = useState(false);
  const [publishingSlug, setPublishingSlug] = useState(null);
  const [previewCardUrl, setPreviewCardUrl] = useState(null);

  const [tokenModalOpen, setTokenModalOpen] = useState(false);
  const [inputToken, setInputToken] = useState("");
  const [inputPageId, setInputPageId] = useState("");
  const [submittingToken, setSubmittingToken] = useState(false);

  const loadPages = useCallback(async () => {
    setLoading(true);
    try {
      const data = await facebookApi.getPages();
      setPages(Array.isArray(data) ? data : []);
    } catch (err) {
      setNotification({
        type: "error",
        text: err.message || "ফেসবুক পেজের তথ্য লোড করা যায়নি।",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const loadArticles = useCallback(async () => {
    setLoadingArticles(true);
    try {
      const articles = await articlesApi.list();
      const list = Array.isArray(articles) ? articles : [];
      setRecentArticles(list.filter((a) => a.status === "PUBLISHED").slice(0, 10));
    } catch (err) {
      console.error("Failed loading recent articles:", err);
    } finally {
      setLoadingArticles(false);
    }
  }, []);

  useEffect(() => {
    loadPages();
    loadArticles();
  }, [loadPages, loadArticles]);

  const handleConnectOAuth = async () => {
    setConnecting(true);
    try {
      const res = await facebookApi.getAuthUrl();
      if (res?.auth_url) {
        window.location.href = res.auth_url;
      }
    } catch (err) {
      setNotification({
        type: "error",
        text: err.message || "ফেসবুক কানেক্ট URL আনতে সমস্যা হয়েছে।",
      });
      setConnecting(false);
    }
  };

  const handleManualTokenSubmit = async (e) => {
    e.preventDefault();
    if (!inputToken.trim()) return;
    setSubmittingToken(true);
    try {
      await facebookApi.connectWithToken({
        access_token: inputToken.trim(),
        page_id: inputPageId.trim() || undefined,
      });
      setTokenModalOpen(false);
      setInputToken("");
      setInputPageId("");
      setNotification({
        type: "success",
        text: "ফেসবুক পেজ সফলভাবে যুক্ত করা হয়েছে।",
      });
      loadPages();
    } catch (err) {
      alert(err.message || "পেজ যুক্ত করা যায়নি। টোকেনটি সঠিক কি না যাচাই করুন।");
    } finally {
      setSubmittingToken(false);
    }
  };

  const handleToggleAutoPost = async (page) => {
    try {
      const updated = await facebookApi.updatePage(page.id, { auto_post: !page.auto_post });
      setPages((prev) => prev.map((p) => (p.id === page.id ? { ...p, auto_post: updated.auto_post } : p)));
    } catch (err) {
      alert(err.message || "অটো-পোস্ট পরিবর্তন ব্যর্থ হয়েছে");
    }
  };

  const handleDisconnect = async (id) => {
    if (!confirm("আপনি কি নিশ্চিতভাবে এই পেজটি সংযোগ বিচ্ছিন্ন করতে চান?")) return;
    try {
      await facebookApi.disconnectPage(id);
      setPages((prev) => prev.filter((p) => p.id !== id));
      setNotification({ type: "success", text: "পেজ সফলভাবে বিচ্ছিন্ন করা হয়েছে।" });
    } catch (err) {
      alert(err.message || "বিচ্ছিন্ন করা যায়নি");
    }
  };

  const handlePublish = async (slug) => {
    setPublishingSlug(slug);
    try {
      const res = await facebookApi.publishToFacebook(slug);
      const success = res?.results?.some((r) => r.status === "SUCCESS");
      if (success) {
        setNotification({
          type: "success",
          text: "সংবাদটি ফেসবুকে সফলভাবে পোস্ট করা হয়েছে!",
        });
        loadArticles();
      } else {
        const errorMsg = res?.results?.[0]?.error || res?.detail || "পোস্ট ব্যর্থ হয়েছে";
        setNotification({ type: "error", text: errorMsg });
      }
    } catch (err) {
      setNotification({ type: "error", text: err.message || "পোস্ট করা যায়নি" });
    } finally {
      setPublishingSlug(null);
    }
  };

  const handlePreviewPhotocard = async (slug) => {
    try {
      const res = await facebookApi.generatePhotocard(slug);
      if (res?.share_card_url || res?.photocard_url) {
        setPreviewCardUrl(res.share_card_url || res.photocard_url);
      } else {
        alert("ফটোকার্ড প্রিভিউ পাওয়া যায়নি।");
      }
    } catch (err) {
      alert(err.message || "ফটোকার্ড তৈরি করা যায়নি।");
    }
  };

  return (
    <AdminLayout>
      <PageHeader
        title="ফেসবুক পেজ ইন্টিগ্রেশন"
        description="ফেসবুক পেজ যুক্ত করে প্রকাশিত সংবাদের স্বয়ংক্রিয় ফটোকার্ড ও পোস্ট শেয়ার করুন"
      >
        <Button variant="outline" size="sm" onClick={loadPages} disabled={loading}>
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          রিফ্রেশ
        </Button>
      </PageHeader>

      {notification && (
        <div
          className={`mb-6 p-4 rounded-lg border text-sm flex items-center justify-between gap-3 ${
            notification.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-red-50 border-red-200 text-red-800"
          }`}
        >
          <div className="flex items-center gap-2">
            {notification.type === "success" ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
            )}
            <span>{notification.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setNotification(null)}
            className="text-xs font-semibold underline cursor-pointer"
          >
            বন্ধ
          </button>
        </div>
      )}

      {/* Connected Pages Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-neutral-900">যুক্ত ফেসবুক পেজসমূহ</h2>
          <div className="flex gap-2">
            <Button
              variant="default"
              size="sm"
              onClick={handleConnectOAuth}
              disabled={connecting}
              className="bg-[#1877F2] hover:bg-[#166fe5] text-white"
            >
              <FacebookIcon size={16} className="w-4 h-4" />
              {connecting ? "কানেক্ট হচ্ছে…" : "ফেসবুক দিয়ে যুক্ত করুন"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setTokenModalOpen(true)}
            >
              <Key className="w-4 h-4" />
              টোকেন দিয়ে যুক্ত
            </Button>
          </div>
        </div>

        <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden shadow-sm">
          {loading ? (
            <div className="p-8 text-center text-sm text-neutral-400">পেজ তালিকা লোড হচ্ছে…</div>
          ) : pages.length === 0 ? (
            <div className="p-8 text-center text-neutral-500 text-sm">
              এখনো কোনো ফেসবুক পেজ যুক্ত করা হয়নি। উপরে বোতামে ক্লিক করে পেজ সংযুক্ত করুন।
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-neutral-50/80 border-b text-neutral-600 uppercase font-semibold">
                    <th className="px-4 py-3">পেজের নাম</th>
                    <th className="px-4 py-3">Page ID</th>
                    <th className="px-4 py-3">অটো-পোস্ট</th>
                    <th className="px-4 py-3">স্ট্যাটাস</th>
                    <th className="px-4 py-3 text-right">পদক্ষেপ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  {pages.map((p) => (
                    <tr key={p.id} className="hover:bg-neutral-50">
                      <td className="px-4 py-3 font-semibold text-neutral-900">{p.page_name}</td>
                      <td className="px-4 py-3 font-mono text-neutral-500">{p.page_id}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={Boolean(p.auto_post)}
                            onCheckedChange={() => handleToggleAutoPost(p)}
                          />
                          <span className="text-[11px] text-neutral-500">
                            {p.auto_post ? "চালু" : "বন্ধ"}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={p.is_active ? "success" : "secondary"}>
                          {p.is_active ? "সক্রিয়" : "নিষ্ক্রিয়"}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          type="button"
                          onClick={() => handleDisconnect(p.id)}
                          className="p-1.5 text-red-500 hover:text-red-700 rounded hover:bg-red-50"
                          title="সংযোগ বিচ্ছিন্ন করুন"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Manual Article Sharing Section */}
      <div>
        <h2 className="text-base font-bold text-neutral-900 mb-2">ম্যানুয়াল ফেসবুক পোস্ট ও প্রিভিউ</h2>
        <p className="text-xs text-neutral-500 mb-4">
          সাম্প্রতিক প্রকাশিত সংবাদসমূহ অবিলম্বে আপনার ফেসবুক পেজে শেয়ার করুন।
        </p>

        <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden shadow-sm">
          {loadingArticles ? (
            <div className="p-8 text-center text-sm text-neutral-400">সংবাদ লোড হচ্ছে…</div>
          ) : recentArticles.length === 0 ? (
            <div className="p-8 text-center text-sm text-neutral-400">
              কোনো প্রকাশিত সংবাদ পাওয়া যায়নি।
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-neutral-50/80 border-b text-neutral-600 uppercase font-semibold">
                    <th className="px-4 py-3">শিরোনাম</th>
                    <th className="px-4 py-3">বিভাগ</th>
                    <th className="px-4 py-3">ফেসবুক স্ট্যাটাস</th>
                    <th className="px-4 py-3 text-right">পদক্ষেপ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  {recentArticles.map((art) => (
                    <tr key={art.id} className="hover:bg-neutral-50">
                      <td className="px-4 py-3 max-w-md">
                        <p className="font-semibold text-neutral-900 line-clamp-1">{art.title}</p>
                      </td>
                      <td className="px-4 py-3 text-neutral-500 whitespace-nowrap">
                        {art.category?.name || "N/A"}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {art.facebook_posted ? (
                          <div className="flex items-center gap-1.5 text-emerald-700">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>পোস্ট হয়েছে</span>
                            {art.facebook_post_url && (
                              <a
                                href={art.facebook_post_url}
                                target="_blank"
                                rel="noreferrer"
                                className="text-blue-600 hover:underline inline-flex items-center ml-1"
                              >
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            )}
                          </div>
                        ) : (
                          <span className="text-neutral-400">পোস্ট হয়নি</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handlePreviewPhotocard(art.slug)}
                            className="inline-flex items-center gap-1 text-xs text-neutral-600 hover:text-neutral-900 border px-2 py-1 rounded hover:bg-neutral-100"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            ফটোকার্ড
                          </button>
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() => handlePublish(art.slug)}
                            disabled={publishingSlug === art.slug || pages.length === 0}
                            className="text-xs h-7 px-2.5"
                          >
                            <Send className="w-3 h-3" />
                            {publishingSlug === art.slug ? "পোস্ট হচ্ছে…" : "পোস্ট করুন"}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Photocard Preview Dialog */}
      <Dialog
        open={Boolean(previewCardUrl)}
        onOpenChange={(open) => !open && setPreviewCardUrl(null)}
        title="স্বয়ংক্রিয় ফটোকার্ড প্রিভিউ"
        description="ফেসবুকে পোস্ট করার সময় এই ছবিটি সংযুক্ত হবে।"
        footer={
          <Button variant="outline" onClick={() => setPreviewCardUrl(null)}>
            বন্ধ করুন
          </Button>
        }
      >
        {previewCardUrl && (
          <div className="text-center">
            <img
              src={previewCardUrl}
              alt="ফটোকার্ড"
              className="w-full max-h-[420px] object-contain rounded border mx-auto shadow-sm"
            />
          </div>
        )}
      </Dialog>

      {/* Manual Token Dialog */}
      <Dialog
        open={tokenModalOpen}
        onOpenChange={setTokenModalOpen}
        title="ম্যানুয়াল পেজ অ্যাক্সেস টোকেন"
        description="ফেসবুক ডেভেলপার ড্যাশবোর্ড থেকে পাওয়া Page Access Token লিখুন।"
      >
        <form onSubmit={handleManualTokenSubmit} className="space-y-4 pt-2">
          <div>
            <Label htmlFor="token">Page Access Token *</Label>
            <Input
              id="token"
              required
              value={inputToken}
              onChange={(e) => setInputToken(e.target.value)}
              placeholder="EAA..."
            />
          </div>
          <div>
            <Label htmlFor="pageId">Page ID (ঐচ্ছিক)</Label>
            <Input
              id="pageId"
              value={inputPageId}
              onChange={(e) => setInputPageId(e.target.value)}
              placeholder="1234567890..."
            />
          </div>
          <div className="flex justify-end gap-2 pt-3 border-t">
            <Button type="button" variant="outline" onClick={() => setTokenModalOpen(false)}>
              বাতিল
            </Button>
            <Button type="submit" disabled={submittingToken}>
              {submittingToken ? "যুক্ত হচ্ছে…" : "সংযুক্ত করুন"}
            </Button>
          </div>
        </form>
      </Dialog>
    </AdminLayout>
  );
}
