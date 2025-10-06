export const getToken = () => {
  try { return localStorage.getItem('token'); } catch (e) { return null; }
}

export const apiRequest = async (path, options = {}) => {
  const baseUrl = '/api';
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${baseUrl}${path}`, { ...options, headers });
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const message = data?.message || 'Request failed';
    throw new Error(message);
  }
  return data;
}


