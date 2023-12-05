import { Header } from "@/ui";
import { CheckComplete, CheckPending } from "@/ui/icons";
import * as Tabs from "@radix-ui/react-tabs";
import { onboardingSteps, useOnboarding } from "../states/onboarding";
import ConnectIntegration from "./ConnectIntegration";
import CreaateFirstSurvey from "./CreaateFirstSurvey";
import IntegrateIndex from "./IntegrateSDK/IntegrateIndex";

export default function OnboardingIndex() {
    const { status } = useOnboarding();

    return (
        <section className="px-[72px] pt-20">
            <Header
                title="Getting started"
                description="Integraflow enables you to understand your customers  To get started, we'll need to integrate your SDK product."
                className="max-w-[386px]"
            />

            <Tabs.Root
                className="flex gap-12 pt-10"
                defaultValue={onboardingSteps[0]}
            >
                <Tabs.List className="flex flex-col gap-2 pt-[25px]">
                    {onboardingSteps.map((key) => (
                        <Tabs.Trigger
                            key={key}
                            value={key}
                            className="flex items-center gap-3 rounded-lg p-6 hover:bg-intg-bg-9 data-[state=active]:bg-intg-bg-9"
                        >
                            {status[key].completed ? (
                                <CheckComplete />
                            ) : (
                                <CheckPending />
                            )}
                            <span className="min-w-max text-base text-intg-text">
                                {status[key].name}
                            </span>
                        </Tabs.Trigger>
                    ))}
                </Tabs.List>

                <Tabs.Content value={onboardingSteps[0]} asChild>
                    <IntegrateIndex />
                </Tabs.Content>

                <Tabs.Content value={onboardingSteps[1]} asChild>
                    <IntegrateIndex />
                </Tabs.Content>

                <Tabs.Content value={onboardingSteps[2]} asChild>
                    <IntegrateIndex />
                </Tabs.Content>

                <Tabs.Content value={onboardingSteps[3]} asChild>
                    <CreaateFirstSurvey />
                </Tabs.Content>

                <Tabs.Content value={onboardingSteps[4]} asChild>
                    <ConnectIntegration />
                </Tabs.Content>
            </Tabs.Root>
        </section>
    );
}
