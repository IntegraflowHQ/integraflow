import { PreviewMode, Theme, ViewPortType } from "@/types";
import { create } from "zustand";

export type StudioState = {
    studioModeIsActive: boolean;
    currentEvent: string;
    addingAudienceProperty: boolean;
    theme: Theme | null;
    previewMode: PreviewMode;
    previewViewport: ViewPortType;
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
    theme: null,
    previewMode: "sdk",
    previewViewport: "desktop",
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
