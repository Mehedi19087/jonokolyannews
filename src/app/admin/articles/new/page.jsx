"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AdminLayout, PageHeader } from "@/components/admin/AdminLayout.jsx";
import { isEditorRole, articlesApi, categoriesApi } from "@/lib/api-client.js";
import { useAdminAuth } from "@/lib/admin-auth.js";
import { Button, Input, Label, Textarea, Select, Switch } from "@/components/admin/ui.jsx";
import { districts } from "@/lib/districts.js";
import { Send, CheckCircle2, Save, ImagePlus, X, ArrowLeft } from "lucide-react";

const MAX_IMAGE_SIZE = 8 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

export default function NewArticlePage() {
  const router = useRouter();
  const { user } = useAdminAuth();
  const [cats, setCats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [districtSlug, setDistrictSlug] = useState("none");
  const [isBreaking, setIsBreaking] = useState(false);
  const [aiSummary, setAiSummary] = useState("");
  const [audioFileUrl, setAudioFileUrl] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const isEditor = isEditorRole(user?.role);

  useEffect(() => {
    categoriesApi
      .list()
      .then((c) => {
        const list = Array.isArray(c) ? c : [];
        setCats(list);
        if (list.length > 0) setCategoryId(String(list[0].id));
      })
      .catch((err) => setError(err.message || "ক্যাটাগরি লোড ব্যর্থ"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  const handleImageChange = (file) => {
    if (!file) return;
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      setError("শুধু JPG, PNG অথবা WebP ছবি আপলোড করুন");
      return;
    }
    if (file.size > MAX_IMAGE_SIZE) {
      setError("ছবির আকার সর্বোচ্চ ৮ MB হতে পারবে");
      return;
    }

    setError(null);
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreview("");
  };

  const handleCreate = async (e, mode) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || !categoryId) {
      setError("সবগুলো আবশ্যক ঘর পূরণ করুন");
      return;
    }
    if (content.trim().length < 50) {
      setError("সংবাদের মূল লেখা অন্তত ৫০ অক্ষরের হতে হবে");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const form = new FormData();
      form.append("title", title.trim());
      form.append("content", content.trim());
      form.append("category_id", categoryId);
      if (districtSlug && districtSlug !== "none") {
        form.append("districts", districtSlug);
      }
      form.append("is_breaking", String(isBreaking));
      if (aiSummary.trim()) form.append("ai_summary", aiSummary.trim());
      if (audioFileUrl.trim()) form.append("audio_file_url", audioFileUrl.trim());
      if (imageFile) form.append("image", imageFile);

      const created = await articlesApi.createWithImage(form);

      if (mode === "SUBMIT") {
        await articlesApi.submit(created.slug);
      } else if (mode === "PUBLISH" && isEditor) {
        await articlesApi.submit(created.slug);
        await articlesApi.approve(created.slug);
      }

      router.push(
        `/admin/articles?status=${
          mode === "SUBMIT" ? "PENDING" : mode === "PUBLISH" ? "PUBLISHED" : "DRAFT"
        }`
      );
    } catch (err) {
      setError(err.message || "পোস্ট তৈরি ব্যর্থ হয়েছে");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminLayout>
      <PageHeader
        title="নতুন পোস্ট তৈরি করুন"
        description="আপনার প্রতিবেদন লিখুন এবং ছবি সংযুক্ত করুন"
      >
        <Link href="/admin/articles">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4" />
            তালিকায় ফিরুন
          </Button>
        </Link>
      </PageHeader>

      <form className="space-y-6 max-w-4xl bg-white border border-neutral-200 rounded-lg p-6 shadow-sm">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded text-sm">
            {error}
          </div>
        )}

        <div>
          <Label htmlFor="title">সংবাদের শিরোনাম *</Label>
          <Input
            id="title"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="আকর্ষণীয় ও স্পষ্ট শিরোনাম লিখুন…"
            className="text-base font-semibold"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="category">ক্যাটাগরি (বিভাগ) *</Label>
            <Select
              id="category"
              value={categoryId}
              onChange={setCategoryId}
              options={cats.map((c) => ({ value: String(c.id), label: c.name }))}
            />
          </div>
          <div>
            <Label htmlFor="district">জেলা (প্রযোজ্য ক্ষেত্রে)</Label>
            <Select
              id="district"
              value={districtSlug}
              onChange={setDistrictSlug}
              options={[
                { value: "none", label: "কোনো জেলা নয় / জাতীয়" },
                ...districts.map((d) => ({ value: d.slug, label: d.name })),
              ]}
            />
          </div>
        </div>

        {/* Featured Image */}
        <div>
          <Label>ফিচার ছবি</Label>
          {imagePreview ? (
            <div className="relative border rounded-lg overflow-hidden bg-neutral-100 max-w-md">
              <img src={imagePreview} alt="প্রিভিউ" className="w-full h-48 object-cover" />
              <button
                type="button"
                onClick={clearImage}
                className="absolute top-2 right-2 bg-black/70 hover:bg-black text-white p-1 rounded-full cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-neutral-300 hover:border-neutral-400 rounded-lg p-6 cursor-pointer bg-neutral-50/50 hover:bg-neutral-50 transition-colors">
              <ImagePlus className="w-8 h-8 text-neutral-400 mb-2" />
              <span className="text-sm font-medium text-neutral-700">ছবি নির্বাচন করতে ক্লিক করুন</span>
              <span className="text-xs text-neutral-400 mt-1">সর্বোচ্চ ৮ MB (JPG, PNG, WebP)</span>
              <input
                type="file"
                accept={ACCEPTED_IMAGE_TYPES.join(",")}
                onChange={(e) => handleImageChange(e.target.files?.[0] || null)}
                className="hidden"
              />
            </label>
          )}
        </div>

        {/* Content */}
        <div>
          <Label htmlFor="content">মূল সংবাদ * (ন্যূনতম ৫০ অক্ষর)</Label>
          <Textarea
            id="content"
            required
            rows={12}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="সংবাদের সম্পূর্ণ বিবরণ অনুচ্ছেদ আকারে লিখুন…"
            className="font-serif text-base leading-relaxed"
          />
          <p className="text-xs text-neutral-400 mt-1 text-right">
            অক্ষর সংখ্যা: {content.length}
          </p>
        </div>

        {/* AI Summary and Audio URL */}
        <div className="border-t pt-4 space-y-4">
          <div>
            <Label htmlFor="ai_summary">AI সারসংক্ষেপ (ঐচ্ছিক)</Label>
            <Textarea
              id="ai_summary"
              rows={3}
              value={aiSummary}
              onChange={(e) => setAiSummary(e.target.value)}
              placeholder="সংবাদটির ৩-৪ লাইনের সংক্ষিপ্ত পয়েন্টসমূহ…"
            />
          </div>
          <div>
            <Label htmlFor="audio_url">অডিও সংবাদের লিংক (ঐচ্ছিক)</Label>
            <Input
              id="audio_url"
              type="url"
              value={audioFileUrl}
              onChange={(e) => setAudioFileUrl(e.target.value)}
              placeholder="https://example.com/audio.mp3"
            />
          </div>
        </div>

        {/* Breaking News Toggle */}
        <div className="flex items-center justify-between border-t pt-4">
          <div>
            <span className="text-sm font-semibold text-neutral-800 block">ব্রেকিং নিউজ</span>
            <span className="text-xs text-neutral-500">
              এটি সক্রিয় করলে হোমপেজে লাল ব্রেকিং টিকারে প্রদর্শিত হবে।
            </span>
          </div>
          <Switch checked={isBreaking} onCheckedChange={setIsBreaking} />
        </div>

        {/* Submission Actions */}
        <div className="flex flex-wrap items-center justify-end gap-3 border-t pt-6">
          <Button
            type="button"
            variant="outline"
            disabled={submitting}
            onClick={(e) => handleCreate(e, "DRAFT")}
          >
            <Save className="w-4 h-4" />
            ড্রাফট হিসেবে সংরক্ষণ
          </Button>

          <Button
            type="button"
            variant="secondary"
            disabled={submitting}
            onClick={(e) => handleCreate(e, "SUBMIT")}
          >
            <Send className="w-4 h-4" />
            অনুমোদনের জন্য জমা দিন
          </Button>

          {isEditor && (
            <Button
              type="button"
              variant="default"
              disabled={submitting}
              onClick={(e) => handleCreate(e, "PUBLISH")}
            >
              <CheckCircle2 className="w-4 h-4" />
              সরাসরি প্রকাশ করুন
            </Button>
          )}
        </div>
      </form>
    </AdminLayout>
  );
}
