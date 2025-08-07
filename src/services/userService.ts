import api from './api';

export const userService = {
  async updateUserType(userType: 'BUYER' | 'AGENT' | 'BOTH'): Promise<string> {
    const response = await api.put<string>('/api/users/type', { userType });
    return response.data;
  }
};