"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Pencil, ImagePlus, RefreshCw, X, ExternalLink } from "lucide-react";
import { AdminLayout, PageHeader } from "@/components/admin/AdminLayout.jsx";
import { adsApi } from "@/lib/api-client.js";
import { Button, Input, Label, Select, Switch, Badge } from "@/components/admin/ui.jsx";

const SLOTS = [
  { value: "BANNER_TOP", label: "হেডার ব্যানার (Banner Top)" },
  { value: "SIDEBAR", label: "সাইডবার (Sidebar)" },
  { value: "IN_ARTICLE", label: "সংবাদের ভেতর (In Article)" },
];

export default function AdsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("ALL");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [title, setTitle] = useState("");
  const [slot, setSlot] = useState("BANNER_TOP");
  const [targetUrl, setTargetUrl] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    setError(null);
    adsApi
      .adminList(filter === "ALL" ? undefined : filter)
      .then((data) => setItems(Array.isArray(data) ? data : []))
      .catch((e) => setError(e.message || "বিজ্ঞাপন লোড ব্যর্থ"))
      .finally(() => setLoading(false));
  };

  useEffect(load, [filter]);

  const resetForm = () => {
    setEditingId(null);
    setTitle("");
    setSlot("BANNER_TOP");
    setTargetUrl("");
    setIsActive(true);
    setImageFile(null);
    setImagePreview("");
    setShowForm(false);
  };

  const startEdit = (ad) => {
    setEditingId(ad.id);
    setTitle(ad.title || "");
    setSlot(ad.slot || "BANNER_TOP");
    setTargetUrl(ad.target_url || "");
    setIsActive(Boolean(ad.is_active));
    setImagePreview(ad.image_url || "");
    setShowForm(true);
  };

  const handleImageChange = (file) => {
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("বিজ্ঞাপনের শিরোনাম আবশ্যক");
      return;
    }
    if (!editingId && !imageFile) {
      setError("বিজ্ঞাপনের ছবি আপলোড করা আবশ্যক");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      if (imageFile) {
        const form = new FormData();
        form.append("title", title.trim());
        form.append("slot", slot);
        form.append("target_url", targetUrl.trim());
        form.append("is_active", String(isActive));
        form.append("image", imageFile);

        if (editingId) {
          await adsApi.updateWithImage(editingId, form);
        } else {
          await adsApi.createWithImage(form);
        }
      } else {
        await adsApi.update(editingId, {
          title: title.trim(),
          slot,
          target_url: targetUrl.trim(),
          is_active: isActive,
        });
      }

      resetForm();
      load();
    } catch (err) {
      setError(err.message || "বিজ্ঞাপন সংরক্ষণ ব্যর্থ হয়েছে");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("আপনি কি নিশ্চিতভাবে এই বিজ্ঞাপনটি মুছে ফেলতে চান?")) return;
    try {
      await adsApi.remove(id);
      setItems((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      alert(err.message || "মুছে ফেলা ব্যর্থ হয়েছে");
    }
  };

  const handleToggle = async (ad) => {
    try {
      const updated = await adsApi.update(ad.id, { is_active: !ad.is_active });
      setItems((prev) => prev.map((a) => (a.id === ad.id ? { ...a, is_active: updated.is_active } : a)));
    } catch (err) {
      alert(err.message || "স্ট্যাটাস পরিবর্তন ব্যর্থ হয়েছে");
    }
  };

  return (
    <AdminLayout>
      <PageHeader
        title="বিজ্ঞাপন ব্যবস্থাপনা"
        description="ওয়েবসাইটের ব্যানার ও সাইডবার বিজ্ঞাপন নিয়ন্ত্রণ করুন"
      >
        <Button variant="outline" size="sm" onClick={load} disabled={loading}>
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          রিফ্রেশ
        </Button>
        {!showForm && (
          <Button variant="default" size="sm" onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4" />
            নতুন বিজ্ঞাপন
          </Button>
        )}
      </PageHeader>

      {error && (
        <div className="mb-4 p-3 rounded border border-red-200 bg-red-50 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* New / Edit Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="mb-8 bg-white border border-neutral-200 rounded-lg p-6 shadow-sm space-y-4 max-w-2xl">
          <div className="flex items-center justify-between border-b pb-3">
            <h2 className="font-bold text-neutral-900 text-sm">
              {editingId ? "বিজ্ঞাপন সম্পাদনা" : "নতুন বিজ্ঞাপন যোগ"}
            </h2>
            <button
              type="button"
              onClick={resetForm}
              className="p-1 text-neutral-400 hover:text-neutral-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div>
            <Label htmlFor="title">শিরোনাম *</Label>
            <Input
              id="title"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="যেমন: গ্রামীণফোন ক্যাম্পেইন"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="slot">বিজ্ঞাপনের অবস্থান *</Label>
              <Select id="slot" value={slot} onChange={setSlot} options={SLOTS} />
            </div>
            <div>
              <Label htmlFor="target_url">ক্লিক লিংক (URL)</Label>
              <Input
                id="target_url"
                type="url"
                value={targetUrl}
                onChange={(e) => setTargetUrl(e.target.value)}
                placeholder="https://example.com"
              />
            </div>
          </div>

          <div>
            <Label>বিজ্ঞাপনের ছবি *</Label>
            {imagePreview ? (
              <div className="relative border rounded p-2 bg-neutral-50 max-w-sm">
                <img src={imagePreview} alt="" className="max-h-40 object-contain mx-auto" />
                <button
                  type="button"
                  onClick={() => {
                    setImageFile(null);
                    setImagePreview("");
                  }}
                  className="absolute top-2 right-2 p-1 bg-black/70 text-white rounded-full hover:bg-black"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-neutral-300 rounded-lg p-4 cursor-pointer hover:bg-neutral-50">
                <ImagePlus className="w-6 h-6 text-neutral-400 mb-1" />
                <span className="text-xs text-neutral-600">ছবি বাছাই করুন</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageChange(e.target.files?.[0] || null)}
                  className="hidden"
                />
              </label>
            )}
          </div>

          <div className="flex items-center justify-between border-t pt-3">
            <div>
              <span className="text-xs font-semibold text-neutral-700 block">সক্রিয় বিজ্ঞাপন</span>
              <span className="text-[11px] text-neutral-400">অন করলে সাইটে প্রদর্শিত হবে</span>
            </div>
            <Switch checked={isActive} onCheckedChange={setIsActive} />
          </div>

          <div className="flex justify-end gap-2 border-t pt-4">
            <Button type="button" variant="outline" onClick={resetForm}>
              বাতিল
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? "সংরক্ষণ হচ্ছে…" : editingId ? "আপডেট করুন" : "বিজ্ঞাপন তৈরি করুন"}
            </Button>
          </div>
        </form>
      )}

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-4">
        {[{ value: "ALL", label: "সব স্লট" }, ...SLOTS].map((s) => (
          <button
            key={s.value}
            type="button"
            onClick={() => setFilter(s.value)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md border transition-colors cursor-pointer ${
              filter === s.value
                ? "bg-neutral-900 text-white border-neutral-900"
                : "bg-white text-neutral-600 hover:bg-neutral-100"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Ads List */}
      <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b bg-neutral-50/80 text-neutral-600 font-semibold uppercase tracking-wider">
                <th className="px-4 py-3">বিজ্ঞাপন</th>
                <th className="px-4 py-3">অবস্থান (Slot)</th>
                <th className="px-4 py-3">ভিউ / ক্লিক</th>
                <th className="px-4 py-3">স্ট্যাটাস</th>
                <th className="px-4 py-3 text-right">পদক্ষেপ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-neutral-400">
                    লোড হচ্ছে…
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-neutral-400">
                    কোনো বিজ্ঞাপন পাওয়া যায়নি।
                  </td>
                </tr>
              ) : (
                items.map((ad) => (
                  <tr key={ad.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {ad.image_url && (
                          <img
                            src={ad.image_url}
                            alt=""
                            className="w-12 h-12 rounded border object-contain bg-neutral-50 shrink-0"
                          />
                        )}
                        <div className="min-w-0">
                          <p className="font-semibold text-neutral-900 text-sm truncate">{ad.title}</p>
                          {ad.target_url && (
                            <a
                              href={ad.target_url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[11px] text-blue-600 hover:underline inline-flex items-center gap-1 mt-0.5 truncate max-w-xs"
                            >
                              <ExternalLink className="w-3 h-3 shrink-0" />
                              {ad.target_url}
                            </a>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-neutral-600 font-mono whitespace-nowrap">{ad.slot}</td>
                    <td className="px-4 py-3 text-neutral-600 whitespace-nowrap">
                      <span>{ad.impressions || 0} ভিউ</span> • <span>{ad.clicks || 0} ক্লিক</span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => handleToggle(ad)}
                        className="cursor-pointer"
                      >
                        {ad.is_active ? (
                          <Badge variant="success">সক্রিয়</Badge>
                        ) : (
                          <Badge variant="secondary">নিষ্ক্রিয়</Badge>
                        )}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => startEdit(ad)}
                          className="p-1.5 text-neutral-500 hover:text-neutral-900 rounded hover:bg-neutral-100"
                          title="সম্পাদনা"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(ad.id)}
                          className="p-1.5 text-red-500 hover:text-red-700 rounded hover:bg-red-50"
                          title="মুছে ফেলুন"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
