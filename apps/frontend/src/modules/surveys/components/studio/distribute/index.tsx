import { CheckComplete, CheckPending } from "@/ui/icons";
import * as Tabs from "@radix-ui/react-tabs";
import { useState } from "react";
import SharableLinks from "./sharable-links";
import WebSDK from "./web-sdk";

const tabs = [
    {
        id: crypto.randomUUID(),
        name: "Shareable Links",
        content: <SharableLinks />,
    },
    {
        id: crypto.randomUUID(),
        name: "Email",
        content: <div className="text-white">Hello</div>,
    },
    {
        id: crypto.randomUUID(),
        name: "Web SDK",
        content: <WebSDK />,
    },
    {
        id: crypto.randomUUID(),
        name: "Mobile SDK",
        content: <div className="text-white">Hello</div>,
    },
    {
        id: crypto.randomUUID(),
        name: "SMS (coming soon)",
        content: <div className="text-white">Hello</div>,
    },
    {
        id: crypto.randomUUID(),
        name: "Offline apps",
        content: <div className="text-white">Hello</div>,
    },
    {
        id: crypto.randomUUID(),
        name: "Integration",
        content: <div className="text-white">Hello</div>,
    },
];

export default function Distribute() {
    const [currentTab, setCurrentTab] = useState(tabs[0].id);
    return (
        <Tabs.Root
            className="flex w-full gap-12 pl-10 pr-[45px]"
            defaultValue={tabs[0].id}
            value={currentTab}
            onValueChange={(value) => setCurrentTab(value)}
        >
            <div className="w-[386px] pt-[155px]">
                <Tabs.List className="flex max-w-[302px] flex-col gap-2 pt-[25px]">
                    {tabs.map((tab) => (
                        <Tabs.Trigger
                            key={tab.id}
                            value={tab.id}
                            className="flex items-center gap-3 rounded-lg p-6 hover:bg-intg-bg-9 data-[state=active]:bg-intg-bg-9"
                        >
                            {tab.id === currentTab ? (
                                <CheckComplete />
                            ) : (
                                <CheckPending />
                            )}
                            <span className="min-w-max text-base text-intg-text">
                                {tab.name}
                            </span>
                        </Tabs.Trigger>
                    ))}
                </Tabs.List>
            </div>

            <div className=" scrollbar-hide h-screen flex-1 overflow-y-scroll pb-[27px] pt-[155px]">
                {tabs.map((tab) => {
                    return (
                        <Tabs.Content key={tab.id} value={tab.id} asChild>
                            {tab.content}
                        </Tabs.Content>
                    );
                })}
            </div>
        </Tabs.Root>
    );
}
