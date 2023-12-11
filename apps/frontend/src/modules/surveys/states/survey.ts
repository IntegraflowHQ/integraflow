import { ProjectTheme, SurveyQuestion } from "@/generated/graphql";
import { create } from "zustand";

export type SurveyState = {
    id: string;
    slug: string;
    questions: SurveyQuestion[];
    theme: ProjectTheme | null;
};

export type SurveyActions = {
    addSurveyDetails: (data: { id: string; slug: string }) => void;
    addQuestion: (question: SurveyQuestion) => void;
    addSurveyTheme: (theme: ProjectTheme) => void;
    clear: () => void;
};

const initialState: SurveyState = {
    id: "",
    slug: "",
    questions: [],
    theme: null,
};

export const useSurveyStore = create<SurveyState & SurveyActions>()((set) => ({
    ...initialState,

    addSurveyTheme: (data) => {
        set({
            theme: {
                ...data,
                colorScheme: {
                    ...data.colorScheme,
                    answer: data.colorScheme.answer || "#000000",
                    button: data.colorScheme.button || "#000000",
                    primary: data.colorScheme.progress || "#000000",
                    secondary: data.colorScheme.question || "#000000",
                    tertiary: data.colorScheme.background || "#000000",
                },
            },
        });
    },

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
