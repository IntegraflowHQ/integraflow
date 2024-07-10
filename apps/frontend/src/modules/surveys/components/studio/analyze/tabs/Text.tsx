import { useAnalytics } from "@/hooks/useAnalytics";
import useAnalyze from "@/modules/surveys/hooks/useAnalyze";
import { ComingSoon, Header } from "@/ui";
import { Document } from "@/ui/icons";
import WordCountTable from "assets/images/surveys/studio/word-count-table.svg";
import WordCount from "assets/images/surveys/studio/word-count.svg";
import { DateFilter } from "../components/DateFilter";
import { ExportBtn } from "../components/ExportBtn";

export const Text = () => {
    const { lastEightResponses, timeFrame, setTimeFrame } = useAnalyze();
    const { capture } = useAnalytics();

    if (lastEightResponses.length === 0) {
        return (
            <div className={"flex h-full w-full min-w-[660px] flex-col gap-6 rounded-xl bg-intg-bg-9 px-6 py-9"}>
                <div className="flex h-full w-full flex-1 flex-col items-center justify-center gap-6">
                    <div className="flex flex-col items-center gap-2">
                        <Document color="#AFAAC7" size={62} strokeWidth={2} />
                        <Header
                            title="No text yet"
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
                    title="Insights"
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
                className="min-h-[437px]"
                eventProperties={{ screen: "Analyze", feature: "Word cloud", component: "Text tab" }}
            >
                <img src={WordCount} className="w-full opacity-40" />
            </ComingSoon>

            <ComingSoon
                className="min-h-[774px]"
                eventProperties={{ screen: "Analyze", feature: "Word count table", component: "Text tab" }}
            >
                <img src={WordCountTable} className="w-full opacity-40" />
            </ComingSoon>
        </div>
    );
};
