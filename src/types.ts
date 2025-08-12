export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatarUrl?: string;
  role: 'USER' | 'ADMIN';
  userType?: 'BUYER' | 'AGENT' | 'BOTH';
  provider: 'LOCAL' | 'GOOGLE';
  providerId?: string;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthRequest {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
}

export interface AuthResponse {
  token: string;
  type: string;
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatarUrl?: string;
  role: 'USER' | 'ADMIN';
  userType?: 'BUYER' | 'AGENT' | 'BOTH';
  provider: 'LOCAL' | 'GOOGLE';
  providerId?: string;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Country {
  id: number;
  name: string;
  code: string;
  alpha2Code: string;
  flag: string;
  active: boolean;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  category: string;
  brand: string;
  imageUrl: string;
  status: 'ACTIVE' | 'INACTIVE' | 'OUT_OF_STOCK';
  agent: User;
  country?: Country;
  createdAt: string;
  updatedAt: string;
}

export interface ProductRequest {
  name: string;
  description: string;
  price: number;
  quantity: number;
  category: string;
  brand: string;
  imageUrl: string;
  countryId?: number;
}