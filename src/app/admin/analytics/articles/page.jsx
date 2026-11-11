"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AdminLayout, PageHeader } from "@/components/admin/AdminLayout.jsx";
import { AnalyticsTabs } from "@/components/admin/AnalyticsTabs.jsx";
import { analyticsApi } from "@/lib/api-client.js";

export default function TopArticlesAnalyticsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    analyticsApi
      .articles()
      .then((data) => setItems(Array.isArray(data) ? data : []))
      .catch((e) => setError(e.message || "লোড ব্যর্থ"))
      .finally(() => setLoading(false));
  }, []);

  const max = Math.max(...items.map((i) => i.views || 0), 1);

  return (
    <AdminLayout>
      <PageHeader
        title="টপ আর্টিকেল"
        description="সবচেয়ে বেশি পঠিত সংবাদসমূহের তালিকা"
      />
      <AnalyticsTabs />

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded">
          {error}
        </div>
      )}

      {loading ? (
        <div className="p-8 text-center text-sm text-neutral-400">লোড হচ্ছে…</div>
      ) : items.length === 0 ? (
        <div className="bg-white border rounded-lg p-8 text-center text-sm text-neutral-400">
          কোনো তথ্য পাওয়া যায়নি।
        </div>
      ) : (
        <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-neutral-50/80 border-b text-neutral-600 uppercase font-semibold">
                  <th className="px-4 py-3 w-12">#</th>
                  <th className="px-4 py-3">শিরোনাম</th>
                  <th className="px-4 py-3 w-64 text-right">ভিউ সংখ্যা</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {items.map((it, idx) => (
                  <tr key={it.article_id || idx} className="hover:bg-neutral-50">
                    <td className="px-4 py-3 text-neutral-400 font-mono">{idx + 1}</td>
                    <td className="px-4 py-3 font-medium text-neutral-900">
                      <Link
                        href={`/news/${encodeURIComponent(it.article__slug)}`}
                        target="_blank"
                        className="hover:underline hover:text-red-600 transition-colors"
                      >
                        {it.article__title}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <div className="flex-1 max-w-[140px] h-2 bg-neutral-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-red-600 rounded-full"
                            style={{ width: `${Math.min(100, ((it.views || 0) / max) * 100)}%` }}
                          />
                        </div>
                        <span className="font-bold text-neutral-900 tabular-nums">
                          {(it.views || 0).toLocaleString("bn-BD")}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
