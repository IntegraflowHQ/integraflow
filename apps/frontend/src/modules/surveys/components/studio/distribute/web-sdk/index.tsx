import { SurveyStatusEnum } from "@/generated/graphql";
import IntegrateWeb from "@/modules/onboarding/components/integrate-sdk/IntegrateWeb";
import { useSurvey } from "@/modules/surveys/hooks/useSurvey";
import { Announce, Header } from "@/ui";
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
    const { survey } = useSurvey();

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
                    <div className="flex items-center gap-2">
                        <h3 className="text-[24px] font-semibold leading-9 text-white">Web SDK </h3>
                        {survey?.status !== SurveyStatusEnum.Active ? (
                            <div className="self-start">
                                <Announce variant="green" text="This survey is Unpublished" key={crypto.randomUUID()} />
                            </div>
                        ) : null}
                    </div>{" "}
                    <Header
                        title=""
                        description="Add Feedback Button or launch surveys based on events and actions on website, in-product and in web app."
                        className="max-w-[417px] pb-[25px]"
                    />
                    {tab.content}
                </Tabs.Content>
            ))}
        </Tabs.Root>
    );
}
