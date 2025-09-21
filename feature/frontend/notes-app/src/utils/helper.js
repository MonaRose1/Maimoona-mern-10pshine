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