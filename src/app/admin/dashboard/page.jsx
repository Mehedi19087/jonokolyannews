"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AdminLayout, PageHeader } from "@/components/admin/AdminLayout.jsx";
import { analyticsApi, isEditorRole } from "@/lib/api-client.js";
import { useAdminAuth } from "@/lib/admin-auth.js";
import { Button, Card, CardContent } from "@/components/admin/ui.jsx";
import {
  FilePlus2,
  FileText,
  Clock,
  Eye,
  Megaphone,
  FolderTree,
  Users,
  BarChart3,
  ArrowRight,
} from "lucide-react";
import { FacebookIcon } from "@/components/common/SocialIcons.jsx";

export default function AdminDashboardPage() {
  const { user } = useAdminAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    analyticsApi
      .overview()
      .then((data) => setStats(data))
      .catch(() => setStats(null))
      .finally(() => setLoading(false));
  }, []);

  const isEditor = isEditorRole(user?.role);

  return (
    <AdminLayout>
      <PageHeader
        title="ড্যাশবোর্ড ওভারভিউ"
        description={`স্বাগতম, ${user?.email || "ব্যবহারকারী"}! আপনার সংবাদ পোর্টালের বর্তমান অবস্থা।`}
      >
        <Link href="/admin/articles/new">
          <Button variant="default">
            <FilePlus2 className="w-4 h-4" />
            নতুন পোস্ট লিখুন
          </Button>
        </Link>
      </PageHeader>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">মোট সংবাদ ভিউ</p>
              <h3 className="text-2xl font-bold mt-1 text-neutral-900">
                {loading ? "…" : stats?.total_views?.toLocaleString("bn-BD") ?? 0}
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
              <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">প্রকাশিত সংবাদ</p>
              <h3 className="text-2xl font-bold mt-1 text-neutral-900">
                {loading ? "…" : stats?.published_articles?.toLocaleString("bn-BD") ?? 0}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 grid place-items-center">
              <FileText className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">অনুমোদনের অপেক্ষায়</p>
              <h3 className="text-2xl font-bold mt-1 text-neutral-900">
                {loading ? "…" : stats?.pending_articles?.toLocaleString("bn-BD") ?? 0}
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
              <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">সক্রিয় বিজ্ঞাপন</p>
              <h3 className="text-2xl font-bold mt-1 text-neutral-900">
                {loading ? "…" : stats?.active_ads?.toLocaleString("bn-BD") ?? 0}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-600 grid place-items-center">
              <Megaphone className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Navigation Cards */}
      <h2 className="text-base font-bold text-neutral-900 mb-4">দ্রুত অ্যাক্সেস</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link href="/admin/articles">
          <Card className="hover:border-neutral-400 transition-all cursor-pointer h-full">
            <CardContent className="p-5 flex items-start gap-4">
              <div className="p-2.5 rounded-lg bg-neutral-100 text-neutral-800">
                <FileText className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-neutral-900 text-sm">সব পোস্ট পরিচালনা</h3>
                <p className="text-xs text-neutral-500 mt-1">
                  ড্রাফট, পেন্ডিং এবং প্রকাশিত সকল সংবাদের তালিকা দেখুন ও সম্পাদন করুন।
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-neutral-400 shrink-0 self-center" />
            </CardContent>
          </Card>
        </Link>

        {isEditor && (
          <Link href="/admin/articles/pending">
            <Card className="hover:border-neutral-400 transition-all cursor-pointer h-full">
              <CardContent className="p-5 flex items-start gap-4">
                <div className="p-2.5 rounded-lg bg-amber-50 text-amber-700">
                  <Clock className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-neutral-900 text-sm">অনুমোদনের আবেদন</h3>
                  <p className="text-xs text-neutral-500 mt-1">
                    রিপোর্টারদের জমা দেওয়া সংবাদ যাচাই ও অনুমোদন করুন।
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-neutral-400 shrink-0 self-center" />
              </CardContent>
            </Card>
          </Link>
        )}

        <Link href="/admin/categories">
          <Card className="hover:border-neutral-400 transition-all cursor-pointer h-full">
            <CardContent className="p-5 flex items-start gap-4">
              <div className="p-2.5 rounded-lg bg-neutral-100 text-neutral-800">
                <FolderTree className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-neutral-900 text-sm">ক্যাটাগরি</h3>
                <p className="text-xs text-neutral-500 mt-1">
                  সাইটের সংবাদ বিভাগ ও ক্যাটাগরি তৈরি ও সাজান।
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-neutral-400 shrink-0 self-center" />
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/facebook">
          <Card className="hover:border-neutral-400 transition-all cursor-pointer h-full">
            <CardContent className="p-5 flex items-start gap-4">
              <div className="p-2.5 rounded-lg bg-blue-50 text-blue-700">
                <FacebookIcon size={20} className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-neutral-900 text-sm">ফেসবুক অটো-পোস্ট</h3>
                <p className="text-xs text-neutral-500 mt-1">
                  ফেসবুক পেজ যুক্ত করুন ও স্বয়ংক্রিয় ফটোকার্ড সহ সংবাদ শেয়ার করুন।
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-neutral-400 shrink-0 self-center" />
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/ads">
          <Card className="hover:border-neutral-400 transition-all cursor-pointer h-full">
            <CardContent className="p-5 flex items-start gap-4">
              <div className="p-2.5 rounded-lg bg-neutral-100 text-neutral-800">
                <Megaphone className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-neutral-900 text-sm">বিজ্ঞাপন পরিচালনা</h3>
                <p className="text-xs text-neutral-500 mt-1">
                  হেডার ব্যানার, সাইডবার ও সংবাদের ভেতরের বিজ্ঞাপন নিয়ন্ত্রণ করুন।
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-neutral-400 shrink-0 self-center" />
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/analytics">
          <Card className="hover:border-neutral-400 transition-all cursor-pointer h-full">
            <CardContent className="p-5 flex items-start gap-4">
              <div className="p-2.5 rounded-lg bg-neutral-100 text-neutral-800">
                <BarChart3 className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-neutral-900 text-sm">পাঠক ও পরিসংখ্যান</h3>
                <p className="text-xs text-neutral-500 mt-1">
                  শীর্ষ সংবাদ, ক্যাটাগরি বিশ্লেষণ ও রেফারার তথ্য দেখুন।
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-neutral-400 shrink-0 self-center" />
            </CardContent>
          </Card>
        </Link>
      </div>
    </AdminLayout>
  );
}
