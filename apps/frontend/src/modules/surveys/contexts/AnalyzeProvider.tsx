import { SurveyResponseMetricEnum, useResponseMetricQuery, useResponsesQuery } from "@/generated/graphql";
import { CESMetric, CSATMetric, DateFilterValue, NPSMetric, ParsedResponse, Summary } from "@/types";
import { getISOdateString, parseResponse } from "@/utils";
import { subDays } from "date-fns";
import { ReactNode, createContext, useCallback, useMemo, useState } from "react";
import { useSurvey } from "../hooks/useSurvey";

const RESPONSES_PER_PAGE = 10;

const useAnalyzeFactory = () => {
    const [activeResponse, setActiveResponse] = useState<ParsedResponse | null>(null);
    const [timeFrame, setTimeFrame] = useState<DateFilterValue>({
        timePeriod: "today",
        current: { gte: getISOdateString(), lte: getISOdateString() },
        previous: { gte: getISOdateString(subDays(Date.now(), 1)), lte: getISOdateString(subDays(Date.now(), 1)) },
    });

    const { surveyId } = useSurvey();

    const responseQueryVariables = useMemo(
        () => ({
            id: surveyId,
            first: RESPONSES_PER_PAGE,
            filter: {
                createdAt: timeFrame.current,
            },
        }),
        [surveyId, timeFrame.current],
    );

    const { data: lastEightResponsesData } = useResponsesQuery({
        fetchPolicy: "cache-and-network",
        variables: {
            id: surveyId,
            first: 8,
        },
    });

    const { data: responseQuery, fetchMore } = useResponsesQuery({
        fetchPolicy: "cache-and-network",
        variables: responseQueryVariables,
    });

    const fetchMoreResponses = useCallback(
        (direction: "forward" | "backward") => {
            if (
                (!responseQuery?.responses?.pageInfo.hasNextPage && direction === "forward") ||
                (!responseQuery?.responses?.pageInfo.endCursor && direction === "forward") ||
                (!responseQuery?.responses?.pageInfo.hasPreviousPage && direction === "backward") ||
                (!responseQuery?.responses?.pageInfo.startCursor && direction === "backward")
            ) {
                return;
            }

            const variables =
                direction === "forward"
                    ? {
                          ...responseQueryVariables,
                          after: responseQuery?.responses?.pageInfo.endCursor,
                      }
                    : {
                          ...responseQueryVariables,
                          first: undefined,
                          last: RESPONSES_PER_PAGE,
                          before: responseQuery?.responses?.pageInfo.startCursor,
                      };

            fetchMore({
                variables,
                updateQuery: (previousQueryResult, options) => {
                    if (options.fetchMoreResult.responses?.nodes && options.fetchMoreResult.responses.pageInfo) {
                        return options.fetchMoreResult;
                    }
                    return previousQueryResult;
                },
            });
        },
        [responseQueryVariables, responseQuery],
    );

    const { data: totalResponsesData } = useResponseMetricQuery({
        fetchPolicy: "cache-and-network",
        variables: {
            id: surveyId,
            metric: SurveyResponseMetricEnum.TotalResponses,
            date: timeFrame.current,
            previousDate: timeFrame.previous,
        },
    });

    const { data: completionRateData } = useResponseMetricQuery({
        fetchPolicy: "cache-and-network",
        variables: {
            id: surveyId,
            metric: SurveyResponseMetricEnum.CompletionRate,
            date: timeFrame.current,
            previousDate: timeFrame.previous,
        },
    });

    const { data: averageTimeData } = useResponseMetricQuery({
        fetchPolicy: "cache-and-network",
        variables: {
            id: surveyId,
            metric: SurveyResponseMetricEnum.AverageTime,
            date: timeFrame.current,
            previousDate: timeFrame.previous,
        },
    });

    const { data: npsMetricData } = useResponseMetricQuery({
        fetchPolicy: "cache-and-network",
        variables: {
            id: surveyId,
            metric: SurveyResponseMetricEnum.Nps,
            date: timeFrame.current,
        },
    });

    const { data: csatMetricData } = useResponseMetricQuery({
        fetchPolicy: "cache-and-network",
        variables: {
            id: surveyId,
            metric: SurveyResponseMetricEnum.Csat,
            date: timeFrame.current,
        },
    });

    const { data: cesMetricData } = useResponseMetricQuery({
        fetchPolicy: "cache-and-network",
        variables: {
            id: surveyId,
            metric: SurveyResponseMetricEnum.Ces,
            date: timeFrame.current,
        },
    });

    const lastEightResponses = useMemo(() => {
        return lastEightResponsesData?.responses?.nodes?.map((r) => parseResponse(r)) ?? ([] as ParsedResponse[]);
    }, [lastEightResponsesData]);

    const npsMetric = useMemo(() => {
        return JSON.parse(
            npsMetricData?.responseMetric?.current ?? '{"promoters": 0, "passives": 0, "detractors": 0, "score": 0}',
        ) as NPSMetric;
    }, [npsMetricData?.responseMetric?.current]);

    const cesMetric = useMemo(() => {
        return JSON.parse(
            cesMetricData?.responseMetric?.current ?? '{"low": 0, "medium": 0, "high": 0, "score": 0}',
        ) as CESMetric;
    }, [cesMetricData?.responseMetric?.current]);

    const csatMetric = useMemo(() => {
        return JSON.parse(
            csatMetricData?.responseMetric?.current ?? '{"positive": 0, "neutral": 0, "negative": 0, "score": 0}',
        ) as CSATMetric;
    }, [csatMetricData?.responseMetric?.current]);

    const responses = useMemo(() => {
        return responseQuery?.responses?.nodes?.map((r) => parseResponse(r)) ?? ([] as ParsedResponse[]);
    }, [responseQuery?.responses?.nodes]);

    const totalResponses = useMemo(() => {
        if (!totalResponsesData?.responseMetric?.current && !totalResponsesData?.responseMetric?.previous) {
            return null;
        }
        return {
            current: JSON.parse(totalResponsesData.responseMetric.current) as Summary,
            previous: JSON.parse(totalResponsesData.responseMetric.previous) as Summary,
        };
    }, [totalResponsesData?.responseMetric]);

    const completionRate = useMemo(() => {
        if (!completionRateData?.responseMetric?.current && !completionRateData?.responseMetric?.previous) {
            return null;
        }

        return {
            current: JSON.parse(completionRateData.responseMetric.current) as Summary,
            previous: JSON.parse(completionRateData.responseMetric.previous) as Summary,
        };
    }, [completionRateData?.responseMetric]);

    const averageTime = useMemo(() => {
        if (!averageTimeData?.responseMetric?.current && !averageTimeData?.responseMetric?.previous) {
            return null;
        }

        return {
            current: JSON.parse(averageTimeData.responseMetric.current) as Summary,
            previous: JSON.parse(averageTimeData.responseMetric.previous) as Summary,
        };
    }, [averageTimeData?.responseMetric]);

    const calculatePercentageDifference = useCallback((data: { current: Summary; previous: Summary } | null) => {
        if (!data) {
            return 0;
        }

        const currentValue = data.current.value ?? 0;
        const previousValue = data.previous.value ?? 0;

        if (previousValue === 0) {
            return currentValue;
        }

        const percentageDifference = ((currentValue - previousValue) / previousValue) * 100;

        return percentageDifference;
    }, []);

    return {
        responses,
        lastEightResponses,
        responseQuery,
        activeResponse,
        totalResponses,
        completionRate,
        averageTime,
        npsMetric,
        csatMetric,
        cesMetric,
        timeFrame,
        fetchMoreResponses,
        setTimeFrame,
        setActiveResponse,
        calculatePercentageDifference,
    };
};

export type AnalyzeContextValue = ReturnType<typeof useAnalyzeFactory>;

const createAnalyzeContext = () => {
    return createContext<AnalyzeContextValue | null>(null);
};

export const AnalyzeContext = createAnalyzeContext();

export const AnalyzeProvider = ({ children }: { children: ReactNode }) => {
    const value = useAnalyzeFactory();
    return <AnalyzeContext.Provider value={value}>{children}</AnalyzeContext.Provider>;
};
