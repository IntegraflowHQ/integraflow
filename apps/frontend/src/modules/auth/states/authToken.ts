import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

import { cookieStorage } from '@/utils/cookie-storage';

export type AuthTokenState = {
  token: string | null;
  refreshToken: string | null;
  csrfToken: string | null;
}

export type AuthTokenActions = {
  login: (token: string, refreshToken: string, csrfToken: string) => void;
  refresh: (token: string) => void;
  logout: () => void;
}

const initialState: AuthTokenState = {
  token: null,
  refreshToken: null,
  csrfToken: null,
};

export const useAuthTokenStore = create<AuthTokenState & AuthTokenActions>()(
  persist((set, get) => ({
    ...initialState,
    login: (token, refreshToken, csrfToken) => set({ token, refreshToken, csrfToken }),
    refresh: (token: string) => set({ ...get(), token }),
    logout: () => set(initialState),
  }), {
    name: 'auth-token', // name of the item in the storage (must be unique)
    storage: createJSONStorage(() => cookieStorage), // (optional) by default, 'localStorage' is used
  })
);
