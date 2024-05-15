import { SurveyResponseStatusEnum, useResponsesQuery } from "@/generated/graphql";
import { ParsedResponse } from "@/types";
import { getISOdateString, parseResponse } from "@/utils";
import { addDays } from "date-fns";
import { ReactNode, createContext, useMemo, useState } from "react";
import { useSurvey } from "../hooks/useSurvey";

const useAnalyzeFactory = () => {
    const [activeResponse, setActiveResponse] = useState<ParsedResponse | null>(null);
    const { surveyId } = useSurvey();

    const { data: responseQuery } = useResponsesQuery({
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

    const responses = useMemo(() => {
        return responseQuery?.responses?.nodes?.map((r) => parseResponse(r)) ?? ([] as ParsedResponse[]);
    }, [responseQuery?.responses?.nodes]);

    return {
        responses,
        activeResponse,
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
