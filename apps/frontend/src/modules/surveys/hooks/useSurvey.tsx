import {
    SurveyQuestionTypeEnum,
    SurveyTypeEnum,
    SurveyUpdateInput,
    useGetSurveyQuery,
    useSurveyCreateMutation,
    useSurveyDeleteMutation,
    useSurveyQuestionCreateMutation,
    useSurveyUpdateMutation,
} from "@/generated/graphql";
import useWorkspace from "@/modules/workspace/hooks/useWorkspace";
import { ROUTES } from "@/routes";
import { generateRandomString } from "@/utils";
import { createSelectors } from "@/utils/selectors";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useScrollToBottom } from "react-scroll-to-bottom";
import { SURVEY_QUESTION } from "../graphql/fragments/surveyFragment";
import { useSurveyStore } from "../states/survey";

export const useSurvey = () => {
    const { orgSlug, projectSlug, surveySlug } = useParams();
    const scrollToBottom = useScrollToBottom();
    const navigate = useNavigate();
    const { workspace } = useWorkspace();
    // const client = useApolloClient();

    const surveyStore = createSelectors(useSurveyStore);
    const openQuestion = surveyStore.use.openQuestion();
    const setOpenQuestion = surveyStore.use.setOpenQuestion();

    const [createSurveyMutation] = useSurveyCreateMutation();
    const [createQuestionMutaton] = useSurveyQuestionCreateMutation({});
    const [updateSurveyMutation, { error }] = useSurveyUpdateMutation({});
    const [deleteSurveyMutation, { loading: deleteLoading }] =
        useSurveyDeleteMutation();

    const {
        data: survey,
        loading,
        refetch,
    } = useGetSurveyQuery({
        variables: {
            slug: surveySlug,
        },
        skip: !surveySlug,
    });

    const questions = survey?.survey?.questions?.edges || [];
    const surveyId = survey?.survey?.id;

    useEffect(() => {
        refetch();
    }, [refetch, surveySlug]);

    const createSurvey = async (_template?: string) => {
        const surveySlug = `survey-${generateRandomString(10)}`;
        navigate(
            ROUTES.STUDIO.replace(":orgSlug", orgSlug!)
                .replace(":projectSlug", projectSlug!)
                .replace(":surveySlug", surveySlug),
        );
        const surveyId = crypto.randomUUID();

        await createSurveyMutation({
            variables: {
                input: {
                    id: surveyId,
                    slug: surveySlug,
                },
            },
            optimisticResponse: {
                __typename: "Mutation",
                surveyCreate: {
                    __typename: "SurveyCreate",

                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    survey: {
                        __typename: "Survey",
                        id: surveyId,
                        slug: surveySlug,
                    },
                    surveyErrors: [],
                    errors: [],
                },
            },

            onError: () => {
                navigate(
                    ROUTES.SURVEY_LIST.replace(":orgSlug", orgSlug!).replace(
                        ":projectSlug",
                        projectSlug!,
                    ),
                );
            },
        });
    };

    const updateSurvey = async (id: string, input: SurveyUpdateInput) => {
        const response = await updateSurveyMutation({
            variables: {
                id,
                input,
            },
            optimisticResponse: {
                __typename: "Mutation",
                surveyUpdate: {
                    __typename: "SurveyUpdate",

                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    survey: {
                        __typename: "Survey",
                        id,
                        ...input,
                    },
                    surveyErrors: [],
                    errors: [],
                },
            },
            update: (cache, { data }) => {
                if (!data?.surveyUpdate?.survey) return;

                cache.modify({
                    id: cache.identify(data?.surveyUpdate?.survey),
                    fields: {
                        survey(existingSurvey = {}) {
                            return {
                                ...existingSurvey,
                                edges: [...existingSurvey.edges],
                            };
                        },
                    },
                });
            },
        });

        return {
            response,
            error: response.errors,
        };
    };

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
                        id: "temp-id",
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
            onCompleted: ({ surveyQuestionCreate }) => {
                const { surveyQuestion } = surveyQuestionCreate ?? {};
                setOpenQuestion(surveyQuestion?.id as string);
                scrollToBottom();
            },
        });
    };

    const deleteSurvey = async (surveyId: string) => {
        await deleteSurveyMutation({
            variables: {
                id: surveyId,
            },
            context: {
                headers: {
                    Project: workspace?.project.id,
                },
            },

            optimisticResponse: {
                __typename: "Mutation",
                surveyDelete: {
                    __typename: "SurveyDelete",

                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    survey: {
                        ...survey,
                        __typename: "Survey",
                        id: surveyId,
                        type: survey?.survey?.type ?? SurveyTypeEnum.Survey,
                    },
                },
            },

            update: (cache, { data }) => {
                if (!data) return;

                cache.modify({
                    fields: {
                        surveys(existingSurveys = [], { readField }) {
                            return existingSurveys.filter(
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                (surveyRef: any) =>
                                    surveyId !== readField("id", surveyRef),
                            );
                        },
                    },
                });
            },
        });
    };

    return {
        error,
        createSurvey,
        createQuestion,
        questions,
        surveySlug,
        deleteLoading,
        setOpenQuestion,
        openQuestion,
        surveyId,
        survey,
        loading,
        deleteSurvey,
        updateSurvey,
    };
};
