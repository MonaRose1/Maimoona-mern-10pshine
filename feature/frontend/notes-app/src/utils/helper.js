export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(String(email).toLowerCase());
}
export const validatePassword = (password) => {
  return password.length >= 6;
}
export const validateUsername = (username) => {
  return username.trim() !== '';
}
export const validateConfirmPassword = (password, confirmPassword) => {
  return password === confirmPassword;
}   

export const getInitials = (name) => {
  const names = name.split(' ');
  const initials = names.map(n => n.charAt(0).toUpperCase()).join('');
  return initials;
}

export const saveToken = (token) => {
  try { localStorage.setItem('token', token); } catch (e) {}
}

export const getToken = () => {
  try { return localStorage.getItem('token'); } catch (e) { return null; }
}

export const removeToken = () => {
  try { localStorage.removeItem('token'); } catch (e) {}
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