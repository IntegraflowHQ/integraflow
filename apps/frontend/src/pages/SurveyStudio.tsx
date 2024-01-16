import { SurveyProvider } from "@/modules/surveys/SurveyProvider";
import Studio from "@/modules/surveys/components/Studio";

export function SurveyStudio() {
    return (
        <SurveyProvider>
            <Studio />
        </SurveyProvider>
    );
}
