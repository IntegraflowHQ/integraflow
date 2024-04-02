import * as Tabs from "@radix-ui/react-tabs";
import { Insights } from "./insights";
import { Overview } from "./overview";
import { Responses } from "./responses";
import { Text } from "./text";
import { Trends } from "./trends";

export default function Analyze() {
    const tabs = [
        { label: "Overview", screen: <Overview /> },
        { label: "Responses", screen: <Responses /> },
        { label: "Insight", screen: <Insights /> },
        { label: "Trends", screen: <Trends /> },
        { label: "Text", screen: <Text /> },
    ];

    return (
        <Tabs.Root className="flex w-full gap-12 pl-10 pr-[45px]" defaultValue={tabs[0].label}>
            <div className="w-[386px] pt-[155px]">
                <Tabs.List className="flex max-w-[302px] flex-col gap-2 pt-[25px]">
                    {tabs.map(({ label }) => (
                        <Tabs.Trigger
                            key={label}
                            value={label}
                            className="flex items-center gap-3 rounded-lg p-6 text-intg-text hover:bg-intg-bg-9 data-[state=active]:bg-intg-bg-9"
                        >
                            {label}
                        </Tabs.Trigger>
                    ))}
                </Tabs.List>
            </div>

            <>
                {tabs.map((tab) => {
                    return (
                        <Tabs.Content
                            key={tab.label}
                            value={tab.label}
                            className="scrollbar-hide h-screen flex-1 overflow-y-scroll pb-[27px] pt-[155px]"
                        >
                            {tab.screen}
                        </Tabs.Content>
                    );
                })}
            </>
        </Tabs.Root>
    );
}
