import { Button, GlobalSpinner } from "@/ui";
import * as Tabs from "@radix-ui/react-tabs";
import { XIcon } from "lucide-react";
import { useEffect, useState } from "react";
import useStudioState from "../hooks/useStudioState";
import { useSurvey } from "../hooks/useSurvey";
import Analyze from "./studio/analyze";
import Create from "./studio/create";
import Distribute from "./studio/distribute";

const tabs = [
    { label: "Create", screen: Create },
    {
        label: "Distribute",
        screen: Distribute,
    },
    { label: "Analyze", screen: Analyze },
];

export default function Studio() {
    const [title, setTitle] = useState("");
    const { enableStudioMode, disableStudioMode } = useStudioState();
    const [activeTab, setActiveTab] = useState(tabs[0].label);
    const { loading } = useSurvey();

    useEffect(() => {
        enableStudioMode();

        return () => {
            disableStudioMode();
        };
    }, []);

    if (loading) return <GlobalSpinner />;

    return (
        <Tabs.Root
            className="h-full w-full"
            value={activeTab}
            onValueChange={setActiveTab}
        >
            <header className="fixed z-10 flex w-full items-center justify-between border-b border-intg-bg-4 bg-[#090713] py-[22px] pl-10 pr-12">
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
                            className={`rounded-md px-3 py-2 text-sm text-intg-text transition-all ease-in hover:bg-[#272138] data-[state=active]:bg-[#272138] data-[state=active]:text-white`}
                        >
                            {tab.label}
                        </Tabs.Trigger>
                    ))}
                </Tabs.List>

                <div className="flex gap-[35px]">
                    <Button
                        className="px-[16px] py-[8px]"
                        text={activeTab === tabs[1].label ? "Publish" : "Next"}
                        onClick={() => {
                            if (activeTab === tabs[1].label) {
                                // TODO publishSurvey();
                            } else {
                                setActiveTab(tabs[1].label);
                            }
                        }}
                    />
                    <button>
                        <XIcon color="#AFAAC7" />
                    </button>
                </div>
            </header>

            {tabs.map(({ screen: Screen, label }) => (
                <Tabs.Content key={label} value={label}>
                    <Screen />
                </Tabs.Content>
            ))}
        </Tabs.Root>
    );
}
