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
import { parseQuestion } from "@/utils";
import { CTAType } from "@integraflow/web/src/types";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { SURVEY_QUESTION } from "../graphql/fragments/surveyFragment";
import { useSurveyStore } from "../states/survey";
import { useSurvey } from "./useSurvey";

export const useQuestion = () => {
    const { surveySlug } = useParams();
    const { parsedQuestions, surveyId } = useSurvey();
    const { openQuestion, setOpenQuestion } = useSurveyStore((state) => state);

    const [welcomeMessageExists, setWelcomeMessageExists] =
        useState<boolean>(false);
    const [thankYouMessageExists, setThankYouMessageExists] =
        useState<boolean>(false);

    useEffect(() => {
        const welcomeMessage = parsedQuestions.find(
            (question) => question.settings?.type === CTAType.NEXT,
        );
        const thankYouMessage = parsedQuestions.find((question) => {
            if (question.settings?.type) {
                [CTAType.CLOSE, CTAType.LINK, CTAType.HIDDEN].includes(
                    question.settings?.type as CTAType,
                );
            }
        });
        setWelcomeMessageExists(!!welcomeMessage);
        setThankYouMessageExists(!!thankYouMessage);
    }, [parsedQuestions]);

    const [createQuestion] = useSurveyQuestionCreateMutation();
    const [deleteQuestion] = useSurveyQuestionDeleteMutation();
    const [updateQuestion] = useSurveyQuestionUpdateMutation();

    const createQuestionMutation = async (
        input: Partial<SurveyQuestionCreateInput>,
    ) => {
        const id = crypto.randomUUID();
        if (!surveyId) return;
        if (input.options) input.options = JSON.stringify([...input.options]);
        if (input.settings)
            input.settings = JSON.stringify({ ...input.settings });
        await createQuestion({
            variables: {
                input: {
                    ...input,
                    orderNumber: parsedQuestions.length + 1,
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
                console.log("newQuestion: ", data);
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
                if (data.surveyQuestionCreate?.surveyQuestion) {
                    setOpenQuestion(
                        parseQuestion(
                            data.surveyQuestionCreate
                                ?.surveyQuestion as SurveyQuestion,
                        ),
                    );
                }
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
            onCompleted: (data) => {
                if (data.surveyQuestionUpdate?.surveyQuestion) {
                    setOpenQuestion(
                        parseQuestion(
                            data.surveyQuestionUpdate
                                ?.surveyQuestion as SurveyQuestion,
                        ),
                    );
                }
            },
        });
    };

    const deleteQuestionMutation = async (question: SurveyQuestion) => {
        if (surveyId) return;
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
