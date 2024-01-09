import { SurveyQuestion, SurveyQuestionTypeEnum } from "@/generated/graphql";
import { useQuestion } from "@/modules/surveys/hooks/useQuestion";
import { Popover, PopoverContent, PopoverTrigger } from "@/ui/Popover";
import * as Tabs from "@radix-ui/react-tabs";
import { MoreHorizontalIcon, XIcon } from "lucide-react";
import { EditTab } from "./EditTab";
import { SettingsTab } from "./SettingsTab";

type Props = {
    question: SurveyQuestion;
    currentQuestionType: SurveyQuestionTypeEnum | undefined;
    setOpenAccordion: (values: string) => void;
};

export const QuestionPanel = ({ question, setOpenAccordion }: Props) => {
    const tabs = [
        {
            id: 1,
            label: "Edit",
            content: <EditTab question={question} />,
        },
        // {
        //     id: 2,
        //     label: "Logic",
        //     content: <LogicTab question={question} />,
        // },
        {
            id: 3,
            label: "Settings",
            content: <SettingsTab question={question} />,
        },
    ];

    const { deleteQuestionMutation, openQuestion } = useQuestion();

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
                    <Popover>
                        <PopoverTrigger>
                            <MoreHorizontalIcon />
                        </PopoverTrigger>
                        <PopoverContent className=" w-fit border text-intg-text">
                            <div className="flex flex-col gap-2">
                                <p className="cursor-pointer text-sm">
                                    Duplicate
                                </p>
                                <p
                                    className="cursor-pointer text-sm"
                                    onClick={() =>
                                        deleteQuestionMutation(
                                            openQuestion as SurveyQuestion,
                                        )
                                    }
                                >
                                    Delete
                                </p>
                            </div>
                        </PopoverContent>
                    </Popover>
                    <XIcon
                        onClick={() => {
                            setOpenAccordion("");
                        }}
                    />
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
