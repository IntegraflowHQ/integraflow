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
    const [activeTab, setActiveTab] = useState(tabs[0].label);

    return (
        <SettingsScreen label="" title="Workspace" showHeaderLine={false}>
            <Tabs.Root className="mt-4 h-full w-full" value={activeTab} onValueChange={setActiveTab}>
                <Tabs.List className="flex gap-[15px] pl-[72px]">
                    {tabs.map((tab) => (
                        <Tabs.Trigger
                            key={tab.label}
                            value={tab.label}
                            className={`rounded-md pl-[]  text-sm text-intg-text transition-all ease-in  data-[state=active]:text-white`}
                        >
                            {tab.label}
                        </Tabs.Trigger>
                    ))}
                </Tabs.List>
                <hr className=" border-[1px] border-intg-bg-4" />
                {tabs.map(({ screen: Screen, label }) => (
                    <Tabs.Content key={label} value={label}>
                        <div className="pl-[72px]">
                            <Screen />
                        </div>
                    </Tabs.Content>
                ))}
            </Tabs.Root>
        </SettingsScreen>
    );
};
