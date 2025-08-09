import api from './api';
import type { AuthRequest, AuthResponse } from '../types';

export const authService = {
  async register(userData: AuthRequest): Promise<string> {
    const response = await api.post<string>('/api/auth/register', userData);
    return response.data;
  },

  async login(credentials: AuthRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/api/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },

  async verifyEmail(token: string): Promise<string> {
    const response = await api.get<string>(`/api/auth/verify-email?token=${token}`);
    return response.data;
  },

  logout() {
    localStorage.removeItem('token');
    window.location.href = '/login';
  },

  getCurrentUser(): AuthResponse | null {
    const token = localStorage.getItem('token');
    if (!token) return null;
    
    try {
        JSON.parse(atob(token.split('.')[1]));
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        return user;
    }
    catch {
      return null;
    }
  },

  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    if (!token) return false;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  }
};