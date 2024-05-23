import { PageInfo, useGetPersonsQuery, usePropertyDefinitionsQuery } from "@/generated/graphql";
import { NetworkStatus } from "@apollo/client";
import { useCallback } from "react";

export const useAudience = () => {
    let itemsOnPage = 5;

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
        fetchMore: fectMorePropertyDefinitions,
        networkStatus: propertyDefinitionsNetworkStatus,
    } = usePropertyDefinitionsQuery({
        variables: {
            first: itemsOnPage,
        },
    });

    const getMorePersons = useCallback(
        async (direction: string) => {
            let paginationVariables = {};

            if (direction === "forward") {
                paginationVariables = {
                    first: itemsOnPage,
                    after: personResponse?.persons?.pageInfo?.endCursor,
                };
            } else if (direction === "backward") {
                paginationVariables = {
                    first: undefined,
                    last: itemsOnPage,
                    before: personResponse?.persons?.pageInfo?.startCursor,
                };
            }

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
            let paginationVariables = {};

            if (direction === "forward") {
                paginationVariables = {
                    first: itemsOnPage,
                    after: propertyDefinitionsResponse?.propertyDefinitions?.pageInfo?.endCursor,
                };
            } else if (direction === "backward") {
                paginationVariables = {
                    first: undefined,
                    last: itemsOnPage,
                    before: propertyDefinitionsResponse?.propertyDefinitions?.pageInfo?.startCursor,
                };
            }

            fectMorePropertyDefinitions({
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
        propertyDefinitions: propertyDefinitionsResponse?.propertyDefinitions,
        loadingPersons,
        loadingPropertyDefinitions,
        persons: personResponse?.persons,
        isFetchingMore: isFetchingMore || isfetchingMorePropertyDefinitions,
        isfetchingMorePropertyDefinitions,
        itemsOnPage,
        fectMorePropertyDefinitions,
        fetchMore,
        getMorePersons,
        getMorePropertyDefinitions,
    };
};
