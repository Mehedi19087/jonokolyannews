"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  FilePlus2,
  FileText,
  Clock,
  FolderTree,
  Megaphone,
  BarChart3,
  Users,
  LogOut,
  Menu,
  X,
  ExternalLink,
} from "lucide-react";
import { FacebookIcon } from "@/components/common/SocialIcons.jsx";
import { AdminAuthProvider, useAdminAuth } from "@/lib/admin-auth.js";
import { clearTokens, isOwnerRole } from "@/lib/api-client.js";

const BASE_NAV = [
  { href: "/admin/dashboard", label: "ওভারভিউ", icon: LayoutDashboard },
  { href: "/admin/articles", label: "সব পোস্ট", icon: FileText },
  { href: "/admin/articles/pending", label: "অনুমোদনের জন্য", icon: Clock },
  { href: "/admin/articles/new", label: "নতুন পোস্ট", icon: FilePlus2 },
  { href: "/admin/categories", label: "ক্যাটাগরি", icon: FolderTree },
  { href: "/admin/facebook", label: "ফেসবুক ইন্টিগ্রেশন", icon: FacebookIcon },
  { href: "/admin/ads", label: "বিজ্ঞাপন", icon: Megaphone },
  { href: "/admin/analytics", label: "অ্যানালিটিক্স", icon: BarChart3 },
];

function getRoleLabel(role) {
  switch (String(role).toUpperCase()) {
    case "OWNER":
    case "ADMIN":
    case "SUPERADMIN":
      return "মালিক (Owner)";
    case "EIC":
      return "প্রধান সম্পাদক (EIC)";
    case "EDITOR":
      return "সম্পাদক (Editor)";
    case "REPORTER":
    case "JOURNALIST":
      return "রিপোর্টার (Reporter)";
    case "READER":
      return "পাঠক (Reader)";
    default:
      return role || "ব্যবহারকারী";
  }
}

function AdminShell({ children }) {
  const { user, loading, logout } = useAdminAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/admin/login");
    }
  }, [loading, user, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen grid place-items-center bg-neutral-50 text-sm text-neutral-500 font-sans">
        লোড হচ্ছে…
      </div>
    );
  }

  const handleLogout = async () => {
    await logout();
    clearTokens();
    router.push("/admin/login");
  };

  const navItems = [
    ...BASE_NAV,
    ...(isOwnerRole(user.role)
      ? [{ href: "/admin/users", label: "ব্যবহারকারী ও রোল", icon: Users }]
      : []),
  ];

  return (
    <div className="min-h-screen flex bg-neutral-50 font-sans text-neutral-900">
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-neutral-200 flex flex-col transition-transform duration-200 lg:static lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="px-5 py-4 border-b flex items-center justify-between">
          <Link href="/admin/dashboard" className="flex items-center gap-2.5 group">
            <span className="w-8 h-8 rounded bg-red-600 text-white font-serif font-black grid place-items-center text-sm shadow-sm">
              জে
            </span>
            <div className="min-w-0">
              <span className="font-serif font-bold text-base block leading-tight text-neutral-900 group-hover:text-red-700 transition-colors">
                জনকল্যাণ<span className="text-red-600"> নিউজ</span>
              </span>
              <p className="text-[11px] text-neutral-500">অ্যাডমিন প্যানেল</p>
            </div>
          </Link>
          <button
            type="button"
            className="lg:hidden p-1 text-neutral-400 hover:text-neutral-700"
            onClick={() => setMobileOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active =
              pathname === href || (href !== "/admin/dashboard" && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                  active
                    ? "bg-neutral-900 text-white font-medium"
                    : "text-neutral-700 hover:bg-neutral-100"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="truncate">{label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t bg-neutral-50/50">
          <div className="px-3 py-2 text-xs">
            <p className="font-medium truncate text-neutral-900">{user.email}</p>
            <p className="text-neutral-500 mt-0.5">{getRoleLabel(user.role)}</p>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <Link
              href="/"
              target="_blank"
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 text-xs text-neutral-600 border border-neutral-200 rounded hover:bg-white transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              মূল সাইট
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 text-xs text-red-600 border border-red-200 rounded hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              লগআউট
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="lg:hidden bg-white border-b border-neutral-200 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="p-1.5 rounded-md border text-neutral-600 hover:bg-neutral-50"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="font-serif font-bold text-sm">জনকল্যাণ নিউজ অ্যাডমিন</span>
          <div className="w-8" />
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

export function AdminLayout({ children }) {
  return <AdminShell>{children}</AdminShell>;
}

export function PageHeader({ title, description, children }) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b pb-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900">{title}</h1>
        {description && <p className="text-sm text-neutral-500 mt-1">{description}</p>}
      </div>
      {children && <div className="flex flex-wrap items-center gap-2.5">{children}</div>}
    </div>
  );
}
