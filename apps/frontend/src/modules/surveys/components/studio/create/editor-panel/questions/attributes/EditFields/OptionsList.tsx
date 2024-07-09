import { SurveyQuestionTypeEnum, SurveyStatusEnum } from "@/generated/graphql";
import { useQuestion } from "@/modules/surveys/hooks/useQuestion";
import { useSurvey } from "@/modules/surveys/hooks/useSurvey";
import { LimitRange } from "@/types";
import { cn, generateUniqueId, getHighestOrderNumber } from "@/utils";
import { EditorTextInput } from "../../../components/EditorTextInput";
import { AddMultipleQuestions } from "../AddMultipleQuestions";
import { CommentButton } from "../Buttons/CommentButton";
import MinusButton from "../Buttons/MinimizeButton";
import { MoreButton } from "../Buttons/MoreButton";
import TextButton from "../Buttons/TextButton";

export const OptionsList = () => {
    const { updateQuestion, question } = useQuestion();
    const { survey } = useSurvey();

    const rangeOption =
        question?.settings.choice?.min === question?.settings.choice?.max ? LimitRange.EXACT : LimitRange.RANGE;

    const addNewOPtion = () => {
        if (!question) {
            return;
        }

        const highestOrderNumber = getHighestOrderNumber(question?.options);
        const newOptions = [...question.options];
        newOptions.push({
            id: generateUniqueId(),
            orderNumber: highestOrderNumber + 1,
            label: "",
            comment: false,
        });

        if (question.type !== SurveyQuestionTypeEnum.Multiple) {
            updateQuestion({
                options: newOptions,
            });
            return;
        }

        const newSettings = { ...question.settings };
        newSettings["choice"] =
            rangeOption === LimitRange.RANGE
                ? {
                      min: newSettings.choice?.min ?? 1,
                      max: newOptions.length,
                  }
                : {
                      min: Math.min(newSettings.choice?.min ?? 1, newOptions.length),
                      max: Math.min(newSettings.choice?.min ?? 1, newOptions.length),
                  };

        updateQuestion({
            options: newOptions,
            settings: newSettings,
        });
    };

    const removeOption = (index: number) => {
        if (!question) {
            return;
        }

        const newOptions = [...question.options];
        newOptions.splice(index, 1);

        if (question.type !== SurveyQuestionTypeEnum.Multiple) {
            updateQuestion({
                options: newOptions,
            });
            return;
        }

        const newSettings = { ...question.settings };
        newSettings["choice"] =
            rangeOption === LimitRange.RANGE
                ? {
                      min: newSettings.choice?.min ?? 1,
                      max: Math.min(newSettings.choice?.max ?? 1, newOptions.length),
                  }
                : {
                      min: Math.min(newSettings.choice?.min ?? 1, newOptions.length),
                      max: Math.min(newSettings.choice?.min ?? 1, newOptions.length),
                  };

        updateQuestion({
            options: newOptions,
            settings: newSettings,
        });
    };

    if (!question) {
        return null;
    }

    if (
        ![SurveyQuestionTypeEnum.Single, SurveyQuestionTypeEnum.Multiple, SurveyQuestionTypeEnum.Dropdown].includes(
            question?.type,
        )
    ) {
        return null;
    }

    return (
        <div>
            <div className="space-y-4">
                <div className="flex justify-between text-sm">
                    <p>Answer Choices</p>
                    <AddMultipleQuestions questionOptions={question?.options} />
                </div>

                {question?.options ? (
                    <div className="space-y-4">
                        {question?.options.map((option, index) => (
                            <div key={option.id} className="flex items-center gap-2">
                                <MoreButton />
                                <EditorTextInput
                                    maxCharacterCount={100}
                                    placeholder={`Answer ${index + 1}`}
                                    defaultValue={option.label}
                                    onChange={(e) => {
                                        const newOptions = [...question.options];
                                        newOptions[index].label = e.target.value;

                                        updateQuestion(
                                            {
                                                options: newOptions,
                                            },
                                            true,
                                        );
                                    }}
                                />
                                <div
                                    className={cn(
                                        `${
                                            question?.type === SurveyQuestionTypeEnum.Dropdown ? "hidden " : "block"
                                        } flex`,
                                    )}
                                >
                                    <CommentButton
                                        color={option.comment ? "active" : "default"}
                                        onClick={() => {
                                            const newOptions = [...question.options];
                                            newOptions[index].comment = !option.comment;

                                            updateQuestion({
                                                options: newOptions,
                                            });
                                        }}
                                    />
                                </div>

                                {question?.options.length < 3 ? null : (
                                    <MinusButton
                                        onclick={() => {
                                            removeOption(index);
                                        }}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                ) : null}

                {survey?.status !== SurveyStatusEnum.Active ? (
                    <TextButton text={"Add an answer at choice"} onclick={addNewOPtion} />
                ) : null}
            </div>
        </div>
    );
};
