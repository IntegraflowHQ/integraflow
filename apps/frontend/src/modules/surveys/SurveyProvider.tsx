import {
    GetSurveyQuery,
    OrderDirection,
    PageInfo,
    Project,
    ProjectTheme,
    Survey,
    SurveyChannelCountableConnection,
    SurveyFilterInput,
    SurveyFragmentFragmentDoc,
    SurveyQuestion,
    SurveyQuestionCountableConnection,
    SurveySortField,
    SurveyStatusEnum,
    SurveyTypeEnum,
    SurveyUpdateInput,
    SurveyUpdateMutation,
    useGetSurveyLazyQuery,
    useGetSurveyListQuery,
    useSurveyCreateMutation,
    useSurveyDeleteMutation,
    useSurveyUpdateMutation,
} from "@/generated/graphql";
import { ROUTES } from "@/routes";
import { ParsedQuestion } from "@/types";
import { generateRandomString, parseQuestion } from "@/utils";
import { ApolloError, FetchResult } from "@apollo/client";
import { DeepPartial, Reference } from "@apollo/client/utilities";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";

export interface SurveyProviderProp {
    children: React.ReactNode;
}

export type SurveyList = {
    pageInfo?: PageInfo;
    totalCount?: number | null;
    edges: Survey[];
};

export type SurveyContextValues = {
    loading: boolean;
    error: ApolloError | undefined;
    parsedQuestions: ParsedQuestion[];
    surveyId: string;
    createSurvey: (template?: string) => Promise<void>;
    updateSurvey: (survey: DeepPartial<Survey>, input: SurveyUpdateInput) => Promise<FetchResult<SurveyUpdateMutation>>;
    survey: GetSurveyQuery["survey"];
    surveyList: SurveyList;
    deleteSurvey: (survey: Survey) => Promise<void | undefined>;
    getMoreSurveys: (direction: string) => Promise<void | undefined>;
    creatingSurvey: boolean;
};

const createSurveyContext = () => React.createContext<SurveyContextValues | null>(null);

export const SurveyContext = createSurveyContext();

