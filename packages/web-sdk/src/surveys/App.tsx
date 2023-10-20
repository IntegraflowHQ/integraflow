import { VNode, h } from 'preact';
import { useEffect, useState } from 'preact/hooks';

import { ID, Question, Survey, SurveyAnswer } from '../types';
import SurveyView from './components/Survey';

interface AppProps {
  survey: Survey;
  getNextQuestionId: (question: Question, answers: SurveyAnswer[]) => ID | null;
  replaceTags: (surveyId: ID, content: string) => string;
  onSurveyDisplayed?: (survey: Survey) => Promise<void>;
  onSurveyClosed?: (surveyId: ID) => Promise<void>;
  onQuestionAnswered?: (
    surveyId: ID,
    questionId: ID,
    answers: SurveyAnswer[]
  ) => Promise<void>;
  onSurveyCompleted?: (surveyId: ID) => Promise<void>;
}

export default function App({
  survey,
  replaceTags,
  getNextQuestionId,
  onSurveyDisplayed,
  onSurveyClosed,
  onQuestionAnswered,
  onSurveyCompleted,
}: AppProps): VNode {
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    onSurveyDisplayed?.(survey);
  });

  const close = (force: boolean = false) => {
    setIsOpen(false);
    setTimeout(
      () => {
        onSurveyClosed?.(survey.id);
      },
      force ? 0 : 500
    ); // wait for animation to finish
  };

  return (
    <SurveyView
      survey={survey}
      close={close}
      replaceTags={replaceTags}
      getNextQuestionId={getNextQuestionId}
      onQuestionAnswered={onQuestionAnswered}
      onSurveyCompleted={onSurveyCompleted}
    />
  );
}
