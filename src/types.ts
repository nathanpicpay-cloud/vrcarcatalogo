export interface User {
  id: number;
  username: string;
  role: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
}

export interface Product {
  id: number;
  code: string;
  name: string;
  description: string;
  price: number;
  cost?: number;
  stock: number;
  min_stock?: number;
  category_id: number;
  brand: string;
  application: string;
  image: string;
  active: boolean;
  is_featured: boolean;
  is_new: boolean;
}

export interface Category {
  id: number;
  name: string;
  description: string;
  image: string;
}
