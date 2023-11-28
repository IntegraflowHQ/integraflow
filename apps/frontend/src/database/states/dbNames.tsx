import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type DbNamesState = {
    names: string[];
};

export type DbNamesActions = {
    add: (name: string) => void;
    clear: () => void;
};

const initialState: DbNamesState = {
    names: [],
};

export const useDbNamesStore = create<DbNamesState & DbNamesActions>()(
    persist(
        (set, get) => ({
            ...initialState,
            add: (name) =>
                set({ names: Array.from(new Set([...get().names, name])) }),
            clear: () => set(initialState),
        }),
        {
            name: "db-names",
            storage: createJSONStorage(() => localStorage),
        },
    ),
);
