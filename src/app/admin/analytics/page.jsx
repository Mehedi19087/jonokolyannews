"use client";

import { useEffect, useState } from "react";
import { Eye, FileCheck2, Clock, Megaphone, RefreshCw } from "lucide-react";
import { AdminLayout, PageHeader } from "@/components/admin/AdminLayout.jsx";
import { AnalyticsTabs } from "@/components/admin/AnalyticsTabs.jsx";
import { analyticsApi } from "@/lib/api-client.js";
import { Button, Card, CardContent } from "@/components/admin/ui.jsx";

export default function AnalyticsOverviewPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = () => {
    setLoading(true);
    setError(null);
    analyticsApi
      .overview()
      .then(setData)
      .catch((e) => setError(e.message || "অ্যানালিটিক্স লোড ব্যর্থ"))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  return (
    <AdminLayout>
      <PageHeader
        title="অ্যানালিটিক্স ও রিপোর্ট"
        description="পোর্টালের মোট পাঠকসংখ্যা ও সংবাদ বিশ্লেষণ"
      >
        <Button variant="outline" size="sm" onClick={load} disabled={loading}>
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          রিফ্রেশ
        </Button>
      </PageHeader>

      <AnalyticsTabs />

      {error && (
        <div className="mb-4 p-3 rounded border border-red-200 bg-red-50 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="p-8 text-center text-sm text-neutral-400">লোড হচ্ছে…</div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-5 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-neutral-500 uppercase">মোট ভিউ</p>
                  <h3 className="text-2xl font-bold mt-1 text-neutral-900">
                    {data?.total_views?.toLocaleString("bn-BD") ?? 0}
                  </h3>
                </div>
                <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 grid place-items-center">
                  <Eye className="w-5 h-5" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-neutral-500 uppercase">প্রকাশিত পোস্ট</p>
                  <h3 className="text-2xl font-bold mt-1 text-neutral-900">
                    {data?.published_articles?.toLocaleString("bn-BD") ?? 0}
                  </h3>
                </div>
                <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 grid place-items-center">
                  <FileCheck2 className="w-5 h-5" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-neutral-500 uppercase">অনুমোদনের অপেক্ষায়</p>
                  <h3 className="text-2xl font-bold mt-1 text-neutral-900">
                    {data?.pending_articles?.toLocaleString("bn-BD") ?? 0}
                  </h3>
                </div>
                <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 grid place-items-center">
                  <Clock className="w-5 h-5" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-neutral-500 uppercase">সক্রিয় বিজ্ঞাপন</p>
                  <h3 className="text-2xl font-bold mt-1 text-neutral-900">
                    {data?.active_ads?.toLocaleString("bn-BD") ?? 0}
                  </h3>
                </div>
                <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-600 grid place-items-center">
                  <Megaphone className="w-5 h-5" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Daily views table if present */}
          {Array.isArray(data?.views_by_day) && data.views_by_day.length > 0 && (
            <div className="bg-white border rounded-lg overflow-hidden shadow-sm">
              <div className="p-4 border-b font-bold text-sm text-neutral-900">
                দৈনিক ভিউ পরিসংখ্যান (সর্বশেষ ৭ দিন)
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-neutral-50 border-b text-neutral-600 uppercase">
                      <th className="px-4 py-3">তারিখ</th>
                      <th className="px-4 py-3 text-right">ভিউ সংখ্যা</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200">
                    {data.views_by_day.map((row) => (
                      <tr key={row.day} className="hover:bg-neutral-50">
                        <td className="px-4 py-3 font-mono">{row.day}</td>
                        <td className="px-4 py-3 text-right font-bold text-neutral-900">
                          {row.count?.toLocaleString("bn-BD")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </AdminLayout>
  );
}
