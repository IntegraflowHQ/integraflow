import { create } from "zustand";

export type StudioState = {
    studioModeIsActive: boolean;
    themeName: string;
    colors: string[];
};

export type StudioActions = {
    enableStudioMode: () => void;
    disableStudioMode: () => void;
    saveTheme: (themeName: string, colors: string[]) => void;
};

const initialState: StudioState = {
    studioModeIsActive: false,
    themeName: "",
    colors: [],
};

export const useStudioStore = create<StudioState & StudioActions>()((set) => ({
    ...initialState,
    saveTheme: (themeName, colors) => {
        set({ themeName, colors });
    },

    enableStudioMode: () =>
        set({
            studioModeIsActive: true,
        }),

    disableStudioMode: () => set({ studioModeIsActive: false }),
}));
