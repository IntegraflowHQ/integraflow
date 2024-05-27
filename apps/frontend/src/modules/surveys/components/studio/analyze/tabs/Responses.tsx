import useAnalyze from "@/modules/surveys/hooks/useAnalyze";
import { Header } from "@/ui";
import { ChartBar } from "@/ui/icons";
import { cn } from "@/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
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
                                    responder={response.userAttributes.name ?? response.userAttributes.id}
                                    key={response.id}
                                    onClick={() => {
                                        setActiveResponse(response);
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
                            <div className="flex items-center justify-between text-intg-text-4">
                                <p>{responseQuery?.responses?.totalCount ?? 0} responses</p>

                                <div className="flex gap-4">
                                    <button
                                        disabled={!responseQuery?.responses?.pageInfo.hasPreviousPage}
                                        onClick={() => fetchMoreResponses("backward")}
                                        className={cn(
                                            !responseQuery?.responses?.pageInfo.hasPreviousPage
                                                ? "cursor-not-allowed opacity-50"
                                                : "",
                                            "flex items-center gap-1 rounded-md border border-intg-bg-4 font-normal transition hover:bg-intg-bg-8",
                                        )}
                                    >
                                        <ChevronLeft />
                                        <span className="py-1 pr-2">Prev page</span>
                                    </button>

                                    <button
                                        disabled={!responseQuery?.responses?.pageInfo.hasNextPage}
                                        onClick={() => fetchMoreResponses("forward")}
                                        className={cn(
                                            !responseQuery?.responses?.pageInfo.hasNextPage
                                                ? "cursor-not-allowed opacity-50"
                                                : "",
                                            "flex items-center gap-1 rounded-md border border-intg-bg-4 font-normal transition hover:bg-intg-bg-8",
                                        )}
                                    >
                                        <span className="py-1 pl-2">Next page</span>
                                        <ChevronRight />
                                    </button>
                                </div>
                            </div>
                        ) : null}
                    </div>
                ) : (
                    <ResponseDetails
                        onBackPress={() => {
                            setActiveResponse(null);
                        }}
                    />
                )}
            </div>
        </div>
    );
};
