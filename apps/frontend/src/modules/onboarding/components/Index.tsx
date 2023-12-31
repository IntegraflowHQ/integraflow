import { useCompleteOnboardingStageMutation } from "@/generated/graphql";
import { useProject } from "@/modules/projects/hooks/useProject";
import useWorkspaceState from "@/modules/workspace/hooks/useWorkspaceState";
import { GlobalSpinner, Header } from "@/ui";
import { CheckComplete, CheckPending } from "@/ui/icons";
import * as Tabs from "@radix-ui/react-tabs";
import { useMemo } from "react";
import { useOnboarding } from "../hooks/useOnboarding";
import ConnectIntegration from "./ConnectIntegration";
import CreateFirstSurvey from "./CreateFirstSurvey";
import IntegrateSDK from "./integrate-sdk/Index";

export const tabContents = [
    { content: IntegrateSDK },
    { content: IntegrateSDK },
    { content: IntegrateSDK },
    { content: CreateFirstSurvey },
    { content: ConnectIntegration },
];

export default function OnboardingIndex() {
    const { workspace } = useWorkspaceState();
    const { upsertProject } = useProject();
    const { currentTab, switchTab, steps, updatingUser } = useOnboarding();
    const [completeStage] = useCompleteOnboardingStageMutation();

    const completedKeys = useMemo(() => {
        if (!workspace?.project.hasCompletedOnboardingFor) {
            return [];
        }

        return JSON.parse(
            workspace?.project.hasCompletedOnboardingFor,
        ) as string[];
    }, [workspace?.project.hasCompletedOnboardingFor]);

    const markAsCompleted = async (index: number) => {
        if (!workspace) return;
        const updatedKeys = [...completedKeys];
        if (updatedKeys.includes(steps[index].key)) {
            return;
        }
        updatedKeys.push(steps[index].key);

        upsertProject({
            ...workspace.project,
            hasCompletedOnboardingFor: JSON.stringify(updatedKeys),
        });

        completeStage({
            variables: {
                input: {
                    hasCompletedOnboardingFor: JSON.stringify(updatedKeys),
                },
            },
            context: {
                headers: {
                    Project: workspace?.project.id,
                },
            },
        });
    };

    if (updatingUser) return <GlobalSpinner />;

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
                onValueChange={(value) => switchTab(value)}
            >
                <Tabs.List className="flex flex-col gap-2 pt-[25px]">
                    {steps.map((step) => (
                        <Tabs.Trigger
                            key={step.name}
                            value={step.name}
                            className="flex items-center gap-3 rounded-lg p-6 hover:bg-intg-bg-9 data-[state=active]:bg-intg-bg-9"
                        >
                            {completedKeys.includes(step.key) ? (
                                <CheckComplete />
                            ) : (
                                <CheckPending />
                            )}
                            <span className="min-w-max text-base text-intg-text">
                                {step.name}
                            </span>
                        </Tabs.Trigger>
                    ))}
                </Tabs.List>

                {steps.map((step, index) => {
                    const Content = tabContents[index].content;
                    return (
                        <Tabs.Content key={step.name} value={step.name} asChild>
                            <div className="min-w-[660px]">
                                <Content
                                    onSkip={
                                        index < steps.length - 1
                                            ? () => {
                                                  markAsCompleted(index);
                                                  switchTab(
                                                      steps[index + 1].name,
                                                  );
                                              }
                                            : () => {
                                                  markAsCompleted(index);
                                              }
                                    }
                                    onComplete={() => {
                                        markAsCompleted(index);
                                        if (index < steps.length - 1) {
                                            switchTab(steps[index + 1].name);
                                        }
                                    }}
                                />
                            </div>
                        </Tabs.Content>
                    );
                })}
            </Tabs.Root>
        </section>
    );
}
