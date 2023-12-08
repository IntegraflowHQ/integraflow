import { HelpCircle, SettingsIcon } from "@/ui/icons";

import * as Tabs from "@radix-ui/react-tabs";
import { Pen } from "lucide-react";
import { Preview } from "../preview-panel/index.tsx";

const tabs = [
    {
        label: "Update questions",
        icon: <HelpCircle />,
        content: <div>Update question</div>,
    },
    {
        label: "Update design",
        icon: <Pen size={20} color="#AFAAC7" fill="#AFAAC7" />,
        content: <div>Design</div>,
    },
    {
        label: "Update settings",
        icon: <SettingsIcon />,
        content: <div>Settings</div>,
    },
];

export default function Create() {
    return (
        <Tabs.Root
            className="flex h-screen pt-[84px]"
            defaultValue={tabs[0].label}
        >
            <Tabs.List className="flex h-full flex-col gap-6 border-r border-intg-bg-4 px-[18px] pt-12">
                {tabs.map((tab) => (
                    <Tabs.Trigger value={tab.label} className="p-2">
                        {tab.icon}
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
