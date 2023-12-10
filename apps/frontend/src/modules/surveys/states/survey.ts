import { SurveyQuestion } from "@/generated/graphql";
import { create } from "zustand";

export type SurveyState = {
    id: string;
    slug: string;
    questions: SurveyQuestion[];
};

export type SurveyActions = {
    addSurveyDetails: (data: { id: string; slug: string }) => void;
    addQuestion: (question: SurveyQuestion) => void;
    clear: () => void;
};

const initialState: SurveyState = {
    id: "",
    slug: "",
    questions: [],
};

export const useSurveyStore = create<SurveyState & SurveyActions>()((set) => ({
    ...initialState,
    addSurveyDetails: (data) => {
        return set({
            id: data.id,
            slug: data.slug,
        });
    },
    addQuestion: (question) => {
        set((state) => ({
            questions: [...state.questions, question],
        }));
    },
    clear: () => {
        set(initialState);
    },
}));
