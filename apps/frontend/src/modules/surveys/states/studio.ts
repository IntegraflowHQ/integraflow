import { create } from "zustand";

export type StudioState = {
    studioModeIsActive: boolean;
    currentEvent: string;
    addingAudienceProperty: boolean;
};

export type StudioActions = {
    enableStudioMode: () => void;
    disableStudioMode: () => void;
    updateStudio: (data: Partial<StudioState>) => void;
};

const initialState: StudioState = {
    studioModeIsActive: false,
    currentEvent: "",
    addingAudienceProperty: false,
};

export const useStudioStore = create<StudioState & StudioActions>()((set) => ({
    ...initialState,
    enableStudioMode: () =>
        set({
            studioModeIsActive: true,
        }),
    disableStudioMode: () => set({ studioModeIsActive: false }),
    updateStudio: (data) => set(data),
}));
