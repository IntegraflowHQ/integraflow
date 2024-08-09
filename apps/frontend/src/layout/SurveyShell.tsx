import { Outlet } from "react-router-dom";
import { SurveyProvider } from "../modules/surveys/contexts/SurveyProvider";

export const SurveyShell = () => {
    return (
        <SurveyProvider>
            <Outlet />
        </SurveyProvider>
    );
};
