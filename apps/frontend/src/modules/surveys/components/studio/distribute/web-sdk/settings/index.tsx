import * as Accordion from "@radix-ui/react-accordion";
import { ChevronRight } from "lucide-react";
import Behavior from "./Behavior";
import Triggers from "./Triggers";

const sections = [
    {
        id: crypto.randomUUID(),
        name: "Behavior",
        content: <Behavior />,
    },
    {
        id: crypto.randomUUID(),
        name: "Triggers",
        content: <Triggers />,
    },
    {
        id: crypto.randomUUID(),
        name: "Audience",
        content: <div className="text-white">Audience</div>,
    },
];

export default function Settings() {
    return (
        <Accordion.Root
            defaultValue={sections[0].id as string}
            type="single"
            className="flex flex-col gap-3"
        >
            {sections.map((section) => (
                <Accordion.Item
                    key={section.id}
                    value={section.id}
                    className="rounded-lg bg-intg-bg-15"
                >
                    <Accordion.Header>
                        <Accordion.Trigger className="group flex w-full justify-between px-4 py-3 text-left text-sm text-intg-text">
                            <span>{section.name}</span>
                            <ChevronRight className="transition-transform duration-300 ease-[cubic-bezier(0.87,_0,_0.13,_1)] group-data-[state=open]:rotate-90" />
                        </Accordion.Trigger>
                    </Accordion.Header>
                    <Accordion.Content>{section.content}</Accordion.Content>
                </Accordion.Item>
            ))}
        </Accordion.Root>
    );
}