export const SurveyProvider = ({ children }: SurveyProviderProp) => {
    const SURVEYS_PER_PAGE = 10;

    const navigate = useNavigate();
    const { orgSlug, projectSlug, surveySlug } = useParams();

    const [createSurveyMutation, { loading: creatingSurvey }] = useSurveyCreateMutation();
    const [updateSurveyMutation, { error }] = useSurveyUpdateMutation({});
    const [deleteSurveyMutation] = useSurveyDeleteMutation();

    const [getSurvey, { data: surveyQueryResponse, loading: loadingSurvey }] = useGetSurveyLazyQuery({
        fetchPolicy: "cache-and-network",
    });

    const {
        refetch,
        fetchMore,
        data: surveyList,
        loading: surveyListLoading,
    } = useGetSurveyListQuery({
        fetchPolicy: "cache-and-network",
        variables: {
            first: SURVEYS_PER_PAGE,
            sortBy: {
                field: SurveySortField.CreatedAt,
                direction: OrderDirection.Desc,
            },
        },
    });

    const surveyId = surveyQueryResponse?.survey?.id ?? "";

    const parsedQuestions = React.useMemo(() => {
        const questions = surveyQueryResponse?.survey?.questions?.edges || [];

        return [...questions]
            .sort((a, b) => a.node.orderNumber - b.node.orderNumber)
            .map(({ node: question }) => parseQuestion(question as SurveyQuestion));
    }, [surveyQueryResponse?.survey?.questions.edges]);

    const surveyListData = React.useMemo(() => {
        return {
            pageInfo: surveyList?.surveys?.pageInfo,
            totalCount: surveyList?.surveys?.totalCount,
            edges: surveyList?.surveys?.edges?.map((survey) => survey.node as Survey) || ([] as Survey[]),
        };
    }, [surveyList?.surveys?.edges, surveyList?.surveys?.pageInfo, surveyList?.surveys?.totalCount]);

    React.useEffect(() => {
        if (!surveySlug) {
            return;
        }

        getSurvey({
            variables: {
                slug: surveySlug,
            },
        });
    }, [surveySlug, getSurvey]);

    const createSurvey = React.useCallback(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        async (_template?: string) => {
            // TODO: Implement create survey from template
            const surveySlug = `survey-${generateRandomString(10)}`;
            const surveyId = crypto.randomUUID();

            await createSurveyMutation({
                variables: {
                    input: {
                        id: surveyId,
                        slug: surveySlug,
                        name: "Untitled Survey",
                    },
                },

                onCompleted: () => {
                    navigate(
                        ROUTES.STUDIO.replace(":orgSlug", orgSlug!)
                            .replace(":projectSlug", projectSlug!)
                            .replace(":surveySlug", surveySlug),
                    );
                },

                onError: () => {
                    navigate(ROUTES.SURVEY_LIST.replace(":orgSlug", orgSlug!).replace(":projectSlug", projectSlug!));
                },

                update: (cache, { data }) => {
                    if (!data?.surveyCreate?.survey) {
                        return;
                    }

                    cache.modify({
                        fields: {
                            surveys(existingSurveysRefs = {}) {
                                const newSurveyRef = cache.writeFragment({
                                    data: data.surveyCreate?.survey,
                                    fragment: SurveyFragmentFragmentDoc,
                                    fragmentName: "SurveyFragment",
                                });

                                return {
                                    ...existingSurveysRefs,
                                    edges: [
                                        {
                                            __typename: "Survey",
                                            node: newSurveyRef,
                                        },
                                        ...existingSurveysRefs.edges,
                                    ],
                                    totalCount: existingSurveysRefs.totalCount + 1,
                                };
                            },
                        },
                    });
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
                updateQuery: (prevResult, { fetchMoreResult }) => {
                    if (!fetchMoreResult) return prevResult;

                    const newEdges = fetchMoreResult.surveys?.edges;
                    const pageInfo = fetchMoreResult.surveys?.pageInfo;

                    return newEdges?.length
                        ? {
                              surveys: {
                                  pageInfo: pageInfo as PageInfo,
                                  edges: newEdges,
                                  __typename: prevResult.surveys?.__typename,
                                  totalCount: prevResult.surveys?.totalCount,
                              },
                          }
                        : prevResult;
                },
            });
        },
        [fetchMore, surveyList],
    );

    const filterSurveyList = React.useCallback(
        async (input: SurveyFilterInput) => {
            await refetch({
                filter: input,
            });
        },
        [refetch],
    );

    const updateSurvey = React.useCallback(
        async (survey: DeepPartial<Survey>, input: SurveyUpdateInput) => {
            const mutation = await updateSurveyMutation({
                variables: {
                    id: survey.id!,
                    input,
                },

                optimisticResponse: {
                    __typename: "Mutation",
                    surveyUpdate: {
                        __typename: "SurveyUpdate",
                        survey: {
                            __typename: "Survey",
                            id: survey.id!,
                            reference: survey.reference ?? "",
                            name: input?.name ?? survey.name,
                            slug: input?.slug ?? survey.slug ?? "",
                            type: survey.type ?? SurveyTypeEnum.Survey,
                            status: input.status ?? survey.status ?? SurveyStatusEnum.Draft,
                            settings: input?.settings ?? survey.settings ?? "{}",
                            createdAt: survey.createdAt ?? new Date().toISOString(),
                            updatedAt: survey.updatedAt ?? new Date().toISOString(),
                            stats: survey.stats,
                            project: survey.project
                                ? (survey.project as Project)
                                : {
                                      __typename: "Project",
                                      id: "",
                                      name: "",
                                      slug: "",
                                      apiToken: "",
                                      accessControl: false,
                                      hasCompletedOnboardingFor: null,
                                      timezone: "",
                                      organization: {
                                          __typename: "AuthOrganization",
                                          id: "",
                                          slug: "",
                                          name: "",
                                          memberCount: 1,
                                      },
                                  },

                            theme: survey.theme?.colorScheme ? (survey.theme as ProjectTheme) : null,
                            creator: {
                                __typename: "User",
                                email: survey.creator?.email ?? "",
                                firstName: survey.creator?.firstName ?? "",
                                lastName: survey.creator?.lastName ?? "",
                            },
                            questions: survey.questions
                                ? (survey.questions as SurveyQuestionCountableConnection)
                                : {
                                      __typename: "SurveyQuestionCountableConnection",
                                      edges: [],
                                  },
                            channels: survey.channels
                                ? (survey.channels as SurveyChannelCountableConnection)
                                : {
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

                    cache.writeFragment({
                        id: `Survey:${survey.id}`,
                        fragment: SurveyFragmentFragmentDoc,
                        data: data?.surveyUpdate?.survey,
                        fragmentName: "SurveyFragment",
                    });
                },
            });

            return mutation;
        },
        [updateSurveyMutation],
    );

    const deleteSurvey = React.useCallback(
        async (survey: Survey) => {
            await deleteSurveyMutation({
                variables: {
                    id: survey.id,
                },

                optimisticResponse: {
                    __typename: "Mutation",
                    surveyDelete: {
                        __typename: "SurveyDelete",
                        survey: {
                            __typename: "Survey",
                            ...survey,
                            id: survey.id,
                            type: SurveyTypeEnum.Survey,
                            reference: "",
                            name: "",
                            slug: survey.slug ?? "",
                            status: survey.status ?? "",
                            settings: "",
                            theme: null,
                            project: survey.project
                                ? (survey.project as Project)
                                : {
                                      __typename: "Project",
                                      id: "",
                                      name: "",
                                      slug: "",
                                      apiToken: "",
                                      accessControl: false,
                                      hasCompletedOnboardingFor: null,
                                      timezone: "",
                                      organization: {
                                          __typename: "AuthOrganization",
                                          id: "",
                                          slug: "",
                                          name: "",
                                          memberCount: 1,
                                      },
                                  },
                            creator: {
                                __typename: "User",
                                email: survey.creator.email ?? "",
                                firstName: survey.creator.firstName ?? "",
                                lastName: survey.creator.lastName ?? "",
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
                        errors: [],
                        surveyErrors: [],
                    },
                },

                update: (cache, { data }) => {
                    if (!data?.surveyDelete?.survey) return;

                    cache.modify({
                        fields: {
                            surveys(existingSurveyRefs, { readField }) {
                                return {
                                    ...existingSurveyRefs,
                                    edges: existingSurveyRefs.edges.filter(({ node }: { node: Reference }) => {
                                        return survey.id !== readField("id", node);
                                    }),
                                    totalCount: existingSurveyRefs.totalCount - 1,
                                };
                            },
                        },
                    });
                },
            });
        },
        [deleteSurveyMutation],
    );
    const values = React.useMemo<SurveyContextValues>(
        () => ({
            error,
            createSurvey,
            survey: surveyQueryResponse?.survey,
            deleteSurvey,
            updateSurvey,
            getMoreSurveys,
            filterSurveyByName: filterSurveyList,
            surveyList: surveyListData,
            loading: loadingSurvey || surveyListLoading,
            parsedQuestions,
            surveyId,
            creatingSurvey,
        }),
        [
            error,
            surveyQueryResponse?.survey,
            loadingSurvey,
            parsedQuestions,
            surveyId,
            surveyListLoading,
            surveyListData,
            filterSurveyList,
            createSurvey,
            updateSurvey,
            deleteSurvey,
            getMoreSurveys,
            creatingSurvey,
        ],
    );

    return <SurveyContext.Provider value={values}>{children}</SurveyContext.Provider>;
};
