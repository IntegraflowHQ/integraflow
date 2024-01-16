import {
    Survey,
    SurveyError,
    SurveyQuestionCountableEdge,
    SurveyQuestionTypeEnum,
    SurveyStatusEnum,
    SurveyTypeEnum,
    SurveyUpdateInput,
    useGetSurveyQuery,
    useSurveyCreateMutation,
    useSurveyDeleteMutation,
    useSurveyQuestionCreateMutation,
    useSurveyUpdateMutation,
} from "@/generated/graphql";
import { ROUTES } from "@/routes";
import { generateRandomString } from "@/utils";
import { createSelectors } from "@/utils/selectors";
import { ApolloError, Reference } from "@apollo/client";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useScrollToBottom } from "react-scroll-to-bottom";
import useWorkspace from "../workspace/hooks/useWorkspace";
import { SURVEY_QUESTION } from "./graphql/fragments/surveyFragment";
import { useSurveyStore } from "./states/survey";

export interface SurveyProviderProp {
    children: React.ReactNode;
}

export type SurveyResponse = {
    surveyErrors: SurveyError[] | null;
    survey?: Survey | null;
};

export type SurveyContextValues = {
    error: ApolloError | undefined;
    openQuestion: string;
    pendingDeletion: boolean;
    surveyLoading: boolean;
    surveyName: string | undefined;
    surveyId: string | undefined;
    surveySlug: string | undefined;
    createSurvey: (template?: string) => Promise<void>;
    setOpenQuestion: (value: string) => void;
    updateSurvey: (
        id: string,
        input: SurveyUpdateInput,
    ) => Promise<SurveyResponse>;
    survey: Survey;
    questions: SurveyQuestionCountableEdge | undefined;
    deleteSurvey: (id: string) => Promise<void | undefined>;
    createQuestion: (type: SurveyQuestionTypeEnum) => Promise<void | undefined>;
};

const createSurveyContext = () =>
    React.createContext<SurveyContextValues | null>(null);

export const SurveyContext = createSurveyContext();

