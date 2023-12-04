import { ROUTES } from "@/routes";
import { List, PlusCircle } from "@/ui/icons";
import { cn } from "@/utils";
import { useParams } from "react-router-dom";
import { SurveyCreateOption } from "./partials/SurveyCreateOption";

type Props = {
    className?: string;
};

export default function SurveyCreate({ className }: Props) {
    const { orgSlug, projectSlug } = useParams();
    const surveyCreateOptions = [
        {
            icon: <PlusCircle color="#AFAAC7" size="48" />,
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
        <div className={cn("flex gap-4", className ?? "")}>
            {surveyCreateOptions.map((option, index) => (
                <SurveyCreateOption key={index} {...option} />
            ))}
        </div>
    );
}
