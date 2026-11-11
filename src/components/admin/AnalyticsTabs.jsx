"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/admin/analytics", label: "ওভারভিউ" },
  { href: "/admin/analytics/articles", label: "টপ আর্টিকেল" },
  { href: "/admin/analytics/reporters", label: "রিপোর্টার পারফরম্যান্স" },
  { href: "/admin/analytics/referrers", label: "ট্রাফিক সোর্স" },
  { href: "/admin/analytics/categories", label: "ক্যাটাগরি পারফরম্যান্স" },
];

export function AnalyticsTabs() {
  const pathname = usePathname();

  return (
    <div className="flex gap-2 mb-6 border-b overflow-x-auto text-xs">
      {TABS.map((t) => {
        const active = pathname === t.href;
        return (
          <Link
            key={t.href}
            href={t.href}
            className={`px-4 py-2 border-b-2 -mb-px whitespace-nowrap transition-colors ${
              active
                ? "border-red-600 text-red-600 font-bold"
                : "border-transparent text-neutral-600 hover:text-neutral-900"
            }`}
          >
            {t.label}
          </Link>
        );
      })}
    </div>
  );
}
