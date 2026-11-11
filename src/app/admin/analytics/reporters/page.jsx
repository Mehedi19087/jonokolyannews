"use client";

import { useEffect, useState } from "react";
import { AdminLayout, PageHeader } from "@/components/admin/AdminLayout.jsx";
import { AnalyticsTabs } from "@/components/admin/AnalyticsTabs.jsx";
import { analyticsApi } from "@/lib/api-client.js";

export default function ReportersAnalyticsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    analyticsApi
      .reporters()
      .then((data) => setItems(Array.isArray(data) ? data : []))
      .catch((e) => setError(e.message || "লোড ব্যর্থ"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AdminLayout>
      <PageHeader
        title="রিপোর্টার লিডারবোর্ড"
        description="প্রত্যেক রিপোর্টারের মোট ভিউ ও প্রকাশিত সংবাদের সংখ্যা"
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
                  <th className="px-4 py-3">রিপোর্টার</th>
                  <th className="px-4 py-3 text-right">আর্টিকেল সংখ্যা</th>
                  <th className="px-4 py-3 text-right">মোট ভিউ</th>
                  <th className="px-4 py-3 text-right">গড় ভিউ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {items.map((it, idx) => (
                  <tr key={it.article__author_id || idx} className="hover:bg-neutral-50">
                    <td className="px-4 py-3 text-neutral-400 font-mono">{idx + 1}</td>
                    <td className="px-4 py-3 font-medium text-neutral-900">
                      {it.article__author__email}
                    </td>
                    <td className="px-4 py-3 text-right font-mono">
                      {it.articles?.toLocaleString("bn-BD")}
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-neutral-900 font-mono">
                      {it.views?.toLocaleString("bn-BD")}
                    </td>
                    <td className="px-4 py-3 text-right text-neutral-600 font-mono">
                      {it.articles ? Math.round(it.views / it.articles).toLocaleString("bn-BD") : "—"}
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
