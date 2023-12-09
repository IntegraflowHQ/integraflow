import { useSurveyCreateMutation } from "@/generated/graphql";
import { ROUTES } from "@/routes";
import { Header } from "@/ui";
import { List, PlusCircle } from "@/ui/icons";
import { cn, generateRandomString } from "@/utils";
import { useNavigate, useParams } from "react-router-dom";

enum CreateSurvey {
    START_FROM_SCRATCH = "start from scratch",
    USE_TEMPLATE = "use template",
}

type Props = {
    className?: string;
    size?: "sm" | "lg";
};

export default function SurveyCreate({ className, size = "lg" }: Props) {
    const { orgSlug, projectSlug } = useParams();
    const [createSurvey] = useSurveyCreateMutation();
    const navigate = useNavigate();
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
    const hadleCreateSurvey = async (option: string) => {
        if (option === CreateSurvey.START_FROM_SCRATCH) {
            const surveySlug = `survey-${generateRandomString(10)}`;
            navigate(
                ROUTES.STUDIO.replace(":orgSlug", orgSlug!)
                    .replace(":projectSlug", projectSlug!)
                    .replace(":surveySlug", surveySlug),
            );

            await createSurvey({
                variables: {
                    input: {
                        id: crypto.randomUUID(),
                        slug: surveySlug,
                    },
                },
                onError: () => {
                    navigate(
                        ROUTES.SURVEY_LIST.replace(
                            ":orgSlug",
                            orgSlug!,
                        ).replace(":projectSlug", projectSlug!),
                    );
                },
            });
        }
    };

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
                    onClick={() => {
                        hadleCreateSurvey(option.id);
                    }}
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
