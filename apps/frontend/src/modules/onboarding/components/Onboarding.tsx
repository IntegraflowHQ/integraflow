import * as Tabs from "@radix-ui/react-tabs";
import { useCallback } from "react";

import { GlobalSpinner, Header } from "@/ui";
import { CheckComplete, CheckPending } from "@/ui/icons";

import { useOnboarding } from "../hooks/useOnboarding";
import ConnectIntegration from "./ConnectIntegration";
import CreateFirstSurvey from "./CreateFirstSurvey";
import IntegrateSDK from "./integrate-sdk/IntegrateSDK";

export const TabContents = [
    { content: IntegrateSDK },
    { content: IntegrateSDK },
    { content: IntegrateSDK },
    { content: CreateFirstSurvey },
    { content: ConnectIntegration },
];

export default function Onboarding() {
    const { currentTab, switchTab, markAsCompleted, steps, loading, completedKeys } = useOnboarding();

    const onCompleted = useCallback(
        (index: number) => {
            markAsCompleted(index);
            if (index < steps.length - 1) {
                switchTab(steps[index + 1].name);
            }
        },
        [markAsCompleted, steps, switchTab],
    );

    if (loading) {
        return <GlobalSpinner />;
    }

    return (
        <section className="px-[72px] pb-20 pt-20">
            <Header
                title="Getting started"
                description="Integraflow enables you to understand your customers  To get started, we'll need to integrate your SDK product."
                className="max-w-[386px]"
            />

            <Tabs.Root
                className="flex gap-12 pt-10"
                defaultValue={steps[0].name}
                value={currentTab}
                onValueChange={switchTab}
            >
                <Tabs.List className="flex flex-col gap-2 pt-[25px]">
                    {steps.map((step) => (
                        <Tabs.Trigger
                            key={step.name}
                            value={step.name}
                            className="flex items-center gap-3 rounded-lg p-6 hover:bg-intg-bg-9 data-[state=active]:bg-intg-bg-9"
                        >
                            {completedKeys.includes(step.key) ? <CheckComplete /> : <CheckPending />}
                            <span className="min-w-max text-base text-intg-text">{step.name}</span>
                        </Tabs.Trigger>
                    ))}
                </Tabs.List>

                {steps.map((step, index) => {
                    const Content = TabContents[index].content;
                    return (
                        <Tabs.Content key={step.name} value={step.name} asChild>
                            <div className="min-w-[660px]">
                                <Content onSkip={() => onCompleted(index)} onComplete={() => onCompleted(index)} />
                            </div>
                        </Tabs.Content>
                    );
                })}
            </Tabs.Root>
        </section>
    );
}
