import useAnalyze from "@/modules/surveys/hooks/useAnalyze";
import { ComingSoon, Header } from "@/ui";
import { ChartPie } from "@/ui/icons";
import EmojiInsights from "assets/images/surveys/studio/emoji-insights.svg";
import NPSInsights from "assets/images/surveys/studio/nps-insights.svg";
import RatingInsights from "assets/images/surveys/studio/rating-insights.svg";
import { BarChart } from "lucide-react";
import { DateFilter } from "../components/DateFilter";
import { ExportBtn } from "../components/ExportBtn";
import { Summary } from "../components/Summary";

export const Insights = () => {
    const { lastEightResponses, timeFrame, setTimeFrame } = useAnalyze();

    if (lastEightResponses.length === 0) {
        return (
            <div className={"flex h-full w-full min-w-[660px] flex-col gap-6 rounded-xl bg-intg-bg-9 px-6 py-9"}>
                <div className="flex h-full w-full flex-1 flex-col items-center justify-center gap-6">
                    <div className="flex flex-col items-center gap-2">
                        <ChartPie size={62} strokeWidth={2} color="#AFAAC7" />
                        <Header
                            title="No insights yet"
                            description="Overview Report to get a quick summary and analysis of responses, CX metrics and survey distribution channels."
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
                    title="Insights"
                    description="Overview Report to get a quick summary and analysis of responses, CX metrics and survey
                distribution channels."
                    className="max-w-[375px] pb-8"
                />
                <div className="flex items-center justify-between pb-[14px]">
                    <DateFilter defaultValue={timeFrame} onValueChange={setTimeFrame} />
                    <ExportBtn />
                </div>
                feature="Insight" component="Response"
                <div className="flex gap-6 rounded-lg bg-intg-bg-15 p-6">
                    <ComingSoon
                        eventProperties={{ screen: "Analyze", feature: "Response Insight", component: "Insights tab" }}
                        className="min-h-[155px]"
                    >
                        <Summary
                            icon={<BarChart strokeWidth={4} className="text-intg-text" />}
                            title="Response"
                            value={"4"}
                            trendName={"Repeat - 0"}
                            trendVariant={"positive"}
                            className="opacity-40"
                        />
                    </ComingSoon>
                    <ComingSoon
                        eventProperties={{ screen: "Analyze", feature: "CSAT Insight", component: "Insight tab" }}
                        className="min-h-[155px]"
                    >
                        <Summary
                            icon={<BarChart strokeWidth={4} className="text-intg-text" />}
                            title="CSAT"
                            value={"3.67"}
                            trend={"10%"}
                            trendName={"Responses - 3"}
                            trendVariant={"positive"}
                            coloredValue
                            className="opacity-40"
                        />
                    </ComingSoon>
                    <ComingSoon
                        className="min-h-[155px]"
                        eventProperties={{ screen: "Analyze", feature: "NPS Insight", component: "Insight tab" }}
                    >
                        <Summary
                            icon={<BarChart strokeWidth={4} className="text-intg-text" />}
                            title="NPS"
                            value={"-66.67"}
                            trend={"-10%"}
                            trendName={"Responses - 3"}
                            trendVariant={"negative"}
                            coloredValue
                            className="opacity-40"
                        />
                    </ComingSoon>
                    <ComingSoon
                        eventProperties={{ screen: "Analyze", feature: "CES Insight", component: "Insight tab" }}
                        className="min-h-[155px]"
                    >
                        <Summary
                            icon={<BarChart strokeWidth={4} className="text-intg-text" />}
                            title="CES"
                            value={"4.67"}
                            trend={"10%"}
                            trendName={"Responses - 3"}
                            trendVariant={"positive"}
                            coloredValue
                            className="opacity-40"
                        />
                    </ComingSoon>
                </div>
            </div>

            <ComingSoon
                className="min-h-[877px]"
                eventProperties={{ screen: "Analyze", feature: "Rating Insight", component: "Insight tab" }}
            >
                <img src={RatingInsights} className="w-full opacity-30" />
            </ComingSoon>

            <ComingSoon
                eventProperties={{ screen: "Analyze", feature: "Emoji Insight", component: "Insight tab" }}
                className="min-h-[877px]"
            >
                <img src={EmojiInsights} className="w-full opacity-30" />
            </ComingSoon>

            <ComingSoon
                eventProperties={{ screen: "Analyze", feature: "NPS Insight", component: "Insight tab" }}
                className="min-h-[516px]"
            >
                <img src={NPSInsights} className="w-full opacity-30" />
            </ComingSoon>
        </div>
    );
};
