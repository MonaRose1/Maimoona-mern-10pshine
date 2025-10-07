export function validateEmail(email) {
  if (typeof email !== 'string') return false;
  const trimmed = email.trim();
  // Simplified RFC 5322-compatible pattern suitable for client validation
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  return emailPattern.test(trimmed);
}

export function saveToken(token) {
  try {
    localStorage.setItem('token', token);
  } catch {}
}

export function getToken() {
  try {
    return localStorage.getItem('token');
  } catch {
    return null;
  }
}

export function clearToken() {
  try {
    localStorage.removeItem('token');
  } catch {}
}

function buildUrl(path) {
  if (/^https?:\/\//i.test(path)) return path;
  const base = import.meta?.env?.VITE_API_BASE || '';
  if (!base) return path; // allow relative to current origin during dev
  return `${base.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
}

export async function apiRequest(path, options = {}) {
  const url = buildUrl(path);
  const token = getToken();
  const defaultHeaders = {
    'Accept': 'application/json',
  };
  const mergedHeaders = { ...defaultHeaders, ...(options.headers || {}) };
  if (options.body && !('Content-Type' in mergedHeaders)) {
    mergedHeaders['Content-Type'] = 'application/json';
  }
  if (token && !('Authorization' in mergedHeaders)) {
    mergedHeaders['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, { ...options, headers: mergedHeaders });
  const contentType = response.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  const payload = isJson ? await response.json().catch(() => ({})) : await response.text();

  if (!response.ok) {
    const message = (payload && payload.message) || response.statusText || 'Request failed';
    throw new Error(message);
  }
  return payload;
}


