// Admin REST API client for bdnews24.
// Works with process.env.NEWS_API_BASE_URL and process.env.NEWS_TENANT_SLUG.

export const API_BASE = (
  process.env.NEXT_PUBLIC_NEWS_API_BASE_URL ||
  process.env.NEWS_API_BASE_URL ||
  "https://newspaper-web-production.up.railway.app"
).replace(/\/+$/, "");

export const TENANT_SLUG =
  process.env.NEXT_PUBLIC_NEWS_TENANT_SLUG ||
  process.env.NEWS_TENANT_SLUG ||
  "jonokolyannews";

const TOKEN_KEY = "bdn_access_token";
const REFRESH_KEY = "bdn_refresh_token";
const USER_KEY = "bdn_admin_session";

export function getAccessToken() {
  try {
    return typeof window !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null;
  } catch {
    return null;
  }
}

export function setTokens(access, refresh) {
  try {
    if (access) localStorage.setItem(TOKEN_KEY, access);
    if (refresh) localStorage.setItem(REFRESH_KEY, refresh);
  } catch {
    /* noop */
  }
}

export function clearTokens() {
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_KEY);
    localStorage.removeItem(USER_KEY);
  } catch {
    /* noop */
  }
}

export class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

let tokenRefreshPromise = null;

async function refreshAccessToken(refreshToken) {
  const response = await fetch(`${API_BASE}/api/accounts/token/refresh/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Tenant-Slug": TENANT_SLUG,
    },
    body: JSON.stringify({ refresh: refreshToken }),
  });

  const text = await response.text();
  const data = text ? safeJson(text) : null;
  if (!response.ok || !data || typeof data !== "object" || !("access" in data)) {
    throw new ApiError("সেশনের মেয়াদ শেষ হয়েছে", response.status || 401, data);
  }

  setTokens(data.access, data.refresh);
  return data.access;
}

export async function apiFetch(path, opts = {}) {
  const { auth = false, isForm = false, headers, ...rest } = opts;
  const h = { ...(headers || {}) };
  h["X-Tenant-Slug"] = TENANT_SLUG;
  if (!isForm) h["Content-Type"] = "application/json";
  if (auth) {
    const t = getAccessToken();
    if (t) h["Authorization"] = `Bearer ${t}`;
  }
  const url = path.startsWith("http") ? path : `${API_BASE}${path}`;
  const res = await fetch(url, { ...rest, headers: h });
  const text = await res.text();
  const data = text ? safeJson(text) : null;

  if (res.status === 401 && auth && !path.includes("/token/refresh/")) {
    const refreshToken = typeof window !== "undefined" ? localStorage.getItem(REFRESH_KEY) : null;
    if (refreshToken) {
      if (!tokenRefreshPromise) {
        tokenRefreshPromise = refreshAccessToken(refreshToken);
      }

      let newToken;
      try {
        newToken = await tokenRefreshPromise;
      } catch (refreshError) {
        clearTokens();
        if (typeof window !== "undefined") window.location.href = "/admin/login";
        throw refreshError;
      } finally {
        tokenRefreshPromise = null;
      }

      h["Authorization"] = `Bearer ${newToken}`;
      const retryRes = await fetch(url, { ...rest, headers: h });
      const retryText = await retryRes.text();
      const retryData = retryText ? safeJson(retryText) : null;
      if (!retryRes.ok) {
        throw new ApiError(
          retryRes.statusText || `HTTP ${retryRes.status}`,
          retryRes.status,
          retryData
        );
      }
      return retryData;
    } else {
      clearTokens();
      if (typeof window !== "undefined") window.location.href = "/admin/login";
    }
  }

  if (!res.ok) {
    throw new ApiError(
      extractErrorMessage(data, res.statusText || `HTTP ${res.status}`),
      res.status,
      data
    );
  }
  return data;
}

function extractErrorMessage(data, fallback) {
  if (data && typeof data === "object") {
    if (typeof data.detail === "string" && data.detail) return data.detail;
    if (typeof data.message === "string" && data.message) return data.message;
    if (typeof data.error === "string" && data.error) return data.error;

    for (const [key, val] of Object.entries(data)) {
      if (Array.isArray(val) && val.length > 0 && typeof val[0] === "string") {
        return `${key}: ${val[0]}`;
      }
      if (typeof val === "string") return val;
    }
  }
  return fallback;
}

function safeJson(t) {
  try {
    return JSON.parse(t);
  } catch {
    return t;
  }
}

export function isEditorRole(role) {
  if (!role) return false;
  const r = String(role).toUpperCase();
  return r === "OWNER" || r === "ADMIN" || r === "SUPERADMIN" || r === "EIC" || r === "EDITOR";
}

export function isOwnerRole(role) {
  if (!role) return false;
  const r = String(role).toUpperCase();
  return r === "OWNER" || r === "ADMIN" || r === "SUPERADMIN" || r === "EIC";
}

function qs(params) {
  const p = new URLSearchParams();
  Object.entries(params || {}).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") p.set(k, String(v));
  });
  const s = p.toString();
  return s ? `?${s}` : "";
}

// ---------- Auth APIs ----------
export const authApi = {
  login: (email, password) =>
    apiFetch("/api/accounts/login/", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
  signup: (email, password, signal) =>
    apiFetch("/api/accounts/signup/", {
      method: "POST",
      body: JSON.stringify({ email, password }),
      signal,
    }),
  verifyOtp: (email, otp) =>
    apiFetch("/api/accounts/verify-otp/", {
      method: "POST",
      body: JSON.stringify({ email, otp }),
    }),
  me: () => apiFetch("/api/accounts/me/", { auth: true }),
};

// ---------- Users APIs ----------
export const usersApi = {
  list: () => apiFetch("/api/accounts/users/", { auth: true }),
  create: (data) =>
    apiFetch("/api/accounts/users/", {
      method: "POST",
      body: JSON.stringify(data),
      auth: true,
    }),
  updateRole: (id, role) =>
    apiFetch(`/api/accounts/users/${id}/role/`, {
      method: "PATCH",
      body: JSON.stringify({ role }),
      auth: true,
    }),
};

// ---------- Categories APIs ----------
export const categoriesApi = {
  list: () => apiFetch("/api/news/categories/"),
  create: (data) =>
    apiFetch("/api/news/categories/", {
      method: "POST",
      body: JSON.stringify(data),
      auth: true,
    }),
  get: (slug) => apiFetch(`/api/news/categories/${encodeURIComponent(slug)}/`),
  update: (slug, data) =>
    apiFetch(`/api/news/categories/${encodeURIComponent(slug)}/`, {
      method: "PATCH",
      body: JSON.stringify(data),
      auth: true,
    }),
  remove: (slug) =>
    apiFetch(`/api/news/categories/${encodeURIComponent(slug)}/`, {
      method: "DELETE",
      auth: true,
    }),
};

// ---------- Articles APIs ----------
export const articlesApi = {
  list: (params = {}) => apiFetch(`/api/news/articles/${qs(params)}`),
  getPublic: (slug) => apiFetch(`/api/news/articles/${encodeURIComponent(slug)}/`),
  get: (slug) => apiFetch(`/api/news/articles/${encodeURIComponent(slug)}/`, { auth: true }),
  create: (data) =>
    apiFetch("/api/news/articles/", {
      method: "POST",
      body: JSON.stringify(data),
      auth: true,
    }),
  createWithImage: (form) =>
    apiFetch("/api/news/articles/", {
      method: "POST",
      body: form,
      auth: true,
      isForm: true,
    }),
  update: (slug, data) =>
    apiFetch(`/api/news/articles/${encodeURIComponent(slug)}/`, {
      method: "PATCH",
      body: JSON.stringify(data),
      auth: true,
    }),
  updateWithImage: (slug, form) =>
    apiFetch(`/api/news/articles/${encodeURIComponent(slug)}/`, {
      method: "PATCH",
      body: form,
      auth: true,
      isForm: true,
    }),
  remove: (slug) =>
    apiFetch(`/api/news/articles/${encodeURIComponent(slug)}/`, {
      method: "DELETE",
      auth: true,
    }),
  submit: (slug) =>
    apiFetch(`/api/news/articles/${encodeURIComponent(slug)}/submit/`, {
      method: "POST",
      auth: true,
    }),
  approve: (slug) =>
    apiFetch(`/api/news/articles/${encodeURIComponent(slug)}/approve/`, {
      method: "POST",
      auth: true,
    }),
  reject: (slug, feedback) =>
    apiFetch(`/api/news/articles/${encodeURIComponent(slug)}/reject/`, {
      method: "POST",
      body: JSON.stringify({ feedback }),
      auth: true,
    }),
  recall: (slug) =>
    apiFetch(`/api/news/articles/${encodeURIComponent(slug)}/recall/`, {
      method: "POST",
      auth: true,
    }),
  trackView: (slug, referrer_url = "") =>
    apiFetch(`/api/news/articles/${encodeURIComponent(slug)}/view/`, {
      method: "POST",
      body: JSON.stringify({ referrer_url }),
    }).catch(() => null),
  editorList: (status) =>
    apiFetch(`/api/news/editor/articles/${status ? `?status=${status}` : ""}`, {
      auth: true,
    }),
  importRss: (data = {}) =>
    apiFetch("/api/news/articles/import-rss/", {
      method: "POST",
      body: JSON.stringify(data),
      auth: true,
      signal: AbortSignal.timeout(15000),
    }),
  importRssStatus: (id) =>
    apiFetch(`/api/news/articles/import-rss/${encodeURIComponent(id)}/`, {
      auth: true,
      signal: AbortSignal.timeout(15000),
    }),
};

// ---------- Ads APIs ----------
export const adsApi = {
  adminList: (slot) =>
    apiFetch(`/api/news/ads/${slot ? `?slot=${slot}` : ""}`, { auth: true }),
  list: (slot) => apiFetch(`/api/news/ads/${slot ? `?slot=${slot}` : ""}`),
  get: (id) => apiFetch(`/api/news/ads/${id}/`),
  create: (data) =>
    apiFetch("/api/news/ads/", {
      method: "POST",
      body: JSON.stringify(data),
      auth: true,
    }),
  createWithImage: (form) =>
    apiFetch("/api/news/ads/", {
      method: "POST",
      body: form,
      auth: true,
      isForm: true,
    }),
  update: (id, data) =>
    apiFetch(`/api/news/ads/${id}/`, {
      method: "PATCH",
      body: JSON.stringify(data),
      auth: true,
    }),
  updateWithImage: (id, form) =>
    apiFetch(`/api/news/ads/${id}/`, {
      method: "PATCH",
      body: form,
      auth: true,
      isForm: true,
    }),
  remove: (id) => apiFetch(`/api/news/ads/${id}/`, { method: "DELETE", auth: true }),
  impression: (id) =>
    apiFetch(`/api/news/ads/${id}/impression/`, { method: "POST" }).catch(() => null),
  click: (id) =>
    apiFetch(`/api/news/ads/${id}/click/`, {
      method: "POST",
    }).catch(() => null),
};

// ---------- Analytics APIs ----------
export const analyticsApi = {
  overview: (r = {}) =>
    apiFetch(`/api/news/analytics/overview/${qs(r)}`, { auth: true }),
  articles: (r = {}) =>
    apiFetch(`/api/news/analytics/articles/${qs(r)}`, { auth: true }),
  reporters: (r = {}) =>
    apiFetch(`/api/news/analytics/reporters/${qs(r)}`, { auth: true }),
  referrers: (r = {}) =>
    apiFetch(`/api/news/analytics/referrers/${qs(r)}`, { auth: true }),
  categories: (r = {}) =>
    apiFetch(`/api/news/analytics/categories/${qs(r)}`, { auth: true }),
};

// ---------- Facebook APIs ----------
export const facebookApi = {
  getAuthUrl: () => apiFetch("/api/news/facebook/connect/", { auth: true }),
  getPages: () => apiFetch("/api/news/facebook/pages/", { auth: true }),
  connectWithToken: (data) =>
    apiFetch("/api/news/facebook/pages/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      auth: true,
    }),
  updatePage: (id, data) =>
    apiFetch(`/api/news/facebook/pages/${id}/`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      auth: true,
    }),
  disconnectPage: (id) =>
    apiFetch(`/api/news/facebook/pages/${id}/`, {
      method: "DELETE",
      auth: true,
    }),
  generatePhotocard: (slug) =>
    apiFetch(`/api/news/articles/${slug}/photocard/`, {
      method: "POST",
      auth: true,
    }),
  publishToFacebook: (slug, pageId) =>
    apiFetch(`/api/news/articles/${slug}/facebook-publish/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(pageId ? { page_id: pageId } : {}),
      auth: true,
    }),
};
