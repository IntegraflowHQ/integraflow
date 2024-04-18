import { HelpCircle, SettingsIcon } from "@/ui/icons";
import * as Tabs from "@radix-ui/react-tabs";
import * as Tooltip from "@radix-ui/react-tooltip";
import { Pen } from "lucide-react";
import React from "react";
import ScrollToBottom from "react-scroll-to-bottom";
import { UpdateDesignEditor } from "./editor-panel/DesignEditor/index.tsx";
import { UpdateSettingsEditor } from "./editor-panel/SettingsEditor/index.tsx";
import UpdateQuestion from "./editor-panel/questions/index.tsx";
import { Preview } from "./preview-panel/index.tsx";

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
        <Tabs.Root className="flex h-screen pt-[84px]" defaultValue={tabs[0].label}>
            <Tabs.List className="flex h-full flex-col gap-6 border-r border-intg-bg-4 px-[18px] pt-12">
                {tabs.map(({ id, label, icon }, index: React.Key) => (
                    <Tabs.Trigger
                        value={label}
                        key={index}
                        className="data-[state=active]:rounded-md data-[state=active]:bg-[#272138]"
                        asChild
                    >
                        <div>
                            <Tooltip.Provider>
                                <Tooltip.Root key={id} delayDuration={200}>
                                    <Tooltip.Trigger className="h-9 rounded px-2 ease-in-out hover:bg-intg-bg-15 hover:transition-all">
                                        {icon}
                                    </Tooltip.Trigger>

                                    <Tooltip.Portal>
                                        <Tooltip.Content
                                            side="right"
                                            align="center"
                                            className="rounded border border-intg-bg-10 bg-intg-bg-9 px-2 py-3 text-xs leading-[18px] text-intg-text"
                                        >
                                            {label}
                                            <Tooltip.Arrow
                                                width={18}
                                                height={16}
                                                className="-mt-[1px] fill-[#181325] stroke-intg-bg-10"
                                            />
                                        </Tooltip.Content>
                                    </Tooltip.Portal>
                                </Tooltip.Root>
                            </Tooltip.Provider>
                        </div>
                    </Tabs.Trigger>
                ))}
            </Tabs.List>

            <div className="flex max-h-[calc(100vh-110px)] flex-1 gap-[38px] pl-5 pr-12 pt-6">
                <ScrollToBottom
                    mode="bottom"
                    scrollViewClassName="scrollbar-hide overflow-y-auto max-h-[calc(100vh-110px)] h-full"
                    className="max-h-[calc(100vh-110px)] w-[519px] pb-8"
                >
                    {tabs.map(({ content, label, id }) => (
                        <Tabs.Content key={id} value={label}>
                            {content}
                        </Tabs.Content>
                    ))}
                </ScrollToBottom>

                <div className="min-w-[580px] flex-1 pb-8">
                    <Preview />
                </div>
            </div>
        </Tabs.Root>
    );
}
