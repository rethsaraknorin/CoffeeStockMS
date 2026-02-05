export interface User {
  id: string;
  username: string;
  email: string;
  role: 'ADMIN' | 'STAFF';
  createdAt: string;
  updatedAt?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  role?: 'ADMIN' | 'STAFF';
}
