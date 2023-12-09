import { HelpCircle, SettingsIcon } from "@/ui/icons";
import * as Tabs from "@radix-ui/react-tabs";
import { Pen } from "lucide-react";
import React from "react";
import { Preview } from "../preview-panel/index.tsx";
import { UpdateDesignEditor } from "./DesignEditor";
import { StudioTooltip } from "./components/Tooltip.tsx";

const tabs = [
    {
        id: crypto.randomUUID(),
        label: "Update questions",
        icon: <HelpCircle />,
        content: <div>Question</div>,
    },
    {
        id: crypto.randomUUID(),
        label: "Update design",
        icon: <Pen size={20} color="#AFAAC7" fill="#AFAAC7" />,
        content: <UpdateDesignEditor />,
    },
    {
        id: crypto.randomUUID(),
        label: "Update settings",
        icon: <SettingsIcon />,
        content: <div>Settings</div>,
    },
];

export default function Create() {
    const [activeTab, setActiveTab] = React.useState<string>(tabs[0].id);

    return (
        <Tabs.Root
            className="flex h-screen pt-[84px]"
            defaultValue={tabs[0].label}
        >
            <Tabs.List className="flex h-full flex-col gap-6 border-r border-intg-bg-4 px-[18px] pt-12">
                {tabs.map(({ id, label, icon }) => (
                    <Tabs.Trigger
                        value={label}
                        onClick={() => setActiveTab(id)}
                        className={`h-9 rounded px-2 ease-in-out hover:bg-intg-bg-13 hover:transition-all ${
                            activeTab === id ? "bg-intg-bg-13" : ""
                        }`}
                    >
                        <StudioTooltip id={id} info={label} item={icon} />
                    </Tabs.Trigger>
                ))}
            </Tabs.List>

            <div className="flex flex-1 gap-[38px] overflow-y-scroll pb-8 pl-5 pr-12 pt-6">
                {tabs.map(({ content, label }) => (
                    <Tabs.Content value={label} className="w-[519px]">
                        {content}
                    </Tabs.Content>
                ))}
                <Preview />
            </div>
        </Tabs.Root>
    );
}
