import { CreateSurvey } from "@/types";
import { GlobalSpinner, Header } from "@/ui";
import { PlusCircle } from "@/ui/icons";
import { cn } from "@/utils";

type Props = {
    className?: string;
    size?: "sm" | "lg";
    createFn: () => void;
    busy?: boolean;
};

export default function SurveyCreate({ createFn, className, busy = false, size = "lg" }: Props) {
    const surveyCreateOptions = [
        {
            id: CreateSurvey.START_FROM_SCRATCH,
            icon: <PlusCircle color="#AFAAC7" size={size === "sm" ? "44" : "48"} />,
            title: "Start form scratch",
            description: "Craft and design your unique survey",
            onClick: createFn,
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
                    className="flex flex-1 flex-col items-center justify-center gap-3 rounded-lg transition hover:bg-[#261F36]"
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
