"use client";

import { useEffect, useState } from "react";
import { AdminLayout, PageHeader } from "@/components/admin/AdminLayout.jsx";
import { AnalyticsTabs } from "@/components/admin/AnalyticsTabs.jsx";
import { analyticsApi } from "@/lib/api-client.js";

export default function TrafficReferrersAnalyticsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    analyticsApi
      .referrers()
      .then((data) => setItems(Array.isArray(data) ? data : []))
      .catch((e) => setError(e.message || "লোড ব্যর্থ"))
      .finally(() => setLoading(false));
  }, []);

  const total = items.reduce((s, x) => s + (x.views || 0), 0) || 1;

  return (
    <AdminLayout>
      <PageHeader
        title="ট্রাফিক সোর্স"
        description="পাঠক কোন কোন উৎস (Facebook, Google, Direct) থেকে আসছেন"
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
          কোনো রেফারার তথ্য পাওয়া যায়নি।
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-neutral-200 p-6 space-y-4 shadow-sm max-w-3xl">
          {items.map((it) => {
            const pct = ((it.views || 0) / total) * 100;
            return (
              <div key={it.referrer || "direct"}>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="font-semibold text-neutral-900">{it.referrer || "direct (সরাসরি)"}</span>
                  <span className="text-neutral-500 font-mono">
                    {(it.views || 0).toLocaleString("bn-BD")} ভিউ ({pct.toFixed(1)}%)
                  </span>
                </div>
                <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                  <div className="h-full bg-red-600 rounded-full" style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </AdminLayout>
  );
}
