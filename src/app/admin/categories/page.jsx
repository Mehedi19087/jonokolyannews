"use client";

import { useEffect, useState } from "react";
import { Trash2, Pencil, Plus, X, RefreshCw } from "lucide-react";
import { AdminLayout, PageHeader } from "@/components/admin/AdminLayout.jsx";
import { categoriesApi } from "@/lib/api-client.js";
import { Button, Input, Label } from "@/components/admin/ui.jsx";

export default function CategoriesPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(null);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");

  const load = () => {
    setLoading(true);
    setError(null);
    categoriesApi
      .list()
      .then((data) => setItems(Array.isArray(data) ? data : []))
      .catch((e) => setError(e.message || "ক্যাটাগরি লোড ব্যর্থ"))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const reset = () => {
    setEditing(null);
    setName("");
    setSlug("");
  };

  const startEdit = (cat) => {
    setEditing(cat);
    setName(cat.name);
    setSlug(cat.slug);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      if (editing) {
        await categoriesApi.update(editing.slug, { name: name.trim(), slug: slug.trim() || undefined });
      } else {
        await categoriesApi.create({ name: name.trim(), slug: slug.trim() || undefined });
      }
      reset();
      load();
    } catch (err) {
      setError(err.message || "সংরক্ষণ ব্যর্থ হয়েছে");
    }
  };

  const onDelete = async (c) => {
    if (!confirm(`"${c.name}" ক্যাটাগরিটি মুছে ফেলতে চান?`)) return;
    setError(null);
    try {
      await categoriesApi.remove(c.slug);
      load();
    } catch (err) {
      setError(err.message || "মুছে ফেলা ব্যর্থ হয়েছে");
    }
  };

  return (
    <AdminLayout>
      <PageHeader
        title="ক্যাটাগরি ব্যবস্থাপনা"
        description="সংবাদ বিভাগ ও ক্যাটাগরি তৈরি, সম্পাদনা ও সাজান"
      >
        <Button variant="outline" size="sm" onClick={load} disabled={loading}>
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          রিফ্রেশ
        </Button>
      </PageHeader>

      {error && (
        <div className="mb-4 p-3 rounded border border-red-200 bg-red-50 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Column */}
        <form onSubmit={onSubmit} className="bg-white rounded-lg border border-neutral-200 p-5 space-y-4 h-fit shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-neutral-900 text-sm">
              {editing ? "ক্যাটাগরি সম্পাদনা" : "নতুন ক্যাটাগরি যোগ"}
            </h2>
            {editing && (
              <button
                type="button"
                onClick={reset}
                className="text-neutral-400 hover:text-neutral-700 p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <div>
            <Label htmlFor="name">নাম *</Label>
            <Input
              id="name"
              required
              placeholder="যেমন: রাজনীতি"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="slug">স্লাগ (ঐচ্ছিক)</Label>
            <Input
              id="slug"
              placeholder="যেমন: politics"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 pt-2">
            <Button type="submit" className="w-full">
              {editing ? (
                <>
                  <Pencil className="w-4 h-4" />
                  আপডেট করুন
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  ক্যাটাগরি তৈরি করুন
                </>
              )}
            </Button>
            {editing && (
              <Button type="button" variant="outline" onClick={reset}>
                বাতিল
              </Button>
            )}
          </div>
        </form>

        {/* List Column */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-neutral-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b bg-neutral-50/80 text-neutral-600 font-semibold uppercase tracking-wider">
                  <th className="px-4 py-3">নাম</th>
                  <th className="px-4 py-3">স্লাগ</th>
                  <th className="px-4 py-3 text-right">পদক্ষেপ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {loading ? (
                  <tr>
                    <td colSpan={3} className="px-4 py-8 text-center text-neutral-400">
                      লোড হচ্ছে…
                    </td>
                  </tr>
                ) : items.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-4 py-8 text-center text-neutral-400">
                      কোনো ক্যাটাগরি তৈরি করা হয়নি।
                    </td>
                  </tr>
                ) : (
                  items.map((c) => (
                    <tr key={c.id || c.slug} className="hover:bg-neutral-50 transition-colors">
                      <td className="px-4 py-3 font-semibold text-neutral-900">{c.name}</td>
                      <td className="px-4 py-3 font-mono text-neutral-500">{c.slug}</td>
                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => startEdit(c)}
                            className="p-1.5 text-neutral-500 hover:text-neutral-900 rounded hover:bg-neutral-100"
                            title="সম্পাদনা"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onDelete(c)}
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
      </div>
    </AdminLayout>
  );
}
