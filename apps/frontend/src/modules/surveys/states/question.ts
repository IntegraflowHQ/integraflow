import { ParsedQuestion } from "@/types";
import { create } from "zustand";

export type QuestionState = {
    question: ParsedQuestion | null;
};

export type QuestionActions = {
    switchQuestion: (question: ParsedQuestion) => void;
    updateQuestion: (data: Partial<ParsedQuestion>) => void;
    clear: () => void;
};

const initialState: QuestionState = {
    question: null,
};

export const useQuestionStore = create<QuestionState & QuestionActions>()((set, get) => ({
    ...initialState,
    switchQuestion: (question) => {
        set({ question });
    },
    updateQuestion: (data) => {
        const currentQuestion = get().question;
        if (currentQuestion) {
            set({
                question: {
                    ...currentQuestion,
                    ...data,
                },
            });
        }
    },
    clear: () => set({ question: null }),
}));
