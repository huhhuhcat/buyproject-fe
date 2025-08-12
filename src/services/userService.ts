import api from './api';

export const userService = {
  async updateUserType(userType: 'BUYER' | 'AGENT' | 'BOTH'): Promise<string> {
    const response = await api.put<string>('/api/users/type', { userType });
    return response.data;
  },

  async uploadFile(file: File, type: string): Promise<{ url: string; filename: string }> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    
    const response = await api.post<{ url: string; filename: string }>('/api/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async updateAvatar(avatarUrl: string): Promise<string> {
    const response = await api.put<string>('/api/users/avatar', { avatarUrl });
    return response.data;
  }
};