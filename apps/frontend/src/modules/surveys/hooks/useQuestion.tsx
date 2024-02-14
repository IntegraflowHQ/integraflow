import {
    SurveyQuestion,
    SurveyQuestionCountableEdge,
    SurveyQuestionCreateInput,
    SurveyQuestionTypeEnum,
    SurveyQuestionUpdateInput,
    useSurveyQuestionCreateMutation,
    useSurveyQuestionDeleteMutation,
    useSurveyQuestionUpdateMutation,
} from "@/generated/graphql";
import { ParsedQuestion, QuestionSettings } from "@/types";
import { parseQuestion } from "@/utils";
import debounce from "lodash.debounce";
import { useCallback, useMemo } from "react";
import { useParams } from "react-router-dom";
import { SURVEY_QUESTION } from "../graphql/fragments/surveyFragment";
import { useQuestionStore } from "../states/question";
import { useSurvey } from "./useSurvey";

export const useQuestion = () => {
    const { surveySlug } = useParams();
    const { parsedQuestions: questions, surveyId, survey } = useSurvey();

    const {
        question: activeQuestion,
        switchQuestion,
        updateQuestion: upsertQuestion,
        clear,
    } = useQuestionStore((state) => state);

    const [createQuestion] = useSurveyQuestionCreateMutation();
    const [deleteQuestion] = useSurveyQuestionDeleteMutation();
    const [updateQuestionMutation] = useSurveyQuestionUpdateMutation();

    const createQuestionMutation = async (input: Partial<SurveyQuestionCreateInput>) => {
        const id = crypto.randomUUID();
        if (!surveyId) return;
        if (input.options) input.options = JSON.stringify([...input.options]);
        if (input.settings) input.settings = JSON.stringify({ ...input.settings });
        await createQuestion({
            variables: {
                input: {
                    ...input,
                    orderNumber: questions.length + 1,
                    surveyId: surveyId,
                },
            },
            optimisticResponse: {
                __typename: "Mutation",
                surveyQuestionCreate: {
                    __typename: "SurveyQuestionCreate",
                    surveyQuestion: {
                        __typename: "SurveyQuestion",
                        id: id,
                        createdAt: new Date().toISOString(),
                        description: input.description ?? "",
                        label: input.label ?? "",
                        maxPath: 0,
                        orderNumber: questions.length + 1,
                        reference: id,
                        type: input.type!,
                        settings: input.settings ?? {},
                        options: input.options ?? [],
                        survey: survey?.survey,
                    },
                    surveyErrors: [],
                    errors: [],
                },
            },
            update: (cache, { data }) => {
                if (!data?.surveyQuestionCreate?.surveyQuestion) {
                    return;
                }

                switchQuestion(parseQuestion(data.surveyQuestionCreate?.surveyQuestion as SurveyQuestion));

                cache.modify({
                    id: `Survey:${surveyId}`,
                    fields: {
                        questions(existingQuestions = []) {
                            const newQuestionRef = cache.writeFragment({
                                data: data.surveyQuestionCreate?.surveyQuestion,
                                fragment: SURVEY_QUESTION,
                            });

                            return {
                                __typename: "SurveyQuestionCountableConnection",
                                edges: [
                                    ...existingQuestions.edges,
                                    {
                                        __typename: "SurveyQuestionCountableEdge",
                                        node: newQuestionRef,
                                    },
                                ],
                            };
                        },
                    },
                });
            },
        });
    };

    const questionUpdate = async (input: Partial<SurveyQuestionUpdateInput>) => {
        if (input.options) input.options = JSON.stringify([...input.options]);

        if (input.settings) input.settings = JSON.stringify({ ...input.settings });

        await updateQuestionMutation({
            variables: {
                id: activeQuestion?.id ?? "",
                input: {
                    ...input,
                    orderNumber: activeQuestion?.orderNumber ?? 0,
                },
            },
            optimisticResponse: {
                __typename: "Mutation",
                surveyQuestionUpdate: {
                    __typename: "SurveyQuestionUpdate",
                    surveyQuestion: {
                        __typename: "SurveyQuestion",
                        ...activeQuestion,
                        id: activeQuestion?.id ?? "",
                        createdAt: activeQuestion?.createdAt ?? new Date().toISOString(),
                        description: input.description ?? activeQuestion?.description ?? "",
                        label: activeQuestion?.label ?? "",
                        maxPath: activeQuestion?.maxPath ?? 0,
                        orderNumber: activeQuestion?.orderNumber ?? 0,
                        reference: activeQuestion?.reference,
                        type: activeQuestion?.type as SurveyQuestionTypeEnum,
                        settings: input.settings ?? activeQuestion?.settings,
                        options: input.options ?? activeQuestion?.options,
                        survey: survey?.survey,
                    },
                    surveyErrors: [],
                    errors: [],
                },
            },
            update: (cache, { data }) => {
                if (!data?.surveyQuestionUpdate?.surveyQuestion) {
                    return;
                }

                cache.writeFragment({
                    id: `SurveyQuestion:${activeQuestion}`,
                    fragment: SURVEY_QUESTION,
                    data: data.surveyQuestionUpdate?.surveyQuestion,
                });
            },
        });
    };

    const deleteQuestionMutation = async (question: SurveyQuestion) => {
        if (!surveyId) {
            return;
        }

        await deleteQuestion({
            variables: {
                id: question.id,
            },
            optimisticResponse: {
                __typename: "Mutation",
                surveyQuestionDelete: {
                    __typename: "SurveyQuestionDelete",
                    surveyQuestion: {
                        __typename: "SurveyQuestion",
                        ...activeQuestion,
                        ...question,
                    },

                    surveyErrors: [],
                    errors: [],
                },
            },

            update: (cache, { data }) => {
                if (!data?.surveyQuestionDelete?.surveyQuestion) {
                    return;
                }

                cache.modify({
                    id: `Survey:${surveyId}`,
                    fields: {
                        questions(existingQuestions, { readField }) {
                            return {
                                __typeName: "SurveyQuestionCountableConnection",
                                edges: existingQuestions.edges.filter(
                                    (edge: SurveyQuestionCountableEdge) => readField("id", edge.node) !== question.id,
                                ),
                            };
                        },
                    },
                });
            },
        });
    };

    const debouncedQuestionUpdate = useMemo(() => debounce(questionUpdate, 1000), [activeQuestion?.id]);

    const updateQuestion = useCallback(
        (input: Partial<ParsedQuestion>, debounce = false) => {
            upsertQuestion(input);
            if (debounce) {
                debouncedQuestionUpdate(input);
            } else {
                questionUpdate(input);
            }
        },
        [debouncedQuestionUpdate, activeQuestion],
    );

    const updateSettings = useCallback(
        (input: Partial<QuestionSettings>, debounce = false) => {
            updateQuestion(
                {
                    settings: { ...(activeQuestion?.settings ?? {}), ...input },
                },
                debounce,
            );
        },
        [activeQuestion?.settings, updateQuestion],
    );

    return {
        question: activeQuestion,
        surveySlug,
        switchQuestion,
        updateQuestion,
        updateSettings,
        clear,
        createQuestionMutation,
        deleteQuestionMutation,
    };
};
