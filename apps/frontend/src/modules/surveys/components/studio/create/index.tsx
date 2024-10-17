import { useStudioStore } from "@/modules/surveys/states/studio.ts";
import { PreviewMode, ViewPortType } from "@/types/index.ts";
import { HelpCircle, SettingsIcon } from "@/ui/icons";
import { ContainerWithTooltip } from "@/ui/index.ts";
import { cn } from "@/utils/index.ts";
import * as Tabs from "@radix-ui/react-tabs";
import * as ToggleGroup from "@radix-ui/react-toggle-group";
import { LucideIcon, Monitor, Pen, Smartphone } from "lucide-react";
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

const channelOptions: { label: string; value: PreviewMode }[] = [
    { label: "web or mobile SDK", value: "sdk" },
    { label: "email or sharable link survey", value: "link" },
];

const viewPortOptions: { icon: LucideIcon; value: ViewPortType }[] = [
    {
        icon: Smartphone,
        value: "mobile",
    },
    {
        icon: Monitor,
        value: "desktop",
    },
];

export default function Create() {
    const { previewMode, previewViewport, updateStudio, showStudioOverlay, setShowStudioOverlay } = useStudioStore();

    return (
        <Tabs.Root className="flex h-screen pt-[84px]" defaultValue={tabs[0].label}>
            {/* sidebar */}
            <Tabs.List className="flex h-full flex-col gap-6 border-r border-intg-bg-4 px-[18px] pt-12">
                {tabs.map(({ id, label, icon }) => (
                    <Tabs.Trigger
                        value={label}
                        key={id}
                        className="data-[state=active]:rounded-md data-[state=active]:bg-[#272138]"
                        asChild
                    >
                        <div>
                            <ContainerWithTooltip text={label} side="right">
                                <div className="flex h-9 items-center justify-center rounded px-2 ease-in-out hover:bg-intg-bg-15 hover:transition-all">
                                    {icon}
                                </div>
                            </ContainerWithTooltip>
                        </div>
                    </Tabs.Trigger>
                ))}
            </Tabs.List>

            <div className="flex max-h-[calc(100vh-110px)] flex-1 gap-[38px] pl-5 pr-12 pt-6">
                {/* editor panel */}
                <ScrollToBottom
                    mode="top"
                    scrollViewClassName="scrollbar-hide overflow-y-auto max-h-[calc(100vh-110px)] h-full"
                    className="max-h-[calc(100vh-110px)] w-[519px] pb-8"
                >
                    {tabs.map(({ content, label, id }) => (
                        <Tabs.Content key={id} value={label}>
                            {content}
                        </Tabs.Content>
                    ))}
                </ScrollToBottom>

                {/* preview panel */}
                <div className={cn("relative flex min-w-[580px] flex-1 flex-col gap-1 rounded-xl bg-intg-bg-9")}>
                    <ToggleGroup.Root
                        className="flex gap-4 pl-4 pt-2"
                        type="single"
                        value={previewMode}
                        onValueChange={(value) => {
                            if (value) {
                                updateStudio({ previewMode: value as PreviewMode });
                            }
                        }}
                        aria-label="Survey channel"
                    >
                        {channelOptions.map((opt) => (
                            <ToggleGroup.Item
                                value={opt.value}
                                aria-label={opt.label}
                                className={cn(
                                    "border-b border-transparent p-2 text-sm capitalize text-intg-text data-[state=on]:border-[#6941C6] data-[state=on]:text-white",
                                )}
                                key={opt.value}
                            >
                                {opt.label}
                            </ToggleGroup.Item>
                        ))}
                    </ToggleGroup.Root>
                    <div
                        className={cn(
                            previewViewport === "mobile"
                                ? "m-auto h-full max-h-[730px] w-full max-w-[360px] rounded-3xl bg-[#E5EAF2] px-[18px] py-[15px]"
                                : "h-full w-full",
                        )}
                    >
                        <Preview mode={previewMode} viewPort={previewViewport} />
                    </div>
                    <ToggleGroup.Root
                        className="absolute bottom-5 left-1/2 flex -translate-x-1/2 rounded-[4px] bg-intg-bg-14 p-0.5"
                        type="single"
                        value={previewViewport}
                        onValueChange={(value) => {
                            if (value) {
                                updateStudio({ previewViewport: value as ViewPortType });
                            }
                        }}
                        aria-label="Survey channel"
                    >
                        {viewPortOptions.map(({ value, icon: Icon }) => (
                            <ToggleGroup.Item
                                value={value}
                                aria-label={value}
                                className="rounded-sm p-2 px-2 py-1 text-intg-text data-[state=on]:bg-[#41365E] data-[state=on]:text-white"
                                key={value}
                            >
                                <Icon size={20} />
                            </ToggleGroup.Item>
                        ))}
                    </ToggleGroup.Root>

                    {showStudioOverlay && (
                        <div
                            className="absolute h-full w-full bg-transparent"
                            onClick={() => setShowStudioOverlay(!showStudioOverlay)}
                        ></div>
                    )}
                </div>
            </div>
        </Tabs.Root>
    );
}
