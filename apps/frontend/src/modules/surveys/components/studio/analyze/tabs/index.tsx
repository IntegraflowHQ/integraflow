import useAnalyze from "@/modules/surveys/hooks/useAnalyze";
import { AnalyzeTabs } from "@/types";
import { ChartBar, ChartPie, Document, PresentationChartLine, TrendingUp } from "@/ui/icons";
import { cn } from "@/utils";
import * as Tabs from "@radix-ui/react-tabs";
import { Insights } from "./Insights";
import { Overview } from "./Overview";
import { Responses } from "./Responses";
import { Text } from "./Text";
import { Trends } from "./Trends";

const tabs = [
    { label: AnalyzeTabs.Overview, screen: Overview, icon: PresentationChartLine },
    { label: AnalyzeTabs.Responses, screen: Responses, icon: ChartBar },
    { label: AnalyzeTabs.Insight, screen: Insights, icon: ChartPie },
    { label: AnalyzeTabs.Trends, screen: Trends, icon: TrendingUp },
    { label: AnalyzeTabs.Text, screen: Text, icon: Document },
] as const;

export default function Index() {
    const { tab, setTab } = useAnalyze();

    return (
        <Tabs.Root
            className="flex w-full gap-12 pl-10 pr-[45px]"
            value={tab}
            onValueChange={(value) => {
                if (!value) {
                    return;
                }
                setTab(value as typeof tab);
            }}
        >
            <div className="w-[386px] pt-[155px]">
                <Tabs.List className="flex max-w-[302px] flex-col gap-2 pt-[25px]">
                    {tabs.map(({ label, icon: Icon }) => (
                        <Tabs.Trigger
                            key={label}
                            value={label}
                            className="flex items-center gap-3 rounded-lg p-6 text-intg-text hover:bg-intg-bg-9 data-[state=active]:bg-intg-bg-9"
                        >
                            <Icon
                                size={24}
                                color={tab === label ? "#7EE787" : "#AAAACC"}
                                className={cn(tab === label ? "" : "opacity-[0.4667]")}
                            />
                            <span>{label}</span>
                        </Tabs.Trigger>
                    ))}
                </Tabs.List>
            </div>

            <>
                {tabs.map(({ label, screen: Screen }) => {
                    return (
                        <Tabs.Content
                            key={label}
                            value={label}
                            className="scrollbar-hide h-screen flex-1 overflow-y-scroll pb-[27px] pt-[155px]"
                        >
                            {label === "Overview" ? (
                                <Screen jumpToResponses={() => setTab(AnalyzeTabs.Responses)} />
                            ) : (
                                <Screen />
                            )}
                        </Tabs.Content>
                    );
                })}
            </>
        </Tabs.Root>
    );
}
