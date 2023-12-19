import {
    OrderDirection,
    SurveyFilterInput,
    SurveySortField,
    useGetSurveyListQuery,
} from "@/generated/graphql";
import useWorkspace from "@/modules/workspace/hooks/useWorkspace";
import { InMemoryCache } from "@apollo/client";
import { relayStylePagination } from "@apollo/client/utilities";

export const useSurveyList = () => {
    const { workspace } = useWorkspace();
    const SURVEYS_PER_PAGE = 10;

    const {
        data: surveyList,
        loading,
        error,
        fetchMore,
        refetch,
    } = useGetSurveyListQuery({
        variables: {
            first: SURVEYS_PER_PAGE,
            sortBy: {
                field: SurveySortField.Name,
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

    const totalCount = surveyList?.surveys?.totalCount;
    const pageInfo = surveyList?.surveys?.pageInfo;

    const transformedSurveyList = surveyList?.surveys?.edges
        ?.map((edge) => {
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
        })
        .sort((a, b) => {
            const firstDate = new Date(a.createdAt);
            const secondDate = new Date(b.createdAt);

            return secondDate.getTime() - firstDate.getTime();
        });

    const getMoreSurveys = (direction: string) => {
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
    };

    const filterSurveyList = async (input: SurveyFilterInput) => {
        if (!surveyList) return;

        console.log("here's your input", input);

        await refetch({
            filter: input,
        });
    };

    return {
        error,
        loading,
        pageInfo,
        getMoreSurveys,
        totalSurveys: totalCount,
        surveysOnPage: SURVEYS_PER_PAGE,
        surveyList: transformedSurveyList,
        filterSurveyByName: filterSurveyList,
    };
};
