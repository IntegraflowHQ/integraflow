import useAnalyze from "@/modules/surveys/hooks/useAnalyze";
import { AnalyzeTabs } from "@/types";
import { Header, Pagination } from "@/ui";
import { ChartBar } from "@/ui/icons";
import { DateFilter } from "../components/DateFilter";
import { ExportBtn } from "../components/ExportBtn";
import { Response } from "../components/Response";
import { ResponseDetails } from "../components/ResponseDetails";

export const Responses = () => {
    const {
        responses,
        responseQuery,
        lastEightResponses,
        activeResponse,
        timeFrame,
        fetchMoreResponses,
        setTimeFrame,
        setActiveResponse,
        setTab,
    } = useAnalyze();

    if (lastEightResponses.length === 0) {
        return (
            <div className={"flex h-full w-full min-w-[660px] flex-col gap-6 rounded-xl bg-intg-bg-9 px-6 py-9"}>
                <div className="flex h-full w-full flex-1 flex-col items-center justify-center gap-6">
                    <div className="flex flex-col items-center gap-2">
                        <ChartBar strokeWidth={4} size={62} color="#AFAAC7" />
                        <Header
                            title="No response yet"
                            description="Overview Report to get a quick summary and analysis of responses, CX metrics and survey
                            distribution channels."
                            className="max-w-[386px] text-center"
                        />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={"flex min-h-full w-full min-w-[660px] flex-col gap-6 rounded-xl bg-intg-bg-9 px-6 py-9"}>
            <div>
                <Header
                    title="Responses"
                    description="Overview Report to get a quick summary and analysis of responses, CX metrics and survey distribution channels."
                    className="max-w-[375px] pb-8"
                />

                {!activeResponse ? (
                    <div className="flex items-center justify-between pb-[14px]">
                        <DateFilter defaultValue={timeFrame} onValueChange={setTimeFrame} />
                        <ExportBtn />
                    </div>
                ) : null}

                {!activeResponse ? (
                    <div className="flex flex-col gap-2 rounded-lg bg-intg-bg-15 p-4">
                        {responses.length > 0 ? (
                            responses.map((response) => (
                                <Response
                                    title={response.title}
                                    date={new Date(response.createdAt ?? Date.now())}
                                    responder={
                                        response.userAttributes.name ??
                                        response.userAttributes.firstName ??
                                        response.userAttributes.lastName ??
                                        response.userAttributes.email ??
                                        response.userAttributes.userId ??
                                        response.userAttributes.id
                                    }
                                    key={response.id}
                                    onClick={() => {
                                        setActiveResponse({ response, openedFrom: AnalyzeTabs.Responses });
                                    }}
                                />
                            ))
                        ) : (
                            <div
                                className={
                                    "flex h-full w-full min-w-[660px] flex-col gap-6 rounded-xl bg-intg-bg-9 px-6 py-9"
                                }
                            >
                                <div className="flex min-h-[550px] w-full flex-1 flex-col items-center justify-center gap-6">
                                    <div className="flex flex-col items-center gap-2">
                                        <ChartBar strokeWidth={4} size={62} color="#AFAAC7" />
                                        <Header
                                            title="No response"
                                            description="No response for selected time period"
                                            className="max-w-[386px] text-center"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {responses.length > 0 ? (
                            <Pagination
                                hasNextPage={responseQuery?.responses?.pageInfo.hasNextPage ?? false}
                                hasPrevPage={responseQuery?.responses?.pageInfo.hasPreviousPage ?? false}
                                nextPageFn={() => fetchMoreResponses("forward")}
                                prevPageFn={() => fetchMoreResponses("backward")}
                                itemName="Responses"
                                totalCount={responseQuery?.responses?.totalCount ?? 0}
                                className="pl-2"
                            />
                        ) : null}
                    </div>
                ) : (
                    <ResponseDetails
                        onBackPress={() => {
                            setActiveResponse(null);
                            if (activeResponse.openedFrom !== "Responses") {
                                setTab(activeResponse.openedFrom);
                            }
                        }}
                    />
                )}
            </div>
        </div>
    );
};
