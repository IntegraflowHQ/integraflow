import { SurveyQuestion, SurveyQuestionTypeEnum } from "@/generated/graphql";
import { useQuestion } from "@/modules/surveys/hooks/useQuestion";
import { Popover, PopoverContent, PopoverTrigger } from "@/ui/Popover";
import * as Tabs from "@radix-ui/react-tabs";
import { MoreHorizontalIcon, XIcon } from "lucide-react";
import { EditTab } from "./EditTab";
import { LogicTab } from "./LogicTab";
import { SettingsTab } from "./SettingsTab";

import * as Accordion from "@radix-ui/react-accordion";

type Props = {
    question: SurveyQuestion;
    currentQuestionType: SurveyQuestionTypeEnum | undefined;
    questionIndex: number;
};

export const QuestionPanel = ({ question, questionIndex }: Props) => {
    const { deleteQuestionMutation, openQuestion, setOpenQuestion } =
        useQuestion();

    return (
        <Tabs.Root
            orientation="horizontal"
            className="space-y-6 rounded-lg bg-intg-bg-9 p-6 text-intg-text"
            defaultValue="edit"
        >
            <div className="flex items-center justify-between border-b-[1px] border-intg-bg-4 ">
                <Tabs.List className="space-x-4">
                    <Tabs.Trigger
                        key="edit"
                        value="edit"
                        className="p-2  data-[state=active]:border-b-[2px] data-[state=active]:border-b-intg-bg-4 data-[state=active]:text-white "
                    >
                        Edit
                    </Tabs.Trigger>
                    {Object.keys(question.settings).length === 0 ? null : (
                        <Tabs.Trigger
                            key="logic"
                            value="logic"
                            className="p-2  data-[state=active]:border-b-[2px] data-[state=active]:border-b-intg-bg-4 data-[state=active]:text-white "
                        >
                            Logic
                        </Tabs.Trigger>
                    )}
                    {Object.keys(question.settings).length === 0 ? null : (
                        <Tabs.Trigger
                            key="settings"
                            value="settings"
                            className="p-2  data-[state=active]:border-b-[2px] data-[state=active]:border-b-intg-bg-4 data-[state=active]:text-white "
                        >
                            Settings
                        </Tabs.Trigger>
                    )}
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
                    <Accordion.Trigger value={question?.id}>
                        <XIcon className="cursor-pointer" />
                    </Accordion.Trigger>
                </div>
            </div>

            <div>
                <div>
                    <Tabs.Content
                        value="edit"
                        className="flex-1 pt-2"
                        key="edit"
                    >
                        <EditTab
                            question={question}
                            questionIndex={questionIndex}
                        />
                    </Tabs.Content>
                    {Object.keys(question.settings).length === 0 ? null : (
                        <Tabs.Content
                            value="logic"
                            className="flex-1 pt-2"
                            key="logic"
                        >
                            <LogicTab
                                question={question}
                                questionIndex={questionIndex}
                            />
                        </Tabs.Content>
                    )}
                    {Object.keys(question.settings).length === 0 ? null : (
                        <Tabs.Content
                            value="settings"
                            className="flex-1 pt-2"
                            key="settings"
                        >
                            <SettingsTab
                                question={question}
                                questionIndex={questionIndex}
                            />
                        </Tabs.Content>
                    )}
                </div>
            </div>
        </Tabs.Root>
    );
};
