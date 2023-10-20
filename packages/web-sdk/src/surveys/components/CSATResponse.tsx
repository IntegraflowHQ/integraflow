import { VNode, h } from 'preact';
import { Button, Header } from '../../components';
import { Question, SurveyAnswer, Theme } from '../../types';
import AnswerContainer from './AnswerContainer';

interface CSATResponseProps {
  question: Question;
  label: string;
  description?: string;
  onAnswered: (answers: SurveyAnswer[]) => void;
  theme?: Theme;
}

export default function CSATResponse({
  question,
  label,
  description,
  onAnswered,
  theme,
}: CSATResponseProps): VNode {
  return (
    <div className={'space-y-3'}>
      <Header title={label} description={description} color={theme?.question} />
      <AnswerContainer className={'space-y-2'}>
        {question.options
          ?.sort((a, b) => a.orderNumber - b.orderNumber)
          .map((option, index) => {
            return (
              <Button
                onClick={() => {
                  onAnswered([{ answerId: option.id, answer: option.label }]);
                }}
                key={index}
                variant='surveyInput'
                color={theme?.answer}
                size='full'
              >
                {option.label}
              </Button>
            );
          })}
      </AnswerContainer>
    </div>
  );
}
