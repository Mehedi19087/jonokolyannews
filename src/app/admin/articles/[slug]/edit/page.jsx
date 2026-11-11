"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AdminLayout, PageHeader } from "@/components/admin/AdminLayout.jsx";
import { isEditorRole, articlesApi, categoriesApi } from "@/lib/api-client.js";
import { useAdminAuth } from "@/lib/admin-auth.js";
import { Button, Input, Label, Textarea, Select, Switch } from "@/components/admin/ui.jsx";
import { districts } from "@/lib/districts.js";
import { Save, Send, CheckCircle2, ImagePlus, X, ArrowLeft } from "lucide-react";

const MAX_IMAGE_SIZE = 8 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

export default function EditArticlePage() {
  const params = useParams();
  const slug = params?.slug ? decodeURIComponent(params.slug) : "";
  const router = useRouter();
  const { user } = useAdminAuth();

  const [article, setArticle] = useState(null);
  const [cats, setCats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [districtSlug, setDistrictSlug] = useState("none");
  const [isBreaking, setIsBreaking] = useState(false);
  const [aiSummary, setAiSummary] = useState("");
  const [audioFileUrl, setAudioFileUrl] = useState("");
  const [currentImage, setCurrentImage] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const isEditor = isEditorRole(user?.role);

  useEffect(() => {
    if (!slug) return;
    Promise.all([articlesApi.get(slug), categoriesApi.list()])
      .then(([art, c]) => {
        setArticle(art);
        setCats(Array.isArray(c) ? c : []);
        setTitle(art.title || "");
        setContent(art.content || "");
        setCategoryId(art.category ? String(art.category.id) : "");
        setDistrictSlug(art.districts?.[0]?.slug || "none");
        setIsBreaking(Boolean(art.is_breaking));
        setAiSummary(art.ai_summary || "");
        setAudioFileUrl(art.audio_file_url || "");
        setCurrentImage(art.featured_image_url || "");
      })
      .catch((err) => setError(err.message || "পোস্ট লোড করা যায়নি"))
      .finally(() => setLoading(false));
  }, [slug]);

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
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleUpdate = async (e, mode) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || !categoryId) {
      setError("আবশ্যক সব ঘর পূরণ করুন");
      return;
    }

    setSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      if (imageFile) {
        const form = new FormData();
        form.append("title", title.trim());
        form.append("content", content.trim());
        form.append("category_id", categoryId);
        if (districtSlug && districtSlug !== "none") {
          form.append("districts", districtSlug);
        }
        form.append("is_breaking", String(isBreaking));
        form.append("ai_summary", aiSummary.trim());
        form.append("audio_file_url", audioFileUrl.trim());
        form.append("image", imageFile);
        await articlesApi.updateWithImage(slug, form);
      } else {
        await articlesApi.update(slug, {
          title: title.trim(),
          content: content.trim(),
          category_id: Number(categoryId),
          is_breaking: isBreaking,
          ai_summary: aiSummary.trim(),
          audio_file_url: audioFileUrl.trim(),
        });
      }

      if (mode === "SUBMIT") {
        await articlesApi.submit(slug);
      } else if (mode === "PUBLISH" && isEditor) {
        await articlesApi.submit(slug);
        await articlesApi.approve(slug);
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/admin/articles");
      }, 1200);
    } catch (err) {
      setError(err.message || "সংবাদ আপডেট ব্যর্থ হয়েছে");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-12 text-center text-sm text-neutral-500">লোড হচ্ছে…</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <PageHeader title="পোস্ট সম্পাদনা" description={article?.title}>
        <Link href="/admin/articles">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4" />
            তালিকায় ফিরুন
          </Button>
        </Link>
      </PageHeader>

      <form className="space-y-6 max-w-4xl bg-white border border-neutral-200 rounded-lg p-6 shadow-sm">
        {success && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded text-sm">
            পোস্ট সফলভাবে আপডেট হয়েছে! তালিকায় ফিরিয়ে নেওয়া হচ্ছে…
          </div>
        )}
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
            className="text-base font-semibold"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="category">ক্যাটাগরি *</Label>
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
          {imagePreview || currentImage ? (
            <div className="relative border rounded-lg overflow-hidden bg-neutral-100 max-w-md">
              <img
                src={imagePreview || currentImage}
                alt="প্রিভিউ"
                className="w-full h-48 object-cover"
              />
              <button
                type="button"
                onClick={() => {
                  setImageFile(null);
                  setImagePreview("");
                  setCurrentImage("");
                }}
                className="absolute top-2 right-2 bg-black/70 hover:bg-black text-white p-1 rounded-full cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-neutral-300 hover:border-neutral-400 rounded-lg p-6 cursor-pointer bg-neutral-50/50 hover:bg-neutral-50 transition-colors">
              <ImagePlus className="w-8 h-8 text-neutral-400 mb-2" />
              <span className="text-sm font-medium text-neutral-700">নতুন ছবি বাছাই করুন</span>
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
          <Label htmlFor="content">মূল সংবাদ *</Label>
          <Textarea
            id="content"
            required
            rows={12}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="font-serif text-base leading-relaxed"
          />
        </div>

        {/* AI Summary and Audio URL */}
        <div className="border-t pt-4 space-y-4">
          <div>
            <Label htmlFor="ai_summary">AI সারসংক্ষেপ</Label>
            <Textarea
              id="ai_summary"
              rows={3}
              value={aiSummary}
              onChange={(e) => setAiSummary(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="audio_url">অডিও সংবাদের লিংক</Label>
            <Input
              id="audio_url"
              type="url"
              value={audioFileUrl}
              onChange={(e) => setAudioFileUrl(e.target.value)}
            />
          </div>
        </div>

        {/* Breaking News Toggle */}
        <div className="flex items-center justify-between border-t pt-4">
          <div>
            <span className="text-sm font-semibold text-neutral-800 block">ব্রেকিং নিউজ</span>
            <span className="text-xs text-neutral-500">হোমপেজে ব্রেকিং ব্যানারে দেখাবে।</span>
          </div>
          <Switch checked={isBreaking} onCheckedChange={setIsBreaking} />
        </div>

        {/* Update Actions */}
        <div className="flex flex-wrap items-center justify-end gap-3 border-t pt-6">
          <Button
            type="button"
            variant="outline"
            disabled={submitting}
            onClick={(e) => handleUpdate(e, "SAVE")}
          >
            <Save className="w-4 h-4" />
            আপডেট সংরক্ষণ
          </Button>

          {article?.status === "DRAFT" && (
            <Button
              type="button"
              variant="secondary"
              disabled={submitting}
              onClick={(e) => handleUpdate(e, "SUBMIT")}
            >
              <Send className="w-4 h-4" />
              অনুমোদনের জন্য জমা দিন
            </Button>
          )}

          {isEditor && article?.status !== "PUBLISHED" && (
            <Button
              type="button"
              variant="default"
              disabled={submitting}
              onClick={(e) => handleUpdate(e, "PUBLISH")}
            >
              <CheckCircle2 className="w-4 h-4" />
              প্রকাশ করুন
            </Button>
          )}
        </div>
      </form>
    </AdminLayout>
  );
}
