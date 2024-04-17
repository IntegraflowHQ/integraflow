import useAnalyze from "@/modules/surveys/hooks/useAnalyze";
import { Header } from "@/ui";
import { ChartBar } from "@/ui/icons";
import { DateFilter } from "../components/DateFilter";
import { ExportBtn } from "../components/ExportBtn";
import { Response } from "../components/Response";
import { ResponseDetails } from "../components/ResponseDetails";

export const Responses = () => {
    const noContent = false;
    const { responses, activeResponse, setActiveResponse } = useAnalyze();

    if (noContent) {
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

                <div className="flex items-center justify-between pb-[14px]">
                    <DateFilter />
                    <ExportBtn />
                </div>

                {!activeResponse ? (
                    <div className="flex flex-col gap-2 rounded-lg bg-intg-bg-15 p-4">
                        {responses.map((response) => (
                            <Response
                                title={response.title}
                                date={response.date}
                                responder={response.responder}
                                key={response.id}
                                onClick={() => {
                                    setActiveResponse(response);
                                }}
                            />
                        ))}
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
