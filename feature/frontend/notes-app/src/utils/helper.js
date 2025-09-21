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
