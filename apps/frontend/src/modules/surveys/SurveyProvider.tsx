import {
    GetSurveyQuery,
    OrderDirection,
    PageInfo,
    Project,
    ProjectTheme,
    Survey,
    SurveyFilterInput,
    SurveyQuestion,
    SurveySortField,
    SurveyStatusEnum,
    SurveyTypeEnum,
    SurveyUpdateInput,
    useGetSurveyListQuery,
    useGetSurveyQuery,
    useSurveyCreateMutation,
    useSurveyDeleteMutation,
    useSurveyUpdateMutation,
} from "@/generated/graphql";
import { ROUTES } from "@/routes";
import { ParsedQuestion } from "@/types";
import { generateRandomString, parseQuestion } from "@/utils";
import { ApolloError } from "@apollo/client";
import { DeepPartial, Reference } from "@apollo/client/utilities";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { SURVEY_CORE, SURVEY_CREATE } from "./graphql/fragments/surveyFragment";

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
    surveysOnPage: number;
    error: ApolloError | undefined;
    parsedQuestions: ParsedQuestion[];
    surveyId: string;
    createSurvey: (template?: string) => Promise<void>;
    updateSurvey: (survey: DeepPartial<Survey>, input: SurveyUpdateInput) => Promise<void>;
    survey: GetSurveyQuery["survey"];
    surveyList: SurveyList;
    deleteSurvey: (survey: Survey) => Promise<void | undefined>;
    getMoreSurveys: (direction: string) => Promise<void | undefined>;
};

const createSurveyContext = () => React.createContext<SurveyContextValues | null>(null);

export const SurveyContext = createSurveyContext();

export const SurveyProvider = ({ children }: SurveyProviderProp) => {
    const SURVEYS_PER_PAGE = 10;

    const navigate = useNavigate();
    const { orgSlug, projectSlug, surveySlug } = useParams();

    const [createSurveyMutation] = useSurveyCreateMutation();
    const [updateSurveyMutation, { error }] = useSurveyUpdateMutation({});
    const [deleteSurveyMutation] = useSurveyDeleteMutation();

    const {
        data: surveyQueryResponse,
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
        skip: !projectSlug,
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
    }, [surveyList?.surveys?.edges]);

    React.useEffect(() => {
        refetchSurvey();
    }, [surveySlug, refetchSurvey]);

    const createSurvey = React.useCallback(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        async (_template?: string) => {
            // TODO: Implement create survey from template
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
                            project: {
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
                    navigate(ROUTES.SURVEY_LIST.replace(":orgSlug", orgSlug!).replace(":projectSlug", projectSlug!));
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
            await updateSurveyMutation({
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

                            theme: {
                                id: input?.themeId ?? survey.theme?.id ?? "",
                                name: survey.theme?.name ?? "",
                                colorScheme: survey.theme?.colorScheme ?? "",
                                reference: survey.theme?.reference ?? "",
                            } as ProjectTheme,
                            creator: {
                                __typename: "User",
                                email: survey.creator?.email ?? "",
                                firstName: survey.creator?.firstName ?? "",
                                lastName: survey.creator?.lastName ?? "",
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

                    cache.writeFragment({
                        id: `Survey:${survey.id}`,
                        fragment: SURVEY_CORE,
                        data: data?.surveyUpdate?.survey,
                    });
                },
            });
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
                            slug: surveySlug ?? "",
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
            surveysOnPage: SURVEYS_PER_PAGE,
            survey: surveyQueryResponse?.survey,
            deleteSurvey,
            updateSurvey,
            getMoreSurveys,
            filterSurveyByName: filterSurveyList,
            surveyList: surveyListData,
            loading: loadingSurvey || surveyListLoading,
            parsedQuestions,
            surveyId,
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
        ],
    );

    return <SurveyContext.Provider value={values}>{children}</SurveyContext.Provider>;
};