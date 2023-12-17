import { HelpCircle, SettingsIcon } from "@/ui/icons";
import * as Tabs from "@radix-ui/react-tabs";
import * as Tooltip from "@radix-ui/react-tooltip";
import { Pen } from "lucide-react";
import UpdateQuestion from "../index.tsx";
import React from "react";
import { Preview } from "../preview-panel/index.tsx";
import { UpdateDesignEditor } from "./DesignEditor";
import { UpdateSettingsEditor } from "./SettingsEditor";

const tabs = [
    {
        id: crypto.randomUUID(),
        label: "Update questions",
        icon: <HelpCircle />,
        content: <UpdateQuestion />,
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
        content: <UpdateSettingsEditor />,
    },
];

export default function Create() {
    return (
        <Tabs.Root
            className="flex h-screen pt-[84px]"
            defaultValue={tabs[0].label}
        >
            <Tabs.List className="flex h-full flex-col gap-6 border-r border-intg-bg-4 px-[18px] pt-12">
                {tabs.map(({ id, label, icon }, index: React.Key) => (
                    <Tabs.Trigger
                        value={label}
                        key={index}
                        className="data-[state=active]:bg-intg-bg-15 data-[state=active]:rounded-md"
                        asChild
                    >
                        <div>
                            <Tooltip.Provider>
                                <Tooltip.Root key={id}>
                                    <Tooltip.Trigger className="hover:bg-intg-bg-15 h-9 rounded px-2 ease-in-out hover:transition-all">
                                        {icon}
                                    </Tooltip.Trigger>

                                    <Tooltip.Portal>
                                        <Tooltip.Content className="tooltip__arrow">
                                            <div className="absolute -left-6 top-1 ml-16 rounded-md border border-intg-text-4 bg-intg-bg-9 px-1 py-2 text-xs text-intg-text-4">
                                                <p className="w-28">{label}</p>
                                            </div>
                                        </Tooltip.Content>
                                    </Tooltip.Portal>
                                </Tooltip.Root>
                            </Tooltip.Provider>
                        </div>
                    </Tabs.Trigger>
                ))}
            </Tabs.List>

            <div className="flex flex-1 gap-[38px] pl-5 pr-12 pt-6">
                {tabs.map(({ content, label, id }) => (
                    <Tabs.Content
                        key={id}
                        value={label}
                        className="scrollbar-hide w-[519px] overflow-y-auto pb-8"
                    >
                        {content}
                    </Tabs.Content>
                ))}
                <div className="min-w-[580px] flex-1 pb-8">
                    <Preview />
                </div>
            </div>
        </Tabs.Root>
    );
}
