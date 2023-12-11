import { Button } from "@/ui";
import * as Tabs from "@radix-ui/react-tabs";
import { XIcon } from "lucide-react";
import { useEffect, useState } from "react";
import useStudioState from "../hooks/useStudioState";
import Analyze from "./studio/analyze";
import Configure from "./studio/configure";
import Create from "./studio/create";

const tabs = [
    { id: crypto.randomUUID(), label: "Create", screen: Create },
    {
        id: crypto.randomUUID(),
        label: "Configure/Distribute",
        screen: Configure,
    },
    { id: crypto.randomUUID(), label: "Analyze", screen: Analyze },
];

export default function Studio() {
    const [title, setTitle] = useState("");

    const { enableStudioMode, disableStudioMode } = useStudioState();

    useEffect(() => {
        enableStudioMode();

        return () => {
            disableStudioMode();
        };
    }, []);

    return (
        <Tabs.Root className="h-full w-full" defaultValue={tabs[0].id}>
            <header className="fixed flex w-full items-center justify-between border-b border-intg-bg-4 py-[22px] pl-10 pr-12">
                <input
                    type="text"
                    name="title"
                    id="title"
                    placeholder="Enter Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-[96px] bg-transparent px-2 py-1 text-sm text-white"
                />

                <Tabs.List className="flex gap-[15px]">
                    {tabs.map((tab) => (
                        <Tabs.Trigger
                            key={tab.id}
                            value={tab.id}
                            className={`rounded-md px-3 py-2 text-sm text-intg-text transition-all ease-in hover:bg-[#272138] data-[state=active]:bg-[#272138] data-[state=active]:text-white`}
                        >
                            {tab.label}
                        </Tabs.Trigger>
                    ))}
                </Tabs.List>

                <div className="flex gap-[35px]">
                    <Button text="Next" className="px-[16px] py-[8px]" />
                    <button>
                        <XIcon color="#AFAAC7" />
                    </button>
                </div>
            </header>

            {tabs.map(({ screen: Screen, id }) => (
                <Tabs.Content key={id} value={id}>
                    <Screen />
                </Tabs.Content>
            ))}
        </Tabs.Root>
    );
}
