import { CreateSurvey } from "@/types";
import { Header } from "@/ui";
import { List, PlusCircle } from "@/ui/icons";
import { cn } from "@/utils";
import { useSurvey } from "../hooks/useSurvey";

type Props = {
    className?: string;
    size?: "sm" | "lg";
};

export default function SurveyCreate({ className, size = "lg" }: Props) {
    const { createSurvey } = useSurvey();
    const surveyCreateOptions = [
        {
            id: CreateSurvey.START_FROM_SCRATCH,
            icon: (
                <PlusCircle
                    color="#AFAAC7"
                    size={size === "sm" ? "44" : "48"}
                />
            ),
            title: "Start form scratch",
            description: "Craft and design your unique survey",
        },
        {
            id: CreateSurvey.USE_TEMPLATE,
            icon: <List />,
            title: "Use a template",
            description: "Select one from our curated list of templates",
        },
    ];

    return (
        <div
            className={cn(
                "flex",
                size === "sm" ? "gap-2" : "gap-4",
                className ?? "",
            )}
        >
            {surveyCreateOptions.map((option) => (
                <div
                    key={option.title}
                    className="flex flex-1 flex-col items-center justify-center gap-3 rounded-lg bg-[#261F36]"
                    onClick={() => createSurvey(option.id)}
                >
                    {option.icon}
                    <Header
                        title={option.title}
                        description={option.description}
                        className="text-center"
                        variant={size === "sm" ? "3" : "2"}
                        font="medium"
                    />
                </div>
            ))}
        </div>
    );
}
