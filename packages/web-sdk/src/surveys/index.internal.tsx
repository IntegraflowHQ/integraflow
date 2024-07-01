import { SurveyManager } from ".";
import { ID, Survey } from "../types";

export class _SurveyManager extends SurveyManager {
    updateActiveSurvey(survey: Survey, startFrom?: ID) {
        this.activeSurveys = this.activeSurveys.filter(s => {
            return s.id !== survey.id;
        });

        this.activeSurveys.unshift(survey);

        this.render(survey, startFrom, true);
    }
}
