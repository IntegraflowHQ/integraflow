import { SurveyQuestionTypeEnum } from "@/generated/graphql";
import { ParsedQuestion } from "@/types";
import { ArrowLeft } from "@/ui/icons";
import { getQuestionIcon } from "@/utils/question";
import { ChannelInfo } from "./ChannelInfo";

const questions = [
    {
        label: "How easy or difficult to use is [product name]?",
        answer: "5",
        type: SurveyQuestionTypeEnum.Rating,
    },
    {
        label: "How would you rate [product name]'s usefulness to you?",
        answer: "5",
        type: SurveyQuestionTypeEnum.Rating,
    },
    {
        label: "What can we do to make it more useful?",
        answer: "make it better",
        type: SurveyQuestionTypeEnum.Text,
    },
    {
        label: "How would you rate the credibility of [product name]?",
        answer: "5",
        type: SurveyQuestionTypeEnum.Rating,
    },
    {
        label: "Can you share more thoughts?",
        answer: "make it better ",
        type: SurveyQuestionTypeEnum.Text,
    },
];

type Props = React.HtmlHTMLAttributes<HTMLDivElement> & {
    onBackPress: () => void;
};

export const ResponseDetails = ({ onBackPress, ...props }: Props) => {
    return (
        <div className="flex gap-[23px]" {...props}>
            <div className="w-full rounded-lg bg-intg-bg-15 px-[25px] py-5">
                <button className="mb-[25px] flex items-center gap-2 text-white" onClick={onBackPress}>
                    <ArrowLeft />
                    <span>Back</span>
                </button>

                <div className="flex flex-col gap-6">
                    {questions.map((q, index) => (
                        <div className="flex w-full flex-col gap-2" key={index}>
                            <div className="flex items-center gap-2">
                                <img src={getQuestionIcon(q as unknown as ParsedQuestion)} alt="icon" />

                                <strong className="text-intg-text-12 text-base font-bold leading-5 -tracking-[0.41px]">
                                    {index < 10 ? `0${index + 1}` : `${index + 1}`}
                                </strong>

                                <h3 className="text-sm -tracking-[0.41px] text-intg-text-2">{q.label}</h3>
                            </div>

                            <div className="w-full rounded-lg bg-intg-bg-21 px-4 py-3.5">
                                <span className="text-sm font-medium text-intg-text-3">Answer: {q.answer}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex flex-col gap-3 p-3.5">
                <ChannelInfo />
            </div>
        </div>
    );
};
