import useAnalyze from "@/modules/surveys/hooks/useAnalyze";
import { Button, Header } from "@/ui";
import { PresentationChartLine } from "@/ui/icons";
import CES from "assets/images/surveys/studio/ces-chart.svg";
import CSAT from "assets/images/surveys/studio/csat-chart.svg";
import NPS from "assets/images/surveys/studio/nps-chart.svg";
import ResponseTrends from "assets/images/surveys/studio/response-trends.svg";
import { BadgeCheck, BarChart, Clock3 } from "lucide-react";
import { DateFilter } from "../components/DateFilter";
import { ExportBtn } from "../components/ExportBtn";
import { Response } from "../components/Response";
import { Summary } from "../components/Summary";

const charts = [NPS, CES, CSAT];

export const Overview = ({ jumpToResponses }: { jumpToResponses?: () => void }) => {
    const { responses, setActiveResponse } = useAnalyze();

    if (responses.length === 0) {
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
                    <DateFilter />
                    <ExportBtn />
                </div>

                <div className="flex gap-6 rounded-lg bg-intg-bg-15 p-6">
                    <Summary
                        icon={<BarChart strokeWidth={4} className="text-intg-text" />}
                        title="Total Responses"
                        value="0"
                        trend="+10%"
                        trendName="Repeat - 0"
                        trendVariant="positive"
                    />
                    <Summary
                        icon={<BadgeCheck className="fill-intg-text text-intg-bg-8" />}
                        title="Completion rate"
                        value="100%"
                        trend="+10%"
                        trendName="Compared to last week"
                        trendVariant="neutral"
                    />
                    <Summary
                        icon={<Clock3 className="fill-intg-text text-intg-bg-8" />}
                        title="Avg rate"
                        value="01m 52s%"
                        trend="-10%"
                        trendName="Compared to last week"
                        trendVariant="negative"
                    />
                </div>

                <div className="flex gap-[14px] py-4">
                    <section className="flex flex-col gap-[14px]">
                        {charts.map((chart, i) => (
                            <section key={i} className="relative">
                                <img src={chart} className="w-full opacity-30" />

                                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-lg">
                                    <span className="text-lg text-white">Coming Soon</span>
                                    <Button
                                        variant="secondary"
                                        text="Notify me"
                                        className="w-max px-8 py-[8px]"
                                        onClick={() => {
                                            //TODO: implement notify me
                                        }}
                                    />
                                </div>
                            </section>
                        ))}
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
                            {responses.slice(0, 8).map((response) => (
                                <Response
                                    title={response.title}
                                    date={new Date(response.completedAt ?? response.createdAt ?? "")}
                                    responder={response.userAttributes.name ?? response.userAttributes.id}
                                    key={response.id}
                                    onClick={() => {
                                        setActiveResponse(response);
                                        jumpToResponses?.();
                                    }}
                                />
                            ))}
                        </div>
                    </section>
                </div>

                <section className="relative w-full">
                    <img src={ResponseTrends} className="w-full opacity-30" />

                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-lg">
                        <span className="text-lg text-white">Coming Soon</span>
                        <Button
                            variant="secondary"
                            text="Notify me"
                            className="w-max px-8 py-[8px]"
                            onClick={() => {
                                //TODO: implement notify me
                            }}
                        />
                    </div>
                </section>
            </div>
        </div>
    );
};
