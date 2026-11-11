"use client";

import { useEffect, useState } from "react";
import { Users, UserPlus, RefreshCw, CheckCircle2, Shield, AlertCircle } from "lucide-react";
import { AdminLayout, PageHeader } from "@/components/admin/AdminLayout.jsx";
import { usersApi, isOwnerRole } from "@/lib/api-client.js";
import { useAdminAuth } from "@/lib/admin-auth.js";
import { Button, Input, Label, Select, Badge, Dialog } from "@/components/admin/ui.jsx";

const ROLES = [
  { value: "OWNER", label: "মালিক (Owner)" },
  { value: "EIC", label: "প্রধান সম্পাদক (Editor-in-Chief)" },
  { value: "EDITOR", label: "সম্পাদক (Editor)" },
  { value: "REPORTER", label: "প্রতিবেদক (Reporter)" },
  { value: "READER", label: "সাধারণ পাঠক (Reader)" },
];

export default function UsersManagementPage() {
  const { user: currentUser } = useAdminAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState(null);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    role: "REPORTER",
  });

  const isOwner = isOwnerRole(currentUser?.role);

  const loadUsers = () => {
    setLoading(true);
    setError(null);
    usersApi
      .list()
      .then((data) => setUsers(Array.isArray(data) ? data : []))
      .catch((err) => setError(err.message || "ব্যবহারকারী তালিকা লোড ব্যর্থ"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (isOwner) {
      loadUsers();
    } else {
      setLoading(false);
    }
  }, [isOwner]);

  const handleRoleChange = async (userId, newRole) => {
    try {
      const updated = await usersApi.updateRole(userId, newRole);
      setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role: updated.role } : u)));
      setSuccessMsg("রোল সফলভাবে পরিবর্তন করা হয়েছে");
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err) {
      alert(err.message || "রোল পরিবর্তন ব্যর্থ হয়েছে");
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!formData.email.trim() || !formData.password.trim()) {
      setCreateError("ইমেইল ও পাসওয়ার্ড আবশ্যক");
      return;
    }
    setCreating(true);
    setCreateError(null);
    try {
      const created = await usersApi.create({
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
        email: formData.email.trim(),
        password: formData.password.trim(),
        role: formData.role,
      });
      setUsers((prev) => [created, ...prev]);
      setCreateDialogOpen(false);
      setFormData({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        role: "REPORTER",
      });
      setSuccessMsg("নতুন ব্যবহারকারী সফলভাবে তৈরি হয়েছে");
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err) {
      setCreateError(err.message || "ব্যবহারকারী তৈরি ব্যর্থ হয়েছে");
    } finally {
      setCreating(false);
    }
  };

  if (!isOwner) {
    return (
      <AdminLayout>
        <div className="p-12 text-center bg-white rounded-lg border border-neutral-200">
          <Shield className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-neutral-800">অননুমোদিত প্রবেশ</h2>
          <p className="text-sm text-neutral-500 mt-1">
            শুধুমাত্র পোর্টাল মালিক এবং প্রধান অ্যাডমিনগণ এই পৃষ্ঠা দেখতে পারেন।
          </p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <PageHeader
        title="ব্যবহারকারী ও রোল ব্যবস্থাপনা"
        description="প্রতিবেদক, সম্পাদক ও অ্যাডমিনদের তালিকা এবং তাদের ক্ষমতা নিয়ন্ত্রণ করুন"
      >
        <Button variant="outline" size="sm" onClick={loadUsers} disabled={loading}>
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          রিফ্রেশ
        </Button>
        <Button variant="default" size="sm" onClick={() => setCreateDialogOpen(true)}>
          <UserPlus className="w-4 h-4" />
          নতুন রিপোর্টার / সম্পাদক যোগ
        </Button>
      </PageHeader>

      {successMsg && (
        <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded text-sm flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          {successMsg}
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-800 rounded text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          {error}
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b bg-neutral-50/80 text-neutral-600 font-semibold uppercase tracking-wider">
                <th className="px-4 py-3">নাম</th>
                <th className="px-4 py-3">ইমেইল</th>
                <th className="px-4 py-3">রোল (পদবী)</th>
                <th className="px-4 py-3">রোল পরিবর্তন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-neutral-400">
                    লোড হচ্ছে…
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-neutral-400">
                    কোনো ব্যবহারকারী পাওয়া যায়নি।
                  </td>
                </tr>
              ) : (
                users.map((u) => {
                  const fullName =
                    [u.first_name, u.last_name].filter(Boolean).join(" ") || "নাম নেই";
                  return (
                    <tr key={u.id} className="hover:bg-neutral-50 transition-colors">
                      <td className="px-4 py-3 font-semibold text-neutral-900">{fullName}</td>
                      <td className="px-4 py-3 font-mono text-neutral-600">{u.email}</td>
                      <td className="px-4 py-3">
                        <Badge variant={u.role === "OWNER" ? "default" : "secondary"}>
                          {u.role}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={u.role}
                          onChange={(e) => handleRoleChange(u.id, e.target.value)}
                          disabled={u.id === currentUser?.id}
                          className="h-8 border border-neutral-300 rounded px-2 text-xs bg-white focus:ring-2 focus:ring-neutral-400 outline-none disabled:opacity-50 cursor-pointer"
                        >
                          {ROLES.map((r) => (
                            <option key={r.value} value={r.value}>
                              {r.label}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create User Dialog */}
      <Dialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        title="নতুন ব্যবহারকারী তৈরি করুন"
        description="নতুন রিপোর্টার বা সম্পাদকের তথ্য পূরণ করুন।"
      >
        <form onSubmit={handleCreateUser} className="space-y-4 pt-2">
          {createError && (
            <div className="p-2 bg-red-50 text-red-700 text-xs rounded border border-red-200">
              {createError}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="fname">প্রথম নাম</Label>
              <Input
                id="fname"
                value={formData.first_name}
                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                placeholder="যেমন: রহিম"
              />
            </div>
            <div>
              <Label htmlFor="lname">শেষ নাম</Label>
              <Input
                id="lname"
                value={formData.last_name}
                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                placeholder="যেমন: উদ্দিন"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="uemail">ইমেইল *</Label>
            <Input
              id="uemail"
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="user@example.com"
            />
          </div>

          <div>
            <Label htmlFor="upassword">পাসওয়ার্ড * (ন্যূনতম ৮ অক্ষর)</Label>
            <Input
              id="upassword"
              type="password"
              required
              minLength={8}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="••••••••"
            />
          </div>

          <div>
            <Label htmlFor="urole">রোল (পদবী) *</Label>
            <Select
              id="urole"
              value={formData.role}
              onChange={(val) => setFormData({ ...formData, role: val })}
              options={ROLES}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => setCreateDialogOpen(false)}
            >
              বাতিল
            </Button>
            <Button type="submit" disabled={creating}>
              {creating ? "তৈরি হচ্ছে…" : "ব্যবহারকারী সংরক্ষণ"}
            </Button>
          </div>
        </form>
      </Dialog>
    </AdminLayout>
  );
}
