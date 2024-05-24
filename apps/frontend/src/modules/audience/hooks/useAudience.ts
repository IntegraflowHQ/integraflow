import { PageInfo, useGetPersonsQuery, usePropertyDefinitionsQuery } from "@/generated/graphql";
import { NetworkStatus } from "@apollo/client";
import { useCallback } from "react";

export const useAudience = () => {
    let itemsOnPage = 10;

    const {
        data: personResponse,
        loading: loadingPersons,
        fetchMore,
        networkStatus,
    } = useGetPersonsQuery({
        variables: {
            first: itemsOnPage,
        },
        notifyOnNetworkStatusChange: true,
    });

    const {
        data: propertyDefinitionsResponse,
        loading: loadingPropertyDefinitions,
        fetchMore: fetchMorePropertyDefinitions,
        networkStatus: propertyDefinitionsNetworkStatus,
    } = usePropertyDefinitionsQuery({
        variables: {
            first: itemsOnPage,
        },
    });

    const handlePagination = (direction: string, pageInfo: PageInfo) => {
        let paginationVariables = {};
        if (direction === "forward") {
            paginationVariables = {
                first: itemsOnPage,
                after: pageInfo.endCursor,
            };
        } else if (direction === "backward") {
            paginationVariables = {
                first: undefined,
                last: itemsOnPage,
                before: pageInfo.startCursor,
            };
        }
        return paginationVariables;
    };

    const getMorePersons = useCallback(
        async (direction: string) => {
            let paginationVariables = handlePagination(direction, personResponse?.persons?.pageInfo as PageInfo);

            fetchMore({
                variables: paginationVariables,
                updateQuery: (prevResult, { fetchMoreResult }) => {
                    if (!fetchMoreResult) return prevResult;

                    const newEdges = fetchMoreResult.persons?.edges;
                    const pageInfo = fetchMoreResult.persons?.pageInfo;

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

    const getMorePropertyDefinitions = useCallback(
        async (direction: string) => {
            let paginationVariables = handlePagination(
                direction,
                propertyDefinitionsResponse?.propertyDefinitions?.pageInfo as PageInfo,
            );

            fetchMorePropertyDefinitions({
                variables: paginationVariables,
                updateQuery: (prevResult, { fetchMoreResult }) => {
                    if (!fetchMoreResult) return prevResult;

                    const newEdges = fetchMoreResult.propertyDefinitions?.edges;
                    const pageInfo = fetchMoreResult.propertyDefinitions?.pageInfo;

                    return newEdges?.length
                        ? {
                              propertyDefinitions: {
                                  pageInfo: pageInfo as PageInfo,
                                  edges: newEdges,
                                  __typename: prevResult.propertyDefinitions?.__typename,
                                  totalCount: prevResult.propertyDefinitions?.totalCount,
                              },
                          }
                        : prevResult;
                },
            });
        },
        [fetchMore, propertyDefinitionsResponse?.propertyDefinitions],
    );

    const isFetchingMore = networkStatus === NetworkStatus.fetchMore;
    const isfetchingMorePropertyDefinitions = propertyDefinitionsNetworkStatus === NetworkStatus.fetchMore;

    return {
        itemsOnPage,
        loadingPersons,
        loadingPropertyDefinitions,
        isFetchingMore: isFetchingMore || isfetchingMorePropertyDefinitions,
        propertyDefinitions: propertyDefinitionsResponse?.propertyDefinitions,
        persons: personResponse?.persons,
        getMorePersons,
        getMorePropertyDefinitions,
    };
};
