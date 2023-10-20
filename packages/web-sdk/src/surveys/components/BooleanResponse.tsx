import { ThumbsDown, ThumbsUp } from 'lucide-preact';
import { Fragment, VNode, h } from 'preact';
import { Button, Header } from '../../components';
import { BooleanSettings, Question, SurveyAnswer, Theme } from '../../types';
import AnswerContainer from './AnswerContainer';

interface BooleanResponseProps {
  question: Question;
  theme?: Theme;
  label: string;
  description?: string;
  onAnswered: (answers: SurveyAnswer[]) => void;
}

export default function BooleanResponse({
  question,
  label,
  description,
  theme,
  onAnswered,
}: BooleanResponseProps): VNode {
  const answerPositive = () => onAnswered([{ answer: '1' }]);
  const answerNegative = () => onAnswered([{ answer: '0' }]);

  return (
    <AnswerContainer className='space-y-4'>
      <Header
        title={label}
        description={description}
        color={theme?.question}
      />

      <div className='flex justify-between gap-2'>
        {(question?.settings as BooleanSettings).shape === 'button' ? (
          <Fragment>
            <Button
              color={theme?.answer}
              onClick={answerPositive}
              variant='surveyInput'
              size='full'
            >
              {(question.settings as BooleanSettings).positiveText}
            </Button>
            <Button
              color={theme?.answer}
              onClick={answerNegative}
              variant='surveyInput'
              size='full'
            >
              {(question.settings as BooleanSettings).negativeText}
            </Button>
          </Fragment>
        ) : (
          <Fragment>
            <button onClick={answerNegative}>
              <ThumbsDown size={32} color={theme?.answer} />
            </button>
            <button onClick={answerPositive}>
              <ThumbsUp size={32} color={theme?.answer} />
            </button>
          </Fragment>
        )}
      </div>
    </AnswerContainer>
  );
}
