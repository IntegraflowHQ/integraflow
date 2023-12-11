import { create } from "zustand";

export type Theme = {
    id: string;
    name: string;
    colorScheme?: string;
};

export type ProjectThemes = {
    themes: Theme[];
    totalCount: number | null | undefined;
    loading: boolean;
    error: string | null | undefined;
};

export type ProjectThemeActions = {
    getAvailableThemes: (
        themes: Theme[],
        loading: boolean,
        error: string | null | undefined,
        totalCount: number | null | undefined,
    ) => void;
};

const initialProjectThemeState: ProjectThemes = {
    themes: [],
    totalCount: 0,
    loading: false,
    error: null,
};

export const useProjectThemesStore = create<
    ProjectThemes & ProjectThemeActions
>((set) => ({
    ...initialProjectThemeState,

    getAvailableThemes: (
        themes: Theme[],
        loading: boolean,
        error: string | null | undefined,
        totalCount: number | null | undefined,
    ) => {
        return set({
            themes,
            error,
            loading,
            totalCount,
        });
    },
}));
