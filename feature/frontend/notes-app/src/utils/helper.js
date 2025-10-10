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
  const body = typeof options.body === 'object' && options.body !== null && !(options.body instanceof FormData)
    ? JSON.stringify(options.body)
    : options.body;
  const res = await fetch(`${baseUrl}${path}`, { ...options, headers, body });
  let data = null;
  try { data = await res.json(); } catch {}
  if (!res.ok) {
    const message = data?.message || `Request failed (${res.status})`;
    throw new Error(message);
  }
  return data;
};

export const validateEmail = (email) => {
  if (typeof email !== 'string') return false;
  return /\S+@\S+\.\S+/.test(email);
};

export const validatePassword = (password) => {
  return typeof password === 'string' && password.length >= 6;
};

export const validateUsername = (username) => {
  return typeof username === 'string' && username.trim().length >= 2;
};

export const validateConfirmPassword = (password, confirmPassword) => {
  return password === confirmPassword && !!password;
};
