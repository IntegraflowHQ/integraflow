import SurveyCreate from "@/modules/surveys/components/SurveyCreate";
import Container from "./Container";

export default function CreaateFirstSurvey() {
    return (
        <Container
            title="Create a new survey"
            description="Pick a method that suits you best"
            onSkip={() => console.log("skip")}
        >
            <SurveyCreate className="h-[310px] pt-8" size="sm" />
        </Container>
    );
}
