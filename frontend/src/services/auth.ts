import api from './api';
import { AuthFormData, User } from '../types';

export const login = async (credentials: AuthFormData): Promise<{ user: User; token: string }> => {
  const response = await api.post('/auth/login', credentials);
  localStorage.setItem('token', response.data.access_token);
  return response.data;
};

export const register = async (userData: AuthFormData): Promise<{ user: User; token: string }> => {
  const response = await api.post('/auth/register', userData);
  localStorage.setItem('token', response.data.access_token);
  return response.data;
};

export const logout = (): void => {
  localStorage.removeItem('token');
};

export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const response = await api.get('/auth/me');
    return response.data;
  } catch (error) {
    console.error('Error fetching current user:', error);
    return null;
  }
}; 