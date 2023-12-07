import SurveyCreate from "@/modules/surveys/components/SurveyCreate";
import Container, { SwitchProps } from "../Container";

export default function CreateFirstSurvey({
    onComplete,
    ...props
}: SwitchProps) {
    return (
        <Container
            title="Create a new survey"
            description="Pick a method that suits you best"
            {...props}
        >
            <SurveyCreate className="h-[310px] w-[564px] pt-8" size="sm" />
        </Container>
    );
}
