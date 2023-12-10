import { ROUTES } from "@/routes";
import { Header } from "@/ui";
import { List, PlusCircle } from "@/ui/icons";
import { cn } from "@/utils";
import { Link, useParams } from "react-router-dom";

type Props = {
    className?: string;
    size?: "sm" | "lg";
};

export default function SurveyCreate({ className, size = "lg" }: Props) {
    const { orgSlug, projectSlug } = useParams();
    const surveyCreateOptions = [
        {
            icon: (
                <PlusCircle
                    color="#AFAAC7"
                    size={size === "sm" ? "44" : "48"}
                />
            ),
            title: "Start form scratch",
            description: "Craft and design your unique survey",
            href: ROUTES.STUDIO.replace(":orgSlug", orgSlug!).replace(
                ":projectSlug",
                projectSlug!,
            ),
        },
        {
            icon: <List />,
            title: "Use a template",
            description: "Select one from our curated list of templates",
            href: ROUTES.SURVEY_TEMPLATES.replace(":orgSlug", orgSlug!).replace(
                ":projectSlug",
                projectSlug!,
            ),
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
            {surveyCreateOptions.map((option, index) => (
                <Link
                    key={option.title}
                    className="flex flex-1 flex-col items-center justify-center gap-3 rounded-lg bg-intg-bg-14"
                    to={option.href}
                >
                    {option.icon}
                    <Header
                        title={option.title}
                        description={option.description}
                        className={cn(
                            "text-center",
                            size === "sm" && index === 1 ? "px-8" : "",
                        )}
                        variant={size === "sm" ? "3" : "2"}
                        font="medium"
                    />
                </Link>
            ))}
        </div>
    );
}
