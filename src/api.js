const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export function getToken() {
  return localStorage.getItem("mulawave_token");
}

export function setSession(data) {
  if (data?.token) localStorage.setItem("mulawave_token", data.token);
  if (data?.user) localStorage.setItem("mulawave_user", JSON.stringify(data.user));
}

export function clearSession() {
  localStorage.removeItem("mulawave_token");
  localStorage.removeItem("mulawave_user");
}

export function getSessionUser() {
  try { return JSON.parse(localStorage.getItem("mulawave_user") || "null"); }
  catch { return null; }
}

export async function api(path, options = {}) {
  const token = getToken();
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      ...(options.body instanceof FormData ? {} : {"Content-Type":"application/json"}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {})
    }
  });
  const text = await res.text();
  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch { data = { message: text }; }
  if (!res.ok) throw new Error(data?.message || `Request failed (${res.status})`);
  return data;
}

export const register = body => api("/auth/register", {method:"POST", body:JSON.stringify(body)});
export const login = body => api("/auth/login", {method:"POST", body:JSON.stringify(body)});
export const getMe = () => api("/users/me");

export const getRecipients = () => api("/recipients");
export const createRecipient = body => api("/recipients", {method:"POST", body:JSON.stringify(body)});
export const updateRecipient = (id, body) => api(`/recipients/${id}`, {method:"PATCH", body:JSON.stringify(body)});
export const deleteRecipient = id => api(`/recipients/${id}`, {method:"DELETE"});

export const getOrders = () => api("/orders");
export const createOrder = body => api("/orders", {method:"POST", body:JSON.stringify(body)});
export const getOrder = orderNumber => api(`/orders/${encodeURIComponent(orderNumber)}`);
export const updateOrderStatus = (id, status) => api(`/orders/${id}/status`, {method:"PATCH", body:JSON.stringify({status})});

export const adminOverview = () => api("/admin/overview");
export const adminUsers = () => api("/users");
export const assignRole = (id, role, reason) => api(`/users/${id}/role`, {method:"PATCH", body:JSON.stringify({role, reason})});
export const adminAudit = () => api("/admin/audit");
export const adminSettings = () => api("/admin/settings");
export const updateSetting = (key, value, reason) => api(`/admin/settings/${encodeURIComponent(key)}`, {method:"PUT", body:JSON.stringify({value, reason})});
