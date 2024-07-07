import * as Tabs from "@radix-ui/react-tabs";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
    const navigate = useNavigate();
    const location = useLocation();
    const [activeTab, setActiveTab] = useState(tabs[0].label);

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        if (queryParams.has("billing")) {
            setActiveTab(tabs[2].label);
        }
    }, [location.search]);

    useEffect(() => {
        if (activeTab === "Billing") {
            navigate(`${window.location.pathname}?billing`, { replace: true });
        } else {
            navigate(window.location.pathname, { replace: true });
        }
    }, [activeTab, navigate]);

    return (
        <SettingsScreen label="" title="Workspace" showHeaderLine={false}>
            <Tabs.Root className="mt-4 h-full w-full" value={activeTab} onValueChange={setActiveTab}>
                <Tabs.List className="flex gap-4 pl-[72px]">
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
