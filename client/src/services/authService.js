import api from "./api";

export const register = async ({ name, email, password, role }) => {
  const response = await api.post('/api/auth/register', { name, email, password, role });
  return response.data;
};

export const login = async ({ email, password }) => {
  const response = await api.post('/api/auth/login', { email, password });
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get('/api/auth/me');
  return response.data;
};

export const logout = async () => {
  const response = await api.post('/api/auth/logout');
  return response.data;
};