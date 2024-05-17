import {
    SurveyResponseMetricEnum,
    SurveyResponseStatusEnum,
    useResponseMetricQuery,
    useResponsesQuery,
} from "@/generated/graphql";
import { CESMetric, CSATMetric, NPSMetric, ParsedResponse } from "@/types";
import { getISOdateString, parseResponse } from "@/utils";
import { addDays, subDays } from "date-fns";
import { ReactNode, createContext, useMemo, useState } from "react";
import { useSurvey } from "../hooks/useSurvey";

const useAnalyzeFactory = () => {
    const [activeResponse, setActiveResponse] = useState<ParsedResponse | null>(null);
    const { surveyId } = useSurvey();

    const { data: responseQuery } = useResponsesQuery({
        fetchPolicy: "network-only",
        variables: {
            id: surveyId,
            first: 100,
            filter: {
                status: SurveyResponseStatusEnum.Completed,
                createdAt: {
                    lte: getISOdateString(addDays(Date.now(), 1)),
                },
            },
        },
    });

    const { data: totalResponsesData } = useResponseMetricQuery({
        fetchPolicy: "network-only",
        variables: {
            id: surveyId,
            metric: SurveyResponseMetricEnum.TotalResponses,
            date: {
                lte: getISOdateString(),
                gte: getISOdateString(subDays(Date.now(), 3)),
            },
        },
    });

    const { data: completionRateData } = useResponseMetricQuery({
        fetchPolicy: "network-only",
        variables: {
            id: surveyId,
            metric: SurveyResponseMetricEnum.CompletionRate,
            date: {
                lte: getISOdateString(),
                gte: getISOdateString(subDays(Date.now(), 3)),
            },
        },
    });

    const { data: averageTimeData } = useResponseMetricQuery({
        fetchPolicy: "network-only",
        variables: {
            id: surveyId,
            metric: SurveyResponseMetricEnum.AverageTime,
            date: {
                lte: getISOdateString(),
                gte: getISOdateString(subDays(Date.now(), 3)),
            },
        },
    });

    const { data: npsMetricData } = useResponseMetricQuery({
        fetchPolicy: "network-only",
        variables: {
            id: surveyId,
            metric: SurveyResponseMetricEnum.Nps,
            date: {
                lte: getISOdateString(),
                gte: getISOdateString(),
            },
        },
    });

    const { data: csatMetricData } = useResponseMetricQuery({
        fetchPolicy: "network-only",
        variables: {
            id: surveyId,
            metric: SurveyResponseMetricEnum.Csat,
            date: {
                lte: getISOdateString(),
                gte: getISOdateString(subDays(Date.now(), 3)),
            },
        },
    });

    const { data: cesMetricData } = useResponseMetricQuery({
        fetchPolicy: "network-only",
        variables: {
            id: surveyId,
            metric: SurveyResponseMetricEnum.Ces,
            date: {
                lte: getISOdateString(),
                gte: getISOdateString(subDays(Date.now(), 3)),
            },
        },
    });

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

    return {
        responses,
        activeResponse,
        // totalResponses,
        // completionRate,
        // averageTime,
        npsMetric,
        csatMetric,
        cesMetric,
        setActiveResponse,
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
