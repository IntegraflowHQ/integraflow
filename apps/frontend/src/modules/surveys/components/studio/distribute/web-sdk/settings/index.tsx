import * as Accordion from "@radix-ui/react-accordion";

const sections = [
    {
        id: crypto.randomUUID(),
        name: "Behavior",
        content: <div className="text-white">Behavior</div>,
    },
    {
        id: crypto.randomUUID(),
        name: "Triggers",
        content: <div className="text-white">Triggers</div>,
    },
    {
        id: crypto.randomUUID(),
        name: "Audience",
        content: <div className="text-white">Audience</div>,
    },
];

export default function Settings() {
    return (
        <Accordion.Root defaultValue={sections[0].id as string} type="single">
            {sections.map((section) => (
                <Accordion.Item key={section.id} value={section.id}>
                    <Accordion.Header>
                        <Accordion.Trigger>{section.name}</Accordion.Trigger>
                    </Accordion.Header>
                    <Accordion.Content>{section.content}</Accordion.Content>
                </Accordion.Item>
            ))}
        </Accordion.Root>
    );
}
