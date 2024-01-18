import {
    OrderDirection,
    PageInfo,
    Survey,
    SurveyCountableConnection,
    SurveyError,
    SurveyFilterInput,
    SurveyQuestionCountableEdge,
    SurveyQuestionTypeEnum,
    SurveySortField,
    SurveyStatusEnum,
    SurveyTypeEnum,
    SurveyUpdateInput,
    useGetSurveyListQuery,
    useGetSurveyQuery,
    useSurveyCreateMutation,
    useSurveyDeleteMutation,
    useSurveyQuestionCreateMutation,
    useSurveyUpdateMutation,
} from "@/generated/graphql";
import { ROUTES } from "@/routes";
import { generateRandomString } from "@/utils";
import { createSelectors } from "@/utils/selectors";
import { ApolloError, InMemoryCache, Reference } from "@apollo/client";
import { relayStylePagination } from "@apollo/client/utilities";
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
    surveysOnPage: number;
    totalSurveys: number | null | undefined;
    pageInfo: PageInfo | undefined;
    loading: boolean;
    error: ApolloError | undefined;
    openQuestion: string;
    surveyName: string | undefined;
    selectedSurveyTheme: string | undefined;
    surveyId: string | undefined;
    surveyExperienceSettings: string | undefined;
    surveySlug: string | undefined;
    createSurvey: (template?: string) => Promise<void>;
    setOpenQuestion: (value: string) => void;
    updateSurvey: (
        id: string,
        input: SurveyUpdateInput,
    ) => Promise<SurveyResponse | undefined>;
    survey: Survey;
    surveyList: SurveyCountableConnection | undefined;
    questions: SurveyQuestionCountableEdge | undefined;
    deleteSurvey: (id: string) => Promise<void | undefined>;
    getMoreSurveys: (direction: string) => Promise<void | undefined>;
    createQuestion: (type: SurveyQuestionTypeEnum) => Promise<void | undefined>;
};

const createSurveyContext = () =>
    React.createContext<SurveyContextValues | null>(null);

export const SurveyContext = createSurveyContext();

export const SurveyProvider = ({ children }: SurveyProviderProp) => {
    const SURVEYS_PER_PAGE = 10;

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
        refetch: refetchSurvey,
    } = useGetSurveyQuery({
        variables: {
            slug: surveySlug,
        },
        skip: !surveySlug,
    });

    const {
        refetch,
        fetchMore,
        data: surveyList,
        loading: surveyListLoading,
    } = useGetSurveyListQuery({
        variables: {
            first: SURVEYS_PER_PAGE,
            sortBy: {
                field: SurveySortField.CreatedAt,
                direction: OrderDirection.Desc,
            },
        },
        context: {
            headers: {
                Project: workspace?.project.id,
            },
        },
        notifyOnNetworkStatusChange: true,
    });

    const surveyName = survey?.survey?.name ?? "";
    const surveyId = survey?.survey?.id ?? "";
    const surveyExperienceSettings = survey?.survey?.settings ?? "";

    const totalCount = surveyList?.surveys?.totalCount;
    const pageInfo = surveyList?.surveys?.pageInfo;

    const transformedSurveyList = surveyList?.surveys?.edges?.map((edge) => {
        return {
            id: edge?.node?.id,
            slug: edge?.node?.slug,
            status: edge?.node?.status,
            createdAt: edge?.node?.createdAt,
            name: edge?.node?.name ? edge?.node?.name : "Untitled survey",
            creator: {
                email: edge?.node?.creator.email,
                fullName: `${edge?.node?.creator.firstName} ${edge?.node?.creator.lastName}`,
            },
        };
    });

    // this could make the dependencies of the createQuestion callback
    // change on every render. Wrapping it in a Memo fixes it i guess.
    const questions = React.useMemo(
        () => survey?.survey?.questions?.edges || [],
        [survey?.survey?.questions.edges],
    );

    // unique survey
    React.useEffect(() => {
        refetchSurvey();
    }, [refetchSurvey, surveySlug, surveyName]);

    // when there's a switch between projects... return the survey list
    // unique to that selected project.
    React.useEffect(() => {
        refetch();
    }, [refetch, projectSlug]);

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
                            name: "",
                            type: SurveyTypeEnum.Survey,
                            status: SurveyStatusEnum.Draft,
                            settings: "",
                            theme: null,
                            createdAt: new Date().toISOString(),
                            updatedAt: new Date().toISOString(),

                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                            // @ts-ignore
                            creator: {
                                email: "",
                                firstName: "",
                                lastName: "",
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
        [createSurveyMutation, navigate, orgSlug, projectSlug],
    );

    const getMoreSurveys = React.useCallback(
        async (direction: string) => {
            let paginationVariables = {};

            if (direction === "forward") {
                paginationVariables = {
                    first: SURVEYS_PER_PAGE,
                    after: pageInfo?.endCursor,
                };
            } else if (direction === "backward") {
                paginationVariables = {
                    first: undefined,
                    last: SURVEYS_PER_PAGE,
                    before: pageInfo?.startCursor,
                };
            }

            fetchMore({
                variables: paginationVariables,

                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                updateQuery: (prevResult, { fetchMoreResult }) => {
                    if (!fetchMoreResult) return prevResult;

                    const newEdges = fetchMoreResult.surveys?.edges;
                    const pageInfo = fetchMoreResult.surveys?.pageInfo;

                    return newEdges?.length
                        ? {
                              surveys: {
                                  pageInfo,
                                  edges: newEdges,
                                  __typename: prevResult.surveys?.__typename,
                                  totalCount: prevResult.surveys?.totalCount,
                              },
                          }
                        : prevResult;
                },
            });

            new InMemoryCache({
                typePolicies: {
                    Query: {
                        fields: {
                            // its better to use Relay's pagination style to handle our cache
                            // save us the burden of writing a cache logic and worrying about which edges nodes
                            // to merge with the existing cache
                            surveys: relayStylePagination(),
                        },
                    },
                },
            });
        },
        [fetchMore, pageInfo?.endCursor, pageInfo?.startCursor],
    );

    // Future work...
    const filterSurveyList = React.useCallback(
        async (input: SurveyFilterInput) => {
            // console.log("here's your input", input);

            await refetch({
                filter: input,
            });
        },
        [refetch],
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
            pageInfo,
            surveySlug,
            createSurvey,
            openQuestion,
            createQuestion,
            setOpenQuestion,
            totalSurveys: totalCount,
            surveysOnPage: SURVEYS_PER_PAGE,

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            survey,
            deleteSurvey,
            updateSurvey,
            getMoreSurveys,
            filterSurveyByName: filterSurveyList,
            surveyExperienceSettings,

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            surveyList: transformedSurveyList,
            loading: loadingSurvey || pendingDeletion || surveyListLoading,
        }),
        [
            error,
            survey,
            surveyId,
            questions,
            surveyName,
            surveySlug,
            totalCount,
            pageInfo,
            filterSurveyList,
            updateSurvey,
            createSurvey,
            deleteSurvey,
            openQuestion,
            loadingSurvey,
            createQuestion,
            transformedSurveyList,
            pendingDeletion,
            setOpenQuestion,
            surveyListLoading,
            getMoreSurveys,
            surveyExperienceSettings,
        ],
    );

    return (
        <SurveyContext.Provider value={values}>
            {children}
        </SurveyContext.Provider>
    );
};
