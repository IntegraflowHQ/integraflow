import React from "react";
import { SurveyContext, SurveyContextValues } from "../SurveyProvider";

export const useSurvey = () => {
    const context = React.useContext(SurveyContext);

    if (context === null) {
        throw new Error(
            "Survey context is missing. You probably forgot to wrap the component depending on survey in <SurveyProvider />",
        );
    }

    return context as SurveyContextValues;
};
