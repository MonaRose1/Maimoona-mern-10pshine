export const getToken = () => {
  try { return localStorage.getItem('token'); } catch { return null; }
};

export const setToken = (token) => {
  try { localStorage.setItem('token', token); } catch {}
};

export const clearToken = () => {
  try { localStorage.removeItem('token'); } catch {}
};

export const apiRequest = async (path, options = {}) => {
  const baseUrl = '/api';
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${baseUrl}${path}`, { ...options, headers });
  let data = null;
  try { data = await res.json(); } catch {}
  if (!res.ok) {
    const message = data?.message || `Request failed (${res.status})`;
    throw new Error(message);
  }
  return data;
};

export const formatError = (error) => {
  if (!error) return 'Unknown error';
  if (typeof error === 'string') return error;
  return error.message || 'Something went wrong';
};


