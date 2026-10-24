// Fixed Bug-030: Standardized key to "token" across all functions
export const saveToken = (token) => localStorage.setItem("token", token);
export const getToken = () => localStorage.getItem("token");
export const clearToken = () => localStorage.removeItem("token");