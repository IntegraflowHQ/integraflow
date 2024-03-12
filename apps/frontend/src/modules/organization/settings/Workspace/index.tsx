import * as Tabs from "@radix-ui/react-tabs";
import { useState } from "react";
import { SettingsScreen } from "../SettingsScreen";
import { Billing } from "./Billing";
import { General } from "./General";
import { Member } from "./Member";

const tabs = [
    {
        label: "General",
        screen: General,
    },
    {
        label: "Member",
        screen: Member,
    },
    {
        label: "Billing",
        screen: Billing,
    },
];

export const Workspace = () => {
    const [activeTab, setActiveTab] = useState("");

    return (
        <SettingsScreen label="" title="">
            <Tabs.Root className="h-full w-full" value={activeTab} onValueChange={setActiveTab}>
                <Tabs.List className="flex gap-[15px]">
                    {tabs.map((tab) => (
                        <Tabs.Trigger
                            key={tab.label}
                            value={tab.label}
                            className={`rounded-md px-3 py-2 text-sm text-intg-text transition-all ease-in hover:bg-[#272138] data-[state=active]:bg-[#272138] data-[state=active]:text-white`}
                        >
                            {tab.label}
                        </Tabs.Trigger>
                    ))}
                </Tabs.List>

                {tabs.map(({ screen: Screen, label }) => (
                    <Tabs.Content key={label} value={label}>
                        <div className="flex items-center justify-between ">
                            <div className="w-[593px]  border">
                                <Screen />
                            </div>
                        </div>
                    </Tabs.Content>
                ))}
            </Tabs.Root>
        </SettingsScreen>
    );
};