export const SurveyProvider = ({ children }: SurveyProviderProp) => {
    const navigate = useNavigate();
    const { workspace } = useWorkspace();
    const scrollToBottom = useScrollToBottom();
    const { orgSlug, projectSlug, surveySlug } = useParams();

    const surveyStore = createSelectors(useSurveyStore);
    const openQuestion = surveyStore.use.openQuestion();
    const setOpenQuestion = surveyStore.use.setOpenQuestion();

    const [createSurveyMutation] = useSurveyCreateMutation();
    const [createQuestionMutaton] = useSurveyQuestionCreateMutation({});
    const [updateSurveyMutation, { error }] = useSurveyUpdateMutation({});
    const [deleteSurveyMutation, { loading: pendingDeletion }] =
        useSurveyDeleteMutation();

    const {
        data: survey,
        loading: loadingSurvey,
        refetch,
    } = useGetSurveyQuery({
        variables: {
            slug: surveySlug,
        },
        skip: !surveySlug,
    });

    const surveyName = survey?.survey?.name ?? "";
    const surveyId = survey?.survey?.id ?? "";

    // this could make the dependencies of the createQuestion callback
    // change on every render. Wrapping it in a Memo fixes it i guess.
    const questions = React.useMemo(
        () => survey?.survey?.questions?.edges || [],
        [survey?.survey?.questions.edges],
    );

    React.useEffect(() => {
        refetch();
    }, [refetch, surveySlug]);

    const createSurvey = React.useCallback(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        async (_template?: string) => {
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

                        survey: {
                            __typename: "Survey",
                            id: surveyId ?? "",
                            slug: surveySlug ?? "",
                            reference: "",
                            name: survey?.survey?.name ?? "",
                            type: SurveyTypeEnum.Survey,
                            status: SurveyStatusEnum.Draft,
                            settings: survey?.survey?.settings ?? "",
                            theme: survey?.survey?.theme,
                            createdAt: new Date().toISOString(),
                            updatedAt: new Date().toISOString(),

                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                            // @ts-ignore
                            creator: {
                                email: survey?.survey?.creator.email ?? "",
                                firstName:
                                    survey?.survey?.creator.firstName ?? "",
                                lastName:
                                    survey?.survey?.creator.lastName ?? "",
                            },

                            questions: {
                                __typename: "SurveyQuestionCountableConnection",
                                edges: [],
                            },
                            channels: {
                                __typename: "SurveyChannelCountableConnection",
                                edges: [],
                            },
                        },
                        surveyErrors: [],
                        errors: [],
                    },
                },

                update: (cache, { data }) => {
                    if (!data?.surveyCreate?.survey) return;

                    cache.modify({
                        fields: {
                            surveys(existingSurveys = []) {
                                const newSurveyRef = cache.writeFragment({
                                    data: data.surveyCreate?.survey,
                                    fragment: SURVEY_QUESTION,
                                });

                                return {
                                    __typename: "SurveyCountableConnection",
                                    edges: [
                                        ...existingSurveys.edges,
                                        {
                                            __typename: "SurveyCountableEdge",
                                            node: newSurveyRef,
                                        },
                                    ],
                                };
                            },
                        },
                    });
                },

                onError: () => {
                    navigate(
                        ROUTES.SURVEY_LIST.replace(
                            ":orgSlug",
                            orgSlug!,
                        ).replace(":projectSlug", projectSlug!),
                    );
                },
            });
        },

        // why we're this amount od dependencies here is due to the optimisticResponse needing them.
        [
            createSurveyMutation,
            navigate,
            orgSlug,
            projectSlug,
            survey?.survey?.creator.email,
            survey?.survey?.creator.firstName,
            survey?.survey?.creator.lastName,
            survey?.survey?.name,
            survey?.survey?.settings,
            survey?.survey?.theme,
        ],
    );

    const updateSurvey = React.useCallback(
        async (id: string, input: SurveyUpdateInput) => {
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
                            reference: "",
                            name: input?.name ?? "",
                            slug: input?.slug ?? "",
                            type: SurveyTypeEnum.Survey,
                            status: SurveyStatusEnum.Draft,
                            settings: input?.settings ?? "",
                            createdAt: new Date().toISOString(),
                            updatedAt: new Date().toISOString(),

                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                            // @ts-ignore
                            theme: {
                                id: input?.themeId ?? "",
                                name: "",
                                colorScheme: "",
                                reference: "",
                            },
                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                            // @ts-ignore
                            creator: {
                                lastName: "",
                                firstName: "",
                                email: "",
                            },
                            questions: {
                                __typename: "SurveyQuestionCountableConnection",
                                edges: [],
                            },
                            channels: {
                                __typename: "SurveyChannelCountableConnection",
                                edges: [],
                            },
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

            const updatedSurvey = response?.data?.surveyUpdate?.survey;

            const surveyUpdateResponse: SurveyResponse = {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                survey: updatedSurvey,
                surveyErrors: response?.data?.surveyUpdate?.surveyErrors || [],
            };

            return surveyUpdateResponse;
        },
        [updateSurveyMutation],
    );

    const deleteSurvey = React.useCallback(
        async (surveyId: string) => {
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
                                    (surveyRef: Reference) =>
                                        surveyId !== readField("id", surveyRef),
                                );
                            },
                        },
                    });
                },
            });
        },
        [deleteSurveyMutation, survey, workspace?.project.id],
    );

    const createQuestion = React.useCallback(
        async (type: SurveyQuestionTypeEnum) => {
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
                                    data: data.surveyQuestionCreate
                                        ?.surveyQuestion,
                                    fragment: SURVEY_QUESTION,
                                });

                                return {
                                    __typename:
                                        "SurveyQuestionCountableConnection",
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
        },
        [
            createQuestionMutaton,
            questions?.length,
            scrollToBottom,
            setOpenQuestion,
            surveyId,
        ],
    );

    const values = React.useMemo<SurveyContextValues>(
        () => ({
            error,
            surveyId,

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            questions,

            surveyName,
            surveySlug,
            createSurvey,
            openQuestion,
            createQuestion,
            pendingDeletion,
            setOpenQuestion,

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            survey,

            loadingSurvey,
            deleteSurvey,
            updateSurvey,
        }),
        [
            error,
            survey,
            surveyId,
            questions,
            surveyName,
            surveySlug,
            updateSurvey,
            createSurvey,
            deleteSurvey,
            openQuestion,
            loadingSurvey,
            createQuestion,
            pendingDeletion,
            setOpenQuestion,
        ],
    );

    console.log("provider values", values);

    return (
        <SurveyContext.Provider value={values}>
            {children}
        </SurveyContext.Provider>
    );
};
