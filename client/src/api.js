const BASE = (import.meta.env.VITE_API_URL || '') + '/api';

export async function api(path, { method = 'GET', body, token } = {}) {
  const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;
  const headers = {};
  if (body && !isFormData) headers['Content-Type'] = 'application/json';
  if (token) headers.Authorization = ['Bearer', token].join(' ');
  try {
    const res = await fetch(BASE + path, {
      method,
      headers,
      body: body ? (isFormData ? body : JSON.stringify(body)) : undefined,
    });
    const contentType = res.headers.get('content-type') || '';
    const data = contentType.includes('application/json') ? await res.json() : {};
    if (!res.ok || !contentType.includes('application/json')) throw new Error(data.message || 'Request failed. Try again.');
    return data;
  } catch (error) {
    if (method === 'GET' && !token) {
      const { catalogueFallback } = await import('./data/catalogueFallback.js');
      const fallback = catalogueFallback(path);
      if (fallback !== undefined) return fallback;
    }
    throw error;
  }
}

export const qs = (obj) => {
  const p = new URLSearchParams();
  Object.entries(obj).forEach(([k, v]) => v !== undefined && v !== '' && v !== null && p.set(k, v));
  const s = p.toString();
  return s ? `?${s}` : '';
};
