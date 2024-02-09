import { ParsedQuestion } from "@/types";
import { create } from "zustand";

export type SurveyState = {
    openQuestion?: ParsedQuestion;
};

export type SurveyActions = {
    setOpenQuestion: (question: ParsedQuestion) => void;
};

const initialState: SurveyState = {
    openQuestion: undefined,
};

export const useSurveyStore = create<SurveyState & SurveyActions>()((set) => ({
    ...initialState,
    setOpenQuestion: (question) => {
        set({
            openQuestion: question,
        });
    },
}));
