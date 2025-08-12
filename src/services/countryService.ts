import api from './api';
import type { Country } from '../types';

export const countryService = {
  async getAllCountries(): Promise<Country[]> {
    const response = await api.get<Country[]>('/api/countries');
    return response.data;
  },

  async getActiveCountries(): Promise<Country[]> {
    const response = await api.get<Country[]>('/api/countries/active');
    return response.data;
  },

  async getCountryById(id: number): Promise<Country> {
    const response = await api.get<Country>(`/api/countries/${id}`);
    return response.data;
  }
};