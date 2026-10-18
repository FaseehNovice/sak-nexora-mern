const BASE = (import.meta.env.API_URL || '') + '/api';

export async function api(path, { method = 'GET', body, token } = {}) {
  const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;
  const headers = {};
  if (body && !isFormData) headers['Content-Type'] = 'application/json';
  if (token) headers.Authorization = ['Bearer', token].join(' ');
  const res = await fetch(BASE + path, {
    method,
    headers,
    body: body ? (isFormData ? body : JSON.stringify(body)) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || 'Request failed. Try again.');
  return data;
}

export const qs = (obj) => {
  const p = new URLSearchParams();
  Object.entries(obj).forEach(([k, v]) => v !== undefined && v !== '' && v !== null && p.set(k, v));
  const s = p.toString();
  return s ? `?${s}` : '';
};
