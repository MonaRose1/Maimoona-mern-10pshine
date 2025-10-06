export const getStoredPinHash = () => {
  try { return localStorage.getItem('secret_pin_hash'); } catch { return null; }
};

export const setStoredPinHash = (hash) => {
  try { localStorage.setItem('secret_pin_hash', hash); } catch {}
};

export const clearStoredPin = () => {
  try { localStorage.removeItem('secret_pin_hash'); } catch {}
};

export const sha256 = async (text) => {
  const enc = new TextEncoder();
  const data = enc.encode(text);
  const digest = await crypto.subtle.digest('SHA-256', data);
  const bytes = new Uint8Array(digest);
  return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
};

export const verifyPin = async (pin) => {
  const stored = getStoredPinHash();
  if (!stored) return false;
  const computed = await sha256(pin);
  return stored === computed;
};
