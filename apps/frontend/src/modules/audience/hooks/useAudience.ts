import { PageInfo, useGetPersonsQuery } from "@/generated/graphql";
import { NetworkStatus } from "@apollo/client";
import { useCallback } from "react";

export const useAudience = () => {
    const {
        data: personResponse,
        fetchMore,
        networkStatus,
    } = useGetPersonsQuery({
        variables: {
            first: 10,
        },
        notifyOnNetworkStatusChange: true,
    });

    let surveysOnPage = 10;

    const getMorePersons = useCallback(
        async (direction: string) => {
            let paginationVariables = {};

            if (direction === "forward") {
                paginationVariables = {
                    first: surveysOnPage,
                    after: personResponse?.persons?.pageInfo?.endCursor,
                };
            } else if (direction === "backward") {
                paginationVariables = {
                    first: undefined,
                    last: surveysOnPage,
                    before: personResponse?.persons?.pageInfo?.startCursor,
                };
            }

            fetchMore({
                variables: paginationVariables,
                updateQuery: (prevResult, { fetchMoreResult }) => {
                    if (!fetchMoreResult) return prevResult;
                    console.log("first");
                    console.log({ prevResult });
                    console.log({ fetchMoreResult });

                    const newEdges = fetchMoreResult.persons?.edges;
                    const pageInfo = fetchMoreResult.persons?.pageInfo;

                    console.log({ newEdges });
                    console.log({ pageInfo });

                    return newEdges?.length
                        ? {
                              persons: {
                                  pageInfo: pageInfo as PageInfo,
                                  edges: newEdges,
                                  __typename: prevResult.persons?.__typename,
                                  totalCount: prevResult.persons?.totalCount,
                              },
                          }
                        : prevResult;
                },
            });
        },
        [fetchMore, personResponse?.persons],
    );

    const isFetchingMore = networkStatus === NetworkStatus.fetchMore;

    return {
        persons: personResponse?.persons,
        isFetchingMore,
        surveysOnPage,
        fetchMore,
        getMorePersons,
    };
};
