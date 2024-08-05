import { SurveyChannelTypeEnum } from "@/generated/graphql";
import useChannels from "@/modules/surveys/hooks/useChannels";
import { LogicOperator, ParsedChannel } from "@/types";
import * as Accordion from "@radix-ui/react-accordion";
import { ChevronRight } from "lucide-react";
import Audience from "./Audience";
import Behavior from "./Behavior";
import Publish from "./Publish";
import Triggers from "./Triggers";

const sections = [
    {
        id: crypto.randomUUID(),
        name: "Behavior",
        content: Behavior,
    },
    {
        id: crypto.randomUUID(),
        name: "Triggers",
        content: Triggers,
    },
    {
        id: crypto.randomUUID(),
        name: "Target Audience",
        content: Audience,
    },
    {
        id: crypto.randomUUID(),
        name: "Publish",
        content: Publish,
    },
];

const defaultChannel: ParsedChannel = {
    id: "",
    link: "",
    type: SurveyChannelTypeEnum.WebSdk,
    createdAt: "",
    settings: {
        placement: "bottomRight",
        backgroundOverlay: "light",
    },
    triggers: {
        conditions: [],
        delay: 0,
    },
    conditions: {
        operator: LogicOperator.AND,
        filters: [],
    },
};

export default function Settings() {
    const { getChannels } = useChannels();
    const channel = getChannels(SurveyChannelTypeEnum.WebSdk)[0] ?? defaultChannel;

    return (
        <Accordion.Root defaultValue={sections[0].id as string} type="single" className="flex flex-col gap-3">
            {sections.map(({ name, id, content: Content }) => (
                <Accordion.Item key={`${channel.id}-${name}`} value={id} className="rounded-lg bg-intg-bg-15">
                    <Accordion.Header>
                        <Accordion.Trigger className="group flex w-full justify-between px-4 py-3 text-left text-sm text-intg-text">
                            <span>{name}</span>
                            <ChevronRight className="transition-transform duration-300 ease-[cubic-bezier(0.87,_0,_0.13,_1)] group-data-[state=open]:rotate-90" />
                        </Accordion.Trigger>
                    </Accordion.Header>

                    <Accordion.Content>
                        <Content channel={channel} />
                    </Accordion.Content>
                </Accordion.Item>
            ))}
        </Accordion.Root>
    );
}
