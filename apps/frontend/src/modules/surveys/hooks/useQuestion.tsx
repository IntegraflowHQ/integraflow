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
import { createSelectors } from "@/utils/selectors";
import { CTAType } from "@integraflow/web/src/types";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useScrollToBottom } from "react-scroll-to-bottom";
import { SURVEY_QUESTION } from "../graphql/fragments/surveyFragment";
import { useSurveyStore } from "../states/survey";
import { useSurvey } from "./useSurvey";

export const useQuestion = () => {
    const { surveySlug } = useParams();
    const scrollToBottom = useScrollToBottom();
    const { survey, parsedQuestions } = useSurvey();

    const surveyStore = createSelectors(useSurveyStore);
    const setOpenQuestion = surveyStore.use.setOpenQuestion();
    const openQuestion = surveyStore.use.openQuestion();

    const surveyId = survey?.survey?.id;

    const welcomeMessage = parsedQuestions.find(
        (question) => question.settings?.ctaType === CTAType.NEXT,
    );
    const thankYouMessage = parsedQuestions.find(
        (question) => question.settings?.ctaType !== CTAType.NEXT,
    );
    const [welcomeMessageExists, setWelcomeMessageExists] = useState<boolean>(
        !!welcomeMessage,
    );
    const [thankYouMessageExists, setThankYouMessageExists] = useState<boolean>(
        !!thankYouMessage,
    );

    useEffect(() => {
        setWelcomeMessageExists(!!welcomeMessage);
        setThankYouMessageExists(!!thankYouMessage);
    }, [welcomeMessage, thankYouMessage]);

    const [createQuestion] = useSurveyQuestionCreateMutation();
    const [deleteQuestion] = useSurveyQuestionDeleteMutation();
    const [updateQuestion] = useSurveyQuestionUpdateMutation();

    const createQuestionMutation = async (
        input: Partial<SurveyQuestionCreateInput>,
    ) => {
        const id = crypto.randomUUID();
        if (input.options) input.options = JSON.stringify([...input.options]);
        if (input.settings)
            input.settings = JSON.stringify({ ...input.settings });
        await createQuestion({
            variables: {
                input: {
                    ...input,
                    orderNumber: parsedQuestions.length + 1,
                    surveyId: surveyId ?? "",
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
                        orderNumber: parsedQuestions.length + 1,
                        reference: id,
                        type: input.type!,
                        settings: input.settings ?? {},
                        options: input.options ?? [],
                    },
                    surveyErrors: [],
                    errors: [],
                },
            },
            update: (cache, { data }) => {
                if (!data?.surveyQuestionCreate?.surveyQuestion) return;
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
                                        __typename:
                                            "SurveyQuestionCountableEdge",
                                        node: newQuestionRef,
                                    },
                                ],
                            };
                        },
                    },
                });
            },
            onCompleted(data) {
                setOpenQuestion(
                    data.surveyQuestionCreate?.surveyQuestion as SurveyQuestion,
                );
            },
        });
    };

    const updateQuestionMutation = async (
        input: Partial<SurveyQuestionUpdateInput>,
    ) => {
        if (input.options) input.options = JSON.stringify([...input.options]);

        if (input.settings)
            input.settings = JSON.stringify({ ...input.settings });

        await updateQuestion({
            variables: {
                id: openQuestion?.id ?? "",
                input: {
                    ...input,
                    orderNumber: openQuestion?.orderNumber ?? 0,
                },
            },
            optimisticResponse: {
                __typename: "Mutation",
                surveyQuestionUpdate: {
                    __typename: "SurveyQuestionUpdate",
                    surveyQuestion: {
                        __typename: "SurveyQuestion",
                        ...openQuestion,
                        id: openQuestion?.id ?? "",
                        createdAt:
                            openQuestion?.createdAt ?? new Date().toISOString(),
                        description:
                            input.description ??
                            openQuestion?.description ??
                            "",
                        label: openQuestion?.label ?? "",
                        maxPath: openQuestion?.maxPath ?? 0,
                        orderNumber: openQuestion?.orderNumber ?? 0,
                        reference: openQuestion?.reference,
                        type: openQuestion?.type as SurveyQuestionTypeEnum,
                        settings: input.settings ?? openQuestion?.settings,
                        options: input.options ?? openQuestion?.options,
                    },
                    surveyErrors: [],
                    errors: [],
                },
            },
            update: (cache, { data }) => {
                if (!data?.surveyQuestionUpdate?.surveyQuestion) return;
                cache.writeFragment({
                    id: `SurveyQuestion:${openQuestion}`,
                    fragment: SURVEY_QUESTION,
                    data: data.surveyQuestionUpdate?.surveyQuestion,
                });
            },
        });
    };

    const deleteQuestionMutation = async (question: SurveyQuestion) => {
        if (!surveyId) return;
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
                        ...question,
                        ...openQuestion,
                    },

                    surveyErrors: [],
                    errors: [],
                },
            },

            update: (cache, { data }) => {
                if (!data?.surveyQuestionDelete?.surveyQuestion) return;
                cache.modify({
                    id: `Survey:${surveyId}`,
                    fields: {
                        questions(existingQuestions, { readField }) {
                            return {
                                __typeName: "SurveyQuestionCountableConnection",
                                edges: existingQuestions.edges.filter(
                                    (edge: SurveyQuestionCountableEdge) =>
                                        readField("id", edge.node) !==
                                        question.id,
                                ),
                            };
                        },
                    },
                });
            },
        });
    };

    return {
        createQuestionMutation,
        surveySlug,
        openQuestion,
        setOpenQuestion,
        updateQuestionMutation,
        deleteQuestionMutation,
        welcomeMessageExists,
        setWelcomeMessageExists,
        thankYouMessageExists,
        setThankYouMessageExists,
    };
};
