import Integraflow from '../index';
import { templates } from './templates';

(function() {
  const integraflow = Integraflow.init({
    surveys: templates.map(t => t.survey),
    debug: true,
    onQuestionAnswered(surveyId, questionId, answers) {
      console.log(surveyId, questionId, answers);
    },
  });

  integraflow.showSurvey(1);
})();
