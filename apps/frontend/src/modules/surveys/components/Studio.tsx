import { Button } from "@/ui";
import * as Tabs from "@radix-ui/react-tabs";
import { XIcon } from "lucide-react";
import { useEffect, useState } from "react";
import useStudioState from "../hooks/useStudioState";
import Analyze from "./Analyze";
import Configure from "./Configure";
import Create from "./Create";
import Publish from "./Publish";

const tabs = [
    { label: "Create", screen: Create },
    { label: "Configure", screen: Configure },
    { label: "Publish", screen: Publish },
    { label: "Analyze", screen: Analyze },
];

export default function Studio() {
    const { enableStudioMode, disableStudioMode } = useStudioState();
    const [title, setTitle] = useState("");
    useEffect(() => {
        enableStudioMode();

        return () => {
            disableStudioMode();
        };
    }, []);

    return (
        <Tabs.Root className="h-full w-full" defaultValue={tabs[0].label}>
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
                            key={tab.label}
                            value={tab.label}
                            className="px-2 py-1 text-sm text-intg-text data-[state=active]:text-white"
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

            {tabs.map(({ screen: Screen }) => (
                <Tabs.Content key={Screen.name} value={Screen.name} asChild>
                    <Screen />
                </Tabs.Content>
            ))}
        </Tabs.Root>
    );
}
