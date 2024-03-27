import { Outlet } from "react-router-dom";
import { SurveyProvider } from "../modules/surveys/SurveyProvider";

export const SurveyShell = () => {
    return (
        <SurveyProvider>
            <Outlet />
        </SurveyProvider>
    );
};
