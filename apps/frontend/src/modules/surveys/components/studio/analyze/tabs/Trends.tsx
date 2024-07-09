import { useAnalytics } from "@/hooks/useAnalytics";
import useAnalyze from "@/modules/surveys/hooks/useAnalyze";
import { ComingSoon, Header } from "@/ui";
import { TrendingUp } from "@/ui/icons";
import NPSTrends from "assets/images/surveys/studio/nps-trend.svg";
import ResponsesByDayAndTime from "assets/images/surveys/studio/responses-by-day-and-time.svg";
import { DateFilter } from "../components/DateFilter";
import { ExportBtn } from "../components/ExportBtn";

export const Trends = () => {
    const { lastEightResponses, timeFrame, setTimeFrame } = useAnalyze();
    const { handleAnalytics } = useAnalytics();

    if (lastEightResponses.length === 0) {
        return (
            <div className={"flex h-full w-full min-w-[660px] flex-col gap-6 rounded-xl bg-intg-bg-9 px-6 py-9"}>
                <div className="flex h-full w-full flex-1 flex-col items-center justify-center gap-6">
                    <div className="flex flex-col items-center gap-2">
                        <TrendingUp strokeWidth={4} size={62} color="#AFAAC7" />
                        <Header
                            title="No trends yet"
                            description="Overview Report to get a quick summary and analysis of responses, CX metrics and survey distribution channels."
                            className="max-w-[386px] text-center"
                        />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={"flex min-h-full w-full min-w-[660px] flex-col gap-4 rounded-xl bg-intg-bg-9 px-6 py-9"}>
            <div>
                <Header
                    title="Trends"
                    description="Overview Report to get a quick summary and analysis of responses, CX metrics and survey
                distribution channels."
                    className="max-w-[375px] pb-8"
                />

                <div className="flex items-center justify-between">
                    <DateFilter defaultValue={timeFrame} onValueChange={setTimeFrame} />
                    <ExportBtn />
                </div>
            </div>

            <ComingSoon
                className="min-h-[769px]"
                notifyFn={() =>
                    handleAnalytics("Notify me", {
                        screen: "Analyze",
                        feature: "Text",
                        component: "Word count table",
                    })
                }
            >
                <img src={NPSTrends} className="w-full opacity-30" />
            </ComingSoon>

            <ComingSoon
                className="min-h-[246px]"
                notifyFn={() =>
                    handleAnalytics("Notify me", {
                        screen: "Analyze",
                        feature: "Trends",
                        component: "Responses by day and time",
                    })
                }
            >
                <img src={ResponsesByDayAndTime} className="w-full opacity-30" />
            </ComingSoon>
        </div>
    );
};
