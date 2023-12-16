import { surveyConditions } from "@/utils/survey";
import TextButton from "./attributes/Buttons/TextButton";
import { ComboBox } from "./attributes/ComboBox";
import { SurveyQuestion } from "@/generated/graphql";

type Props = {
    questionType: string;
    question: SurveyQuestion;
};

export const LogicTab = ({ questionType, question }: Props) => {
    return (
        <div className="space-y-4">
            <div className="">
                <h3 className="text-sm font-semibold">Add logic</h3>
                <p className="text-sm">
                    Wondering how logic works?{" "}
                    <span className="cursor-pointer underline">Learn more</span>
                </p>
            </div>
            <div className="rounded-md border border-intg-bg-4">
                <div className="p-6 text-center">
                    <TextButton
                        size="md"
                        text="Add new logic"
                        classname="text-sm"
                    />
                </div>
                <div className="space-y-6 p-6">
                    <div className="flex justify-between">
                        <p>If</p>
                        <div className="w-[330px]">
                            <ComboBox options={surveyConditions} />
                        </div>
                    </div>
                    <div className="flex justify-between">
                        <div></div>
                        <div className="w-[330px]">
                            <ComboBox options={[{ label: "1", value: "1" }]} />
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between gap-14">
                            <p>then</p>
                            <div className="w-[330px]">
                                <ComboBox options={surveyConditions} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <TextButton text="Add new logic" />
            <p className="text-sm">
                All other answers will direct the respondents to the next
                question.
            </p>
        </div>
    );
};
