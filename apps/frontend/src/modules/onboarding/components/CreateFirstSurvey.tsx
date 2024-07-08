import SurveyCreate from "@/modules/surveys/components/SurveyCreate";
import { ROUTES } from "@/routes";
import { createSearchParams, useNavigate, useParams } from "react-router-dom";
import Container, { SwitchProps } from "./Container";

export default function CreateFirstSurvey({ onComplete, ...props }: SwitchProps) {
    const navigate = useNavigate();
    const { orgSlug, projectSlug } = useParams();
    return (
        <Container title="Create a new survey" description="Get started by creating a survey." {...props}>
            <div className="flex h-[358px] w-full items-center justify-center pb-12">
                <SurveyCreate
                    createFn={() => {
                        navigate({
                            pathname: ROUTES.SURVEY_LIST.replace(":orgSlug", orgSlug!).replace(
                                ":projectSlug",
                                projectSlug!,
                            ),
                            search: createSearchParams({ create: "1" }).toString(),
                        });
                    }}
                    className="h-[282px] w-[282px] pt-8"
                    size="sm"
                />
            </div>
        </Container>
    );
}
