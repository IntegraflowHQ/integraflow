import { SurveyQuestion, SurveyQuestionTypeEnum } from "@/generated/graphql";
import { useSurveyStore } from "@/modules/surveys/states/survey";
import * as Tabs from "@radix-ui/react-tabs";
import { MoreHorizontalIcon, XIcon } from "lucide-react";
import { EditTab } from "./EditTab";
import { LogicTab } from "./LogicTab";
import { SettingsTab } from "./SettingsTab";

type Props = {
    currentQuestionType: SurveyQuestionTypeEnum | undefined;
    question: SurveyQuestion;
};

export const QuestionPanel = ({ question }: Props) => {
    const { setOpenQuestion } = useSurveyStore();

    const tabs = [
        {
            id: 1,
            label: "Edit",
            content: <EditTab question={question} />,
        },
        {
            id: 2,
            label: "Logic",
            content: <LogicTab question={question} />,
        },
        {
            id: 3,
            label: "Settings",
            content: <SettingsTab question={question} />,
        },
    ];

    return (
        <Tabs.Root
            orientation="horizontal"
            className="space-y-6 rounded-lg bg-intg-bg-9 p-6 text-intg-text"
            defaultValue={tabs[0].label}
        >
            <div className="flex items-center justify-between border-b-[1px] border-intg-bg-4 ">
                <Tabs.List className="space-x-4">
                    {tabs.map((tab) => (
                        <Tabs.Trigger
                            key={tab.id}
                            value={tab.label}
                            className="p-2  data-[state=active]:border-b-[2px] data-[state=active]:border-b-intg-bg-4 data-[state=active]:text-white "
                        >
                            {tab.label}
                        </Tabs.Trigger>
                    ))}
                </Tabs.List>
                <div className="flex gap-6">
                    <MoreHorizontalIcon />
                    <XIcon onClick={() => setOpenQuestion("")} />
                </div>
            </div>

            <div>
                {tabs.map(({ content, label }) => (
                    <div key={label}>
                        <Tabs.Content
                            value={label}
                            className="flex-1 pt-2"
                            key={label}
                        >
                            {content}
                        </Tabs.Content>
                    </div>
                ))}
            </div>
        </Tabs.Root>
    );
};
