import {
    SurveyQuestionTypeEnum,
    useGetSurveyLazyQuery,
    useSurveyCreateMutation,
    useSurveyQuestionCreateMutation,
    useSurveyQuestionUpdateMutation,
} from "@/generated/graphql";
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

    const surveyStore = createSelectors(useSurveyStore);
    const openQuestion = surveyStore.use.openQuestion();
    const setOpenQuestion = surveyStore.use.setOpenQuestion();

    const [createSurveyMutation] = useSurveyCreateMutation();
    const [createQuestionMutaton] = useSurveyQuestionCreateMutation({});
    const [updateQuestion] = useSurveyQuestionUpdateMutation();

    const [getSurveyQuery, { data: survey }] = useGetSurveyLazyQuery();

    const questions = survey?.survey?.questions?.edges || [];
    const surveyId = survey?.survey?.id;
    console.log(surveyId);
    console.log(openQuestion);

    useEffect(() => {
        const getSurvey = async () => {
            if (!surveySlug) return;
            await getSurveyQuery({
                variables: {
                    slug: surveySlug,
                },
                onCompleted: (data) => {
                    console.log("data:", data);
                },
            });
        };
        getSurvey();
    }, [surveySlug]);

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

    const updateQuestionMutation = async (
        type: SurveyQuestionTypeEnum,
        options: {
            description?: string;
            label?: string;
            settings?: any;
            options?: any;
        },
    ) => {
        if (!surveyId) return;
        const result = await updateQuestion({
            variables: {
                id: openQuestion,
                input: {
                    orderNumber: 0,
                    description: options.description,
                    label: options.label,
                    options: options.options,
                    settings: options.settings,
                    type,
                },
            },
        });
        console.log(result);
    };

    return {
        createSurvey,
        createQuestion,
        questions,
        surveySlug,
        setOpenQuestion,
        openQuestion,
        updateQuestionMutation,
    };
};
