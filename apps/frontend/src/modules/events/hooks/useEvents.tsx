import {
    PageInfo,
    useEventDefinitionsQuery,
    useEventsQuery,
    usePropertiesWithDefinitionsLazyQuery,
} from "@/generated/graphql";
import { NetworkStatus } from "@apollo/client";
import { useCallback } from "react";

export const useEvents = () => {
    let eventDefinitionsOnPage = 10;

    const { data: eventsResponse } = useEventsQuery({ variables: { first: 1 }, fetchPolicy: "cache-and-network" });
    const {
        data: eventDefinitionsResponse,
        loading: loadingEventDefinitions,
        fetchMore,
        networkStatus,
    } = useEventDefinitionsQuery({
        fetchPolicy: "cache-and-network",
        variables: {
            first: eventDefinitionsOnPage,
        },
        notifyOnNetworkStatusChange: true,
    });

    const [fetchPropertiesWithDefinitions, { data: propertiesWithDefinitionsResponse, loading: loadingProperties }] =
        usePropertiesWithDefinitionsLazyQuery({ fetchPolicy: "cache-and-network" });

    const getPropertiesWithDefinitions = useCallback(
        (event: string) => {
            fetchPropertiesWithDefinitions({ variables: { event } });
        },
        [fetchPropertiesWithDefinitions],
    );

    const getMoreEventDefinitions = useCallback(
        async (direction: string) => {
            let paginationVariables = {};

            if (direction === "forward") {
                paginationVariables = {
                    first: eventDefinitionsOnPage,
                    after: eventDefinitionsResponse?.eventDefinitions?.pageInfo?.endCursor,
                };
            } else if (direction === "backward") {
                paginationVariables = {
                    first: undefined,
                    last: eventDefinitionsOnPage,
                    before: eventDefinitionsResponse?.eventDefinitions?.pageInfo.startCursor,
                };
            }

            fetchMore({
                variables: paginationVariables,
                updateQuery: (prevResult, { fetchMoreResult }) => {
                    if (!fetchMoreResult) return prevResult;

                    const newEdges = fetchMoreResult.eventDefinitions?.edges;
                    const pageInfo = fetchMoreResult.eventDefinitions?.pageInfo;

                    return newEdges?.length
                        ? {
                              eventDefinitions: {
                                  pageInfo: pageInfo as PageInfo,
                                  edges: newEdges,
                                  __typename: prevResult.eventDefinitions?.__typename,
                                  totalCount: prevResult.eventDefinitions?.totalCount,
                              },
                          }
                        : prevResult;
                },
            });
        },
        [fetchMore, eventDefinitionsResponse?.eventDefinitions],
    );

    const isFetchingMore = networkStatus === NetworkStatus.fetchMore;

    return {
        loadingProperties,
        loadingEventDefinitions,
        eventDefinitions: eventDefinitionsResponse?.eventDefinitions,
        events: eventsResponse?.events,
        getPropertiesWithDefinitions,
        totalCount: eventDefinitionsResponse?.eventDefinitions?.totalCount,
        isFetchingMore,
        propertiesWithDefinitions: propertiesWithDefinitionsResponse?.propertiesWithDefinitions,
        getMoreEventDefinitions,
    };
};
