export async function apiRequest(path, options = {}) {
  const isBrowser = typeof window !== 'undefined';
  const token = isBrowser ? localStorage.getItem('token') : null;

  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  if (token) {
    defaultHeaders.Authorization = `Bearer ${token}`;
  }

  const mergedHeaders = { ...defaultHeaders, ...(options.headers || {}) };

  const requestInit = {
    method: options.method || 'GET',
    headers: mergedHeaders,
    body: options.body ? (typeof options.body === 'string' ? options.body : JSON.stringify(options.body)) : undefined,
  };

  const url = path;
  const response = await fetch(url, requestInit);

  const contentType = response.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  const payload = isJson ? await response.json().catch(() => ({})) : await response.text();

  if (!response.ok) {
    const message = (payload && (payload.message || payload.error)) || response.statusText || 'Request failed';
    throw new Error(message);
  }

  return payload;
}

export function validateEmail(email) {
  if (!email || typeof email !== 'string') return false;
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
  return pattern.test(email.trim());
}

export function validatePassword(password) {
  if (!password || typeof password !== 'string') return false;
  return password.trim().length >= 6;
}

export function validateUsername(username) {
  if (!username || typeof username !== 'string') return false;
  return username.trim().length >= 3;
}

export function validateConfirmPassword(password, confirmPassword) {
  return (password ?? '') === (confirmPassword ?? '');
}