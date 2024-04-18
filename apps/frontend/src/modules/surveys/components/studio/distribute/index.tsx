import { ChannelProvider } from "@/modules/surveys/contexts/ChannelProvider";
import * as Tabs from "@radix-ui/react-tabs";
import { Blocks, Globe, LinkIcon, Mail, MessageCircle, TabletSmartphone, WifiOff } from "lucide-react";
import SharableLinks from "./sharable-links";
import WebSDK from "./web-sdk";

const tabs = [
    {
        id: crypto.randomUUID(),
        name: "Shareable Links",
        content: <SharableLinks />,
        icon: LinkIcon,
    },
    {
        id: crypto.randomUUID(),
        name: "Web SDK",
        content: <WebSDK />,
        icon: Globe,
    },
    {
        id: crypto.randomUUID(),
        name: "Email (coming soon)",
        content: <div className="text-white">Hello</div>,
        icon: Mail,
    },
    {
        id: crypto.randomUUID(),
        name: "Mobile SDK (coming soon)",
        content: <div className="text-white">Hello</div>,
        icon: TabletSmartphone,
    },
    {
        id: crypto.randomUUID(),
        name: "SMS (coming soon)",
        content: <div className="text-white">Hello</div>,
        icon: MessageCircle,
    },
    {
        id: crypto.randomUUID(),
        name: "Offline apps (coming soon)",
        content: <div className="text-white">Hello</div>,
        icon: WifiOff,
    },
    {
        id: crypto.randomUUID(),
        name: "Integration (coming soon)",
        content: <div className="text-white">Hello</div>,
        icon: Blocks,
    },
];

export default function Distribute() {
    return (
        <ChannelProvider>
            <Tabs.Root className="flex w-full gap-12 pl-10 pr-[45px]" defaultValue={tabs[0].id}>
                <div className="w-[386px] pt-[155px]">
                    <Tabs.List className="flex max-w-[302px] flex-col gap-2 pt-[25px]">
                        {tabs.map(({ id, icon: Icon, name }) => (
                            <Tabs.Trigger
                                key={id}
                                value={id}
                                className="flex items-center gap-3 rounded-lg p-6 text-intg-text hover:bg-intg-bg-9 data-[state=active]:bg-intg-bg-9"
                            >
                                <Icon />
                                <span className="min-w-max text-base">{name}</span>
                            </Tabs.Trigger>
                        ))}
                    </Tabs.List>
                </div>

                <>
                    {tabs.map((tab) => {
                        return (
                            <Tabs.Content
                                key={tab.id}
                                value={tab.id}
                                className="scrollbar-hide h-screen flex-1 overflow-y-scroll pb-[27px] pt-[155px]"
                            >
                                {tab.content}
                            </Tabs.Content>
                        );
                    })}
                </>
            </Tabs.Root>
        </ChannelProvider>
    );
}
