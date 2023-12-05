import { Header } from "@/ui";
import { CheckComplete, CheckPending } from "@/ui/icons";
import * as Tabs from "@radix-ui/react-tabs";
import {
    OnboardingStepKey,
    onboardingSteps,
    useOnboarding,
} from "../states/onboarding";
import ConnectIntegration from "./ConnectIntegration";
import CreateFirstSurvey from "./CreateFirstSurvey";
import IntegrateSDK from "./IntegrateSDK/IntegrateSDK";

const status = {
    integrateSdk: {
        name: "Integrate SDK",
        completed: false,
    },
    identifyUsers: {
        name: "Identify your users",
        completed: false,
    },
    trackEvents: {
        name: "Track your events",
        completed: false,
    },
    publishFirstSurvey: {
        name: "Publish your first survey",
        completed: false,
    },
    connectIntegration: {
        name: "Connect your first integration",
        completed: false,
    },
};

export default function OnboardingIndex() {
    const { status, currentTab, switchTab, complete } = useOnboarding();

    const tabContents = [
        { content: IntegrateSDK },
        { content: IntegrateSDK },
        { content: IntegrateSDK },
        { content: CreateFirstSurvey },
        { content: ConnectIntegration },
    ];

    return (
        <section className="px-[72px] pt-20">
            <Header
                title="Getting started"
                description="Integraflow enables you to understand your customers  To get started, we'll need to integrate your SDK product."
                className="max-w-[386px]"
            />

            <Tabs.Root
                className="flex gap-12 pt-10"
                value={currentTab}
                onValueChange={(value) => switchTab(value as OnboardingStepKey)}
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

                {onboardingSteps.map((key, index) => {
                    const Content = tabContents[index].content;
                    return (
                        <Tabs.Content value={onboardingSteps[index]} asChild>
                            <Content
                                onSkip={
                                    index < onboardingSteps.length - 1
                                        ? () => {
                                              console.log("skip");
                                              console.log(
                                                  onboardingSteps[index + 1],
                                              );
                                              complete(key);
                                              switchTab(
                                                  onboardingSteps[index + 1],
                                              );
                                          }
                                        : () => {
                                              complete(key);
                                          }
                                }
                                onComplete={() => {
                                    complete(key);
                                    if (index < onboardingSteps.length - 1) {
                                        switchTab(onboardingSteps[index + 1]);
                                    }
                                }}
                            />
                        </Tabs.Content>
                    );
                })}
            </Tabs.Root>
        </section>
    );
}
