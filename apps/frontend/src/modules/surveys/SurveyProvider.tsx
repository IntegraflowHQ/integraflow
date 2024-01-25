import {
    OrderDirection,
    PageInfo,
    Survey,
    SurveyError,
    SurveyFilterInput,
    SurveyQuestionCountableEdge,
    SurveyQuestionTypeEnum,
    SurveySortField,
    SurveyStatusEnum,
    SurveyTypeEnum,
    SurveyUpdateInput,
    useGetSurveyListLazyQuery,
    useGetSurveyQuery,
    useSurveyCreateMutation,
    useSurveyDeleteMutation,
    useSurveyQuestionCreateMutation,
    useSurveyUpdateMutation,
} from "@/generated/graphql";
import { ROUTES } from "@/routes";
import { generateRandomString } from "@/utils";
import { createSelectors } from "@/utils/selectors";
import { ApolloError, InMemoryCache } from "@apollo/client";
import { relayStylePagination } from "@apollo/client/utilities";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useScrollToBottom } from "react-scroll-to-bottom";
import useWorkspace from "../workspace/hooks/useWorkspace";
import {
    SURVEY_CREATE,
    SURVEY_QUESTION,
} from "./graphql/fragments/surveyFragment";
import { useSurveyStore } from "./states/survey";

export interface SurveyProviderProp {
    children: React.ReactNode;
}

export type SurveyResponse = {
    surveyErrors: SurveyError[] | null;
    survey?: Survey | null;
};

export type SurveyList = {
    pageInfo: PageInfo;
    totalCount: number | undefined;
    edges: Array<Partial<Survey>>;
};

export type SurveyContextValues = {
    loading: boolean;
    surveysOnPage: number;
    error: ApolloError | undefined;
    openQuestion: string;
    createSurvey: (template?: string) => Promise<SurveyResponse>;
    setOpenQuestion: (value: string) => void;
    updateSurvey: (
        id: string,
        input: SurveyUpdateInput,
    ) => Promise<SurveyResponse | undefined>;
    survey: SurveyResponse;
    surveyList: SurveyList;
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

    const [
        getSurveyList,
        { refetch, fetchMore, data: surveyList, loading: surveyListLoading },
    ] = useGetSurveyListLazyQuery();

    const surveyId = survey?.survey?.id ?? "";

    const surveyListData = React.useMemo(
        () => ({
            pageInfo: surveyList?.surveys?.pageInfo,
            totalCount: surveyList?.surveys?.totalCount,
            edges: surveyList?.surveys?.edges?.map((survey) => {
                return {
                    id: survey?.node?.id,
                    slug: survey?.node?.slug,
                    status: survey?.node?.status,
                    createdAt: survey?.node?.createdAt,
                    name: survey?.node?.name
                        ? survey?.node?.name
                        : "Untitled survey",
                    creator: {
                        email: survey?.node?.creator.email,
                        fullName: `${survey?.node?.creator.firstName} ${survey?.node?.creator.lastName}`,
                    },
                };
            }),
        }),
        [surveyList],
    );

    // this could make the dependencies of the createQuestion callback
    // change on every render. Wrapping it in a Memo fixes it i guess.
    const questions = React.useMemo(
        () => survey?.survey?.questions?.edges || [],
        [survey?.survey?.questions.edges],
    );

    // unique survey
    React.useEffect(() => {
        refetchSurvey();
    }, [surveySlug, refetchSurvey]);

    React.useEffect(() => {
        getSurveyList({
            variables: {
                first: SURVEYS_PER_PAGE,
                sortBy: {
                    field: SurveySortField.CreatedAt,
                    direction: OrderDirection.Desc,
                },
            },
            // TODO: Remove context later on. Apollo should handle this.
            context: {
                headers: {
                    Project: workspace?.project.id,
                },
            },
            notifyOnNetworkStatusChange: true,
            fetchPolicy: "network-only",
        });
    }, [getSurveyList, projectSlug, workspace?.project?.id]);

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
                                    fragment: SURVEY_CREATE,
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
                    after: surveyList?.surveys?.pageInfo?.endCursor,
                };
            } else if (direction === "backward") {
                paginationVariables = {
                    first: undefined,
                    last: SURVEYS_PER_PAGE,
                    before: surveyList?.surveys?.pageInfo?.startCursor,
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
        [fetchMore, surveyList],
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
                            __typename: "Survey",
                            id: surveyId,
                            type: survey?.survey?.type ?? SurveyTypeEnum.Survey,
                            reference: "",
                            name: "",
                            slug: surveySlug ?? "",
                            status: survey?.survey?.status
                                ? SurveyStatusEnum.Draft
                                : SurveyStatusEnum.Draft,
                            settings: "",
                            theme: null,

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

                            createdAt: new Date().toISOString(),
                            updatedAt: new Date().toISOString(),
                        },
                        errors: [],
                        surveyErrors: [],
                    },
                },

                update: (cache, { data }) => {
                    if (!data?.surveyDelete?.survey) return;

                    cache.modify({
                        id: cache.identify(data?.surveyDelete?.survey),
                        fields: {
                            surveys(existingSurveys = []) {
                                return {
                                    ...existingSurveys,
                                    edges: [...existingSurveys],
                                };
                            },
                        },
                    });
                },
            });
        },
        [
            deleteSurveyMutation,
            survey?.survey?.status,
            survey?.survey?.type,
            surveySlug,
            workspace?.project.id,
        ],
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
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            questions,

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore

            createSurvey,
            openQuestion,
            createQuestion,
            setOpenQuestion,
            surveysOnPage: SURVEYS_PER_PAGE,

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            survey,
            deleteSurvey,
            updateSurvey,
            getMoreSurveys,
            filterSurveyByName: filterSurveyList,

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            surveyList: surveyListData,
            loading: loadingSurvey || pendingDeletion || surveyListLoading,
        }),
        [
            error,
            survey,
            questions,
            filterSurveyList,
            updateSurvey,
            createSurvey,
            deleteSurvey,
            openQuestion,
            loadingSurvey,
            createQuestion,
            pendingDeletion,
            setOpenQuestion,
            surveyListLoading,
            getMoreSurveys,
            surveyListData,
        ],
    );

    return (
        <SurveyContext.Provider value={values}>
            {children}
        </SurveyContext.Provider>
    );
};
