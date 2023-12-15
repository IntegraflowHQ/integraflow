import {
    SurveyQuestion,
    SurveyQuestionCountableEdge,
    SurveyQuestionTypeEnum,
    SurveyQuestionUpdateInput,
    useGetSurveyLazyQuery,
    useSurveyQuestionCreateMutation,
    useSurveyQuestionDeleteMutation,
    useSurveyQuestionUpdateMutation,
} from "@/generated/graphql";
import { createSelectors } from "@/utils/selectors";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useScrollToBottom } from "react-scroll-to-bottom";
import { SURVEY_QUESTION } from "../graphql/fragments/surveyFragment";
import { useSurveyStore } from "../states/survey";

export const useQuestion = () => {
    const { surveySlug } = useParams();
    const scrollToBottom = useScrollToBottom();

    const surveyStore = createSelectors(useSurveyStore);
    const openQuestion = surveyStore.use.openQuestion();
    const setOpenQuestion = surveyStore.use.setOpenQuestion();

    const [createQuestionMutaton] = useSurveyQuestionCreateMutation({});
    const [deleteQuestion] = useSurveyQuestionDeleteMutation();
    const [updateQuestion] = useSurveyQuestionUpdateMutation();

    const [getSurveyQuery, { data: survey }] = useGetSurveyLazyQuery();

    const questions = survey?.survey?.questions?.edges || [];
    const currentQuestion = questions.find(
        (question) => question?.node?.id === openQuestion,
    );
    const surveyId = survey?.survey?.id;

    useEffect(() => {
        const getSurvey = async () => {
            if (!surveySlug) return;
            await getSurveyQuery({
                variables: {
                    slug: surveySlug,
                },
            });
        };
        getSurvey();
    }, [surveySlug]);

    const createQuestion = async (type: SurveyQuestionTypeEnum) => {
        const id = crypto.randomUUID();
        if (!surveyId) return;
        await createQuestionMutaton({
            variables: {
                input: {
                    orderNumber: questions.length + 1,
                    surveyId: surveyId,
                    id,
                    type: type,
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
                        description: "",
                        label: "",
                        maxPath: 0,
                        orderNumber: questions.length + 1,
                        reference: id,
                        type: type,
                        settings: null,
                        options: null,
                    },
                    surveyErrors: [],
                    errors: [],
                },
            },
            update: (cache, { data }) => {
                setOpenQuestion(id);

                if (!data?.surveyQuestionCreate?.surveyQuestion) return;
                console.log(cache);
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
            onCompleted: ({ surveyQuestionCreate }) => {
                const { surveyQuestion } = surveyQuestionCreate ?? {};
                setOpenQuestion(surveyQuestion?.id as string);
                scrollToBottom();
            },
        });
    };

    const updateQuestionMutation = async (input: SurveyQuestionUpdateInput) => {
        if (!surveyId) return;

        await updateQuestion({
            variables: {
                id: openQuestion,
                input: {
                    ...input,
                },
            },
            optimisticResponse: {
                __typename: "Mutation",
                surveyQuestionUpdate: {
                    __typename: "SurveyQuestionUpdate",
                    surveyQuestion: {
                        __typename: "SurveyQuestion",
                        ...currentQuestion?.node,
                        id: openQuestion,
                        createdAt:
                            currentQuestion?.node?.createdAt ??
                            new Date().toISOString(),
                        description:
                            input.description ??
                            currentQuestion?.node?.description ??
                            "",
                        label:
                            input.label ?? currentQuestion?.node?.label ?? "",
                        maxPath: currentQuestion?.node?.maxPath ?? 0,
                        orderNumber:
                            input.orderNumber ??
                            currentQuestion?.node?.orderNumber,
                        reference: currentQuestion?.node?.reference,
                        type: currentQuestion?.node
                            ?.type as SurveyQuestionTypeEnum,
                        settings:
                            input.settings ?? currentQuestion?.node?.settings,
                        options:
                            input.options ?? currentQuestion?.node?.options,
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
        console.log(currentQuestion?.node);
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
                        ...currentQuestion?.node,
                    },

                    surveyErrors: [],
                    errors: [],
                },
            },

            update: (cache, { data }) => {
                if (!data?.surveyQuestionDelete?.surveyQuestion) return;
                console.log(cache);
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
        createQuestion,
        questions,
        surveySlug,
        setOpenQuestion,
        openQuestion,
        updateQuestionMutation,
        currentQuestion,
        deleteQuestionMutation,
    };
};
