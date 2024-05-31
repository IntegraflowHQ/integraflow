import { SurveyQuestion, SurveyQuestionTypeEnum } from "@/generated/graphql";
import useAnalyze from "@/modules/surveys/hooks/useAnalyze";
import { useSurvey } from "@/modules/surveys/hooks/useSurvey";
import { ArrowLeft } from "@/ui/icons";
import { stripHtmlTags } from "@/utils";
import { getQuestionIcon } from "@/utils/question";
import { ChannelInfo } from "./ChannelInfo";

type Props = React.HtmlHTMLAttributes<HTMLDivElement> & {
    onBackPress: () => void;
};

export const ResponseDetails = ({ onBackPress, ...props }: Props) => {
    const { parsedQuestions } = useSurvey();
    const { activeResponse } = useAnalyze();

    const getAnswer = (q: SurveyQuestion) => {
        if (!q.reference) {
            return "";
        }

        if (!activeResponse?.response[q.reference] || activeResponse.response[q.reference].length < 1) {
            return "";
        }

        if (q.type === SurveyQuestionTypeEnum.Cta && activeResponse?.response[q.reference][0].ctaSuccess) {
            return "clicked";
        }
        if (q.type === SurveyQuestionTypeEnum.Cta && !activeResponse?.response[q.reference][0].ctaSuccess) {
            return "not clicked";
        }

        return activeResponse?.response[q.reference][0].answer;
    };

    return (
        <div className="flex gap-[23px]" {...props}>
            <div className="w-full rounded-lg bg-intg-bg-15 px-[25px] py-5">
                <button className="mb-[25px] flex items-center gap-2 text-white" onClick={onBackPress}>
                    <ArrowLeft />
                    <span>Back</span>
                </button>

                <div className="flex flex-col gap-6">
                    {parsedQuestions.map((q, index) => (
                        <div className="flex w-full flex-col gap-2" key={q.id}>
                            <div className="flex items-center gap-2">
                                <img src={getQuestionIcon(q)} alt="icon" />

                                <strong className="text-base font-bold leading-5 -tracking-[0.41px] text-intg-text-12">
                                    {index < 10 ? `0${index + 1}` : `${index + 1}`}
                                </strong>

                                <h3 className="text-sm -tracking-[0.41px] text-intg-text-2">
                                    {stripHtmlTags(q.label)}
                                </h3>
                            </div>

                            <div className="w-full rounded-lg bg-intg-bg-21 px-4 py-3.5">
                                <span className="text-sm font-medium text-intg-text-3">Answer: {getAnswer(q)}</span>
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
