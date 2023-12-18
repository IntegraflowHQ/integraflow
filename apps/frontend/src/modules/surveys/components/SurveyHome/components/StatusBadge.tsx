import { SurveyStatusEnum } from "@/generated/graphql";
import { Badge } from "@tremor/react";
import {
    Archive,
    CheckCircle,
    PauseCircle,
    PencilLine,
    Radio,
    RefreshCcw,
} from "lucide-react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const StatusBadge = ({ survey }: { survey: any }) => {
    return (
        <Badge
            className={`${
                survey.status === SurveyStatusEnum.Active
                    ? "border border-green-700 bg-teal-300/[.05] text-teal-800"
                    : survey.status === SurveyStatusEnum.Draft
                    ? "border border-blue-700 bg-blue-300/[.05] text-blue-800"
                    : survey.status === SurveyStatusEnum.InProgress
                    ? "border border-teal-700 bg-teal-300/[.05] text-teal-700"
                    : survey.status === SurveyStatusEnum.Paused
                    ? "border border-gray-700 bg-slate-300/[.05] text-slate-400"
                    : survey.status === SurveyStatusEnum.Completed
                    ? "border border-purple-700 bg-purple-800/[0.5] text-white"
                    : "border border-yellow-700 bg-yellow-300/[.05] text-yellow-800"
            } rounded-2xl`}
            icon={
                survey.status === SurveyStatusEnum.Active
                    ? Radio
                    : survey.status === SurveyStatusEnum.Draft
                    ? PencilLine
                    : survey.status === SurveyStatusEnum.Completed
                    ? CheckCircle
                    : survey.status === SurveyStatusEnum.InProgress
                    ? RefreshCcw
                    : survey.status === SurveyStatusEnum.Paused
                    ? PauseCircle
                    : Archive
            }
        >
            <span className="text-[12px]">{survey.status}</span>
        </Badge>
    );
};
