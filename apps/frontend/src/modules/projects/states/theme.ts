import { ProjectTheme } from "@/generated/graphql";
import { create } from "zustand";

export type ThemeState = {
    theme: Partial<ProjectTheme>;
};

const initialState: ThemeState = {
    theme: {
        id: "",
        name: "",
        colorScheme: "",
    },
};

export const useThemeStore = create<ThemeState>()(() => ({
    ...initialState,
}));
