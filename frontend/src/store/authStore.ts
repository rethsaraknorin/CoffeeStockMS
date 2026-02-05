import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { User } from '@/types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  updateUser: (user: User) => void;
  logout: () => void;
  hydrated: boolean;
  setHydrated: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      hydrated: false,
      setAuth: (user, token) => {
        if (typeof window !== 'undefined') {
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(user));
        }
        set({ user, token, isAuthenticated: true });
      },
      updateUser: (user) => {
        if (typeof window !== 'undefined') {
          localStorage.setItem('user', JSON.stringify(user));
        }
        set({ user });
      },
      logout: () => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
        set({ user: null, token: null, isAuthenticated: false });
      },
      setHydrated: () => set({ hydrated: true }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => 
        typeof window !== 'undefined' ? localStorage : {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
        }
      ),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    }
  )
);
