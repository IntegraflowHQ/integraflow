import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { cookieStorage } from '@/utils/cookie-storage';

export type AuthState = {
    token: string | null;
    refreshToken: string | null;
    csrfToken: string | null;
    currentProjectId: string | null;
}

export type AuthActions = {
    initialize: (initialState: AuthState) => void;
    refresh: (token: string) => void;
    switchProject: (projectId: string) => void;
    reset: () => void;
}

const PERSIST_NAME = 'auth';

const initialState: AuthState = {
    token: null,
    refreshToken: null,
    csrfToken: null,
    currentProjectId: null,
};

export const useAuthStore = create<AuthState & AuthActions>()(
    persist((set, get) => ({
        ...initialState,
        initialize: (initialState) => set({ ...get(), ...initialState }),
        refresh: (token) => set({ ...get(), token }),
        switchProject: (projectId) => set({ ...get(), currentProjectId: projectId }),
        reset: () => set(initialState)
    }), {
        name: PERSIST_NAME, // name of the item in the storage (must be unique)
        storage: createJSONStorage(() => cookieStorage),
    })
);
