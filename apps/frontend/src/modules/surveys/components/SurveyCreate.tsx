import { ROUTES } from "@/routes";
import { CreateSurvey } from "@/types";
import { GlobalSpinner, Header } from "@/ui";
import { List, PlusCircle } from "@/ui/icons";
import { cn } from "@/utils";
import { useNavigate, useParams } from "react-router-dom";

type Props = {
    className?: string;
    size?: "sm" | "lg";
    createFn: () => void;
    busy?: boolean;
};

export default function SurveyCreate({ createFn, className, busy = false, size = "lg" }: Props) {
    const navigate = useNavigate();
    const { orgSlug, projectSlug } = useParams();

    const surveyCreateOptions = [
        {
            id: CreateSurvey.START_FROM_SCRATCH,
            icon: <PlusCircle color="#AFAAC7" size={size === "sm" ? "44" : "48"} />,
            title: "Start form scratch",
            description: "Craft and design your unique survey",
            onClick: createFn,
        },
        {
            id: CreateSurvey.USE_TEMPLATE,
            icon: <List />,
            title: "Use a template",
            description: "Select one from our curated list of templates",
            onClick: () => {
                navigate(ROUTES.SURVEY_TEMPLATES.replace(":orgSlug", orgSlug!).replace(":projectSlug", projectSlug!));
            },
        },
    ];

    if (busy) {
        return <GlobalSpinner />;
    }

    return (
        <div className={cn("flex", size === "sm" ? "gap-2" : "gap-4", className ?? "")}>
            {surveyCreateOptions.map((option, index) => (
                <button
                    key={option.title}
                    className="flex flex-1 flex-col items-center justify-center gap-3 rounded-lg bg-[#261F36]"
                    onClick={option.onClick}
                    disabled={option.id === CreateSurvey.START_FROM_SCRATCH && busy}
                >
                    {option.icon}
                    <Header
                        title={option.title}
                        description={option.description}
                        className={cn("text-center", size === "sm" && index === 1 ? "px-8" : "")}
                        variant={size === "sm" ? "3" : "2"}
                        font="medium"
                    />
                </button>
            ))}
        </div>
    );
}
