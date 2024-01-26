import { SurveyQuestion } from "@/generated/graphql";
import { create } from "zustand";

export type SurveyState = {
    openQuestion: SurveyQuestion | undefined;
};

export type SurveyActions = {
    setOpenQuestion: (question: SurveyQuestion) => void;
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
