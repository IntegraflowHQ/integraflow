import { create } from "zustand";

export type SurveyState = {
    openQuestion: string;
};

export type SurveyActions = {
    setOpenQuestion: (view: string) => void;
};

const initialState: SurveyState = {
    openQuestion: "", //the value of the open accordion question
};

export const useSurveyStore = create<SurveyState & SurveyActions>()((set) => ({
    ...initialState,
    setOpenQuestion: (view) => {
        set({
            openQuestion: view,
        });
    },
}));
