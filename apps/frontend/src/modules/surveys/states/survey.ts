import { Survey, SurveyQuestion } from "@/generated/graphql";
import { create } from "zustand";

export type SurveyState = {
    id: string;
    slug: string;
    questions: SurveyQuestion[];
    openQuestion: string;
};

export type SurveyActions = {
    addSurveyDetails: (data: { id: string; slug: string }) => void;
    addQuestion: (question: SurveyQuestion) => void;
    setOpenQuestion: (view: string) => void;
    setSurvey: (data: Survey) => void;
    clear: () => void;
};

const initialState: SurveyState = {
    id: "",
    slug: "",
    questions: [],
    openQuestion: "", //the value of the open accordion question
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
        console.log(question);
    },
    setSurvey: (survey) => {
        console.log(survey);
        set({
            id: survey.id,
            slug: survey.slug,
            questions: survey.questions.edges.map((edge) => edge.node),
        });
    },
    setOpenQuestion: (view) => {
        set({
            openQuestion: view,
        });
    },
    clear: () => {
        set(initialState);
    },
}));
