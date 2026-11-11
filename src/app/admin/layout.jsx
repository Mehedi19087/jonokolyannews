"use client";

import { AdminAuthProvider } from "@/lib/admin-auth.js";

export default function AdminRootLayout({ children }) {
  return <AdminAuthProvider>{children}</AdminAuthProvider>;
}
