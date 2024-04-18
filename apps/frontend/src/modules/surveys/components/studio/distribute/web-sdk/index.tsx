import IntegrateWeb from "@/modules/onboarding/components/integrate-sdk/IntegrateWeb";
import { Header } from "@/ui";
import * as Tabs from "@radix-ui/react-tabs";
import Settings from "./settings";

const tabs = [
    {
        id: crypto.randomUUID(),
        name: "Settings",
        content: <Settings />,
    },
    {
        id: crypto.randomUUID(),
        name: "Install",
        content: <IntegrateWeb />,
    },
];

export default function WebSDK() {
    return (
        <Tabs.Root
            defaultValue={tabs[0].id}
            className="flex min-h-full w-full min-w-[660px] flex-col gap-6 rounded-xl bg-intg-bg-9 p-6"
        >
            <Tabs.List className="flex gap-4">
                {tabs.map((tab) => (
                    <Tabs.Trigger
                        key={tab.id}
                        value={tab.id}
                        className="border-b-2 border-transparent p-2 text-sm text-intg-text hover:border-intg-bg-2 hover:text-white data-[state=active]:border-intg-bg-2 data-[state=active]:text-white"
                    >
                        {tab.name}
                    </Tabs.Trigger>
                ))}
            </Tabs.List>

            {tabs.map((tab) => (
                <Tabs.Content key={tab.id} value={tab.id}>
                    <Header
                        title="Web SDK"
                        description="Add Feedback Button or launch surveys based on events and actions on website, in-product and in web app."
                        className="max-w-[417px] pb-[25px]"
                    />
                    {tab.content}
                </Tabs.Content>
            ))}
        </Tabs.Root>
    );
}
