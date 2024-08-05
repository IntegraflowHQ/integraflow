import { SurveyQuestionTypeEnum, SurveyStatusEnum } from "@/generated/graphql";
import { useQuestion } from "@/modules/surveys/hooks/useQuestion";
import * as Tabs from "@radix-ui/react-tabs";
import { Trash2, XIcon } from "lucide-react";
import { EditTab } from "./EditTab";
import { LogicTab } from "./LogicTab";
import { SettingsTab } from "./SettingsTab";

import { useSurvey } from "@/modules/surveys/hooks/useSurvey";
import { questionsWithoutSettingsTab } from "@/utils/question";

type Props = {
    questionIndex: number;
};

export const QuestionPanel = ({ questionIndex }: Props) => {
    const { question, clear, deleteQuestion } = useQuestion();
    const { parsedQuestions, survey } = useSurvey();
    const lastQuestionIndex = parsedQuestions.length - 1;

    if (!question) {
        return null;
    }

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
                        className="p-2 data-[state=active]:border-b-[2px] data-[state=active]:border-b-intg-bg-4 data-[state=active]:text-white "
                    >
                        Edit
                    </Tabs.Trigger>

                    {questionIndex === lastQuestionIndex || question.type === SurveyQuestionTypeEnum.Cta ? null : (
                        <>
                            <Tabs.Trigger
                                key="logic"
                                value="logic"
                                className="p-2  data-[state=active]:border-b-[2px] data-[state=active]:border-b-intg-bg-4 data-[state=active]:text-white "
                            >
                                Logic
                            </Tabs.Trigger>
                        </>
                    )}

                    {questionsWithoutSettingsTab.includes(question.type) ? null : (
                        <>
                            <Tabs.Trigger
                                key="settings"
                                value="settings"
                                className="p-2  data-[state=active]:border-b-[2px] data-[state=active]:border-b-intg-bg-4 data-[state=active]:text-white "
                            >
                                Settings
                            </Tabs.Trigger>
                        </>
                    )}
                </Tabs.List>

                <div className="flex items-center gap-3">
                    {survey?.status !== SurveyStatusEnum.Active ? (
                        <Trash2 onClick={() => deleteQuestion(question)} className="cursor-pointer" size={20} />
                    ) : null}

                    <button onClick={clear}>
                        <XIcon className="cursor-pointer" />
                    </button>
                </div>
            </div>

            <div>
                <div>
                    <Tabs.Content value="edit" className="flex-1 pt-2" key="edit">
                        <EditTab questionIndex={questionIndex} />
                    </Tabs.Content>

                    {Object.keys(question.settings).length === 0 ? null : (
                        <Tabs.Content value="logic" className="flex-1 pt-2" key="logic">
                            <LogicTab questionIndex={questionIndex} />
                        </Tabs.Content>
                    )}

                    {Object.keys(question.settings).length === 0 ? null : (
                        <Tabs.Content value="settings" className="flex-1 pt-2" key="settings">
                            <SettingsTab questionIndex={questionIndex} />
                        </Tabs.Content>
                    )}
                </div>
            </div>
        </Tabs.Root>
    );
};
