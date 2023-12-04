import { HelpCircle, SettingsIcon } from "@/ui/icons";

import * as Tabs from "@radix-ui/react-tabs";
import { Pen } from "lucide-react";
import UpdateQuestion from "./Create/UpdateQuestion";

const tabs = [
    {
        label: "Update question",
        icon: <HelpCircle />,
        content: <UpdateQuestion />,
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

            {tabs.map(({ content, label }) => (
                <Tabs.Content value={label} className="flex-1" asChild>
                    {content}
                </Tabs.Content>
            ))}
        </Tabs.Root>
    );
}
