import { Header } from "@/ui";
import * as Tabs from "@radix-ui/react-tabs";
import { useState } from "react";
import { Attributes } from "./Attributes";
import { People } from "./People";

const tabs = [
    { label: "People", screen: People },
    {
        label: "Attributes",
        screen: Attributes,
    },
];

export const AudienceIndex = () => {
    const [activeTab, setActiveTab] = useState(tabs[0].label);

    return (
        <section className="px-[72px] pb-20 pt-20">
            <Header title="Audience" description="The customers that you have identified in your product" />
            <Tabs.Root className="mt-4 h-full w-full space-y-4" value={activeTab} onValueChange={setActiveTab}>
                <Tabs.List className="flex gap-4">
                    {tabs.map((tab) => (
                        <Tabs.Trigger
                            key={tab.label}
                            value={tab.label}
                            className={`border-b border-transparent p-1 text-sm text-intg-text transition-all ease-in  data-[state=active]:border-[#53389E] data-[state=active]:text-white`}
                        >
                            {tab.label}
                        </Tabs.Trigger>
                    ))}
                </Tabs.List>
                {tabs.map(({ screen: Screen, label }) => (
                    <Tabs.Content key={label} value={label}>
                        <div>
                            <Screen />
                        </div>
                    </Tabs.Content>
                ))}
            </Tabs.Root>
        </section>
    );
};
