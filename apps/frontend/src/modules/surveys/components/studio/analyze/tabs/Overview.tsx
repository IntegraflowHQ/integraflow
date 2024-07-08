import useAnalyze from "@/modules/surveys/hooks/useAnalyze";
import { AnalyzeTabs } from "@/types";
import { ComingSoon, Header } from "@/ui";
import { PresentationChartLine } from "@/ui/icons";
import ResponseTrends from "assets/images/surveys/studio/response-trends.svg";
import { intervalToDuration } from "date-fns";
import { BadgeCheck, BarChart, Clock3 } from "lucide-react";
import { useMemo } from "react";
import { DateFilter } from "../components/DateFilter";
import { ExportBtn } from "../components/ExportBtn";
import { MetricPieChart } from "../components/MetricPieChart";
import { Response } from "../components/Response";
import { Summary } from "../components/Summary";

export const Overview = ({ jumpToResponses }: { jumpToResponses?: () => void }) => {
    const {
        lastEightResponses,
        npsMetric,
        cesMetric,
        csatMetric,
        totalResponses,
        completionRate,
        averageTime,
        timeFrame,
        setActiveResponse,
        setTimeFrame,
        calculatePercentageDifference,
    } = useAnalyze();

    const completionRatePercentageDifference = calculatePercentageDifference(completionRate);
    const totalResponsesPercentageDifference = calculatePercentageDifference(totalResponses);
    const averageTimePercentageDifference = calculatePercentageDifference(averageTime);

    const averageTimeText = useMemo(() => {
        const result = intervalToDuration({ start: 0, end: (averageTime?.current.value ?? 0) * 1000 });
        if (result.hours) {
            return `${result.hours}h ${result.minutes}m ${result.seconds}s`;
        }

        if (result.minutes) {
            return `${result.minutes}m ${result.seconds}s`;
        }

        return `${result.seconds}s`;
    }, [averageTime]);

    let trendName = "";
    if (timeFrame.timePeriod === "custom") {
        trendName = "Compared to last week";
    } else if (timeFrame.timePeriod === "today") {
        trendName = "Compared to last day";
    } else if (timeFrame.timePeriod === "last 7 days") {
        trendName = "Compared to last week";
    } else if (timeFrame.timePeriod === "30 days") {
        trendName = "Compared to last month";
    } else if (timeFrame.timePeriod === "1 year") {
        trendName = "Compared to last year";
    }

    if (lastEightResponses.length === 0) {
        return (
            <div className={"flex h-full w-full min-w-[660px] flex-col gap-6 rounded-xl bg-intg-bg-9 px-6 py-9"}>
                <div className="flex h-full w-full flex-1 flex-col items-center justify-center gap-6">
                    <div className="flex flex-col items-center gap-2">
                        <PresentationChartLine size={62} color="#AFAAC7" />
                        <Header
                            title="No overview yet"
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
                    title="Overview"
                    description="Overview Report to get a quick summary and analysis of responses, CX metrics and survey
                        distribution channels."
                    className="max-w-[375px] pb-8"
                />

                <div className="flex items-center justify-between pb-[14px]">
                    <DateFilter defaultValue={timeFrame} onValueChange={setTimeFrame} />
                    <ExportBtn />
                </div>

                <div className="flex gap-6 rounded-lg bg-intg-bg-15 p-6">
                    <Summary
                        icon={<BarChart strokeWidth={4} className="text-intg-text" />}
                        title="Total Responses"
                        value={totalResponses?.current?.value?.toString() ?? "0"}
                        trend={`${totalResponsesPercentageDifference >= 0 ? "+" : ""}${totalResponsesPercentageDifference.toFixed(2)}%`}
                        trendName={trendName}
                        trendVariant={
                            totalResponsesPercentageDifference > 0
                                ? "positive"
                                : totalResponsesPercentageDifference < 0
                                  ? "negative"
                                  : "neutral"
                        }
                    />
                    <Summary
                        icon={<BadgeCheck className="fill-intg-text text-intg-bg-8" />}
                        title="Completion rate"
                        value={`${completionRate?.current.value?.toFixed(2) ?? "100"}%`}
                        trend={`${completionRatePercentageDifference >= 0 ? "+" : ""}${completionRatePercentageDifference.toFixed(2)}%`}
                        trendName={trendName}
                        trendVariant={
                            completionRatePercentageDifference > 0
                                ? "positive"
                                : completionRatePercentageDifference < 0
                                  ? "negative"
                                  : "neutral"
                        }
                    />
                    <Summary
                        icon={<Clock3 className="fill-intg-text text-intg-bg-8" />}
                        title="Avg rate"
                        value={averageTimeText}
                        trend={`${averageTimePercentageDifference >= 0 ? "+" : ""}${averageTimePercentageDifference.toFixed(2)}%`}
                        trendName={trendName}
                        trendVariant={
                            averageTimePercentageDifference > 0
                                ? "positive"
                                : averageTimePercentageDifference < 0
                                  ? "negative"
                                  : "neutral"
                        }
                    />
                </div>

                <div className="flex gap-[14px] py-4">
                    <section className="flex flex-col gap-[14px]">
                        <MetricPieChart
                            title="Net Promoter Score"
                            description="View your customers' loyalty metrics."
                            data={
                                npsMetric.detractors + npsMetric.passives + npsMetric.promoters > 0
                                    ? [
                                          { name: "promoters", value: npsMetric.promoters },
                                          { name: "passives", value: npsMetric.passives },
                                          { name: "detractors", value: npsMetric.detractors },
                                      ]
                                    : [{ name: "placeholder", value: 1 }]
                            }
                            average={npsMetric.score.toFixed(2)}
                            legendData={[
                                { name: "Promoters", value: npsMetric.promoters, color: "#8DF0B0" },
                                { name: "Passives", value: npsMetric.passives, color: "#FFB17B" },
                                { name: "Detractors", value: npsMetric.detractors, color: "#EB5A6D" },
                            ]}
                        />

                        <MetricPieChart
                            title="Customer Effort Score (CES)"
                            description="View how much effort your customers exert on your website."
                            data={
                                cesMetric.high + cesMetric.medium + cesMetric.low > 0
                                    ? [
                                          { name: "low", value: cesMetric.low },
                                          { name: "medium", value: cesMetric.medium },
                                          { name: "high", value: cesMetric.high },
                                      ]
                                    : [{ name: "placeholder", value: 1 }]
                            }
                            average={cesMetric.score.toFixed(2)}
                            legendData={[
                                { name: "Low Effort", value: cesMetric.low, color: "#EB5A6D" },
                                { name: "Med Effort", value: cesMetric.medium, color: "#FFB17B" },
                                { name: "High Effort", value: cesMetric.high, color: "#8DF0B0" },
                            ]}
                        />

                        <MetricPieChart
                            title="Customer Satisfaction Score (CSAT)"
                            description="View your Customers' Satisfaction metrics."
                            data={
                                csatMetric.negative + csatMetric.neutral + csatMetric.positive > 0
                                    ? [
                                          { name: "positive", value: csatMetric.positive },
                                          { name: "neutral", value: csatMetric.negative },
                                          { name: "negative", value: csatMetric.neutral },
                                      ]
                                    : [{ name: "placeholder", value: 1 }]
                            }
                            average={csatMetric.score.toFixed(2)}
                            legendData={[
                                { name: "Positive", value: csatMetric.positive, color: "#5D45DB" },
                                { name: "Neutral", value: csatMetric.neutral, color: "#A698EB" },
                                { name: "Negative", value: csatMetric.negative, color: "#D3CCF5" },
                            ]}
                        />
                    </section>

                    <section className="flex-1 rounded-lg bg-intg-bg-15 px-4 pt-6">
                        <header className="flex justify-between pb-4">
                            <h2 className="text-base font-medium text-intg-text">Last 8 responses</h2>
                            <button
                                className="border-b border-b-[#6941C6] bg-gradient-text bg-clip-text text-sm text-transparent"
                                onClick={jumpToResponses}
                            >
                                View all
                            </button>
                        </header>

                        <div className="space-y-2">
                            {lastEightResponses.map((response) => (
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
                                        setActiveResponse({ response, openedFrom: AnalyzeTabs.Overview });
                                        jumpToResponses?.();
                                    }}
                                />
                            ))}
                        </div>
                    </section>
                </div>

                <ComingSoon>
                    <img src={ResponseTrends} className="w-full opacity-30" />
                </ComingSoon>
            </div>
        </div>
    );
};
