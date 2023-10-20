import { h } from 'preact';
import {
  AngryEmoji,
  HappyEmoji,
  NeutralEmoji,
  SadEmoji,
  SatisfiedEmoji,
} from '../../assets';
import { Button, Header } from '../../components';
import { Question, RangeSettings, SurveyAnswer, Theme } from '../../types';
import AnswerContainer from './AnswerContainer';

type Props = {
  question: Question;
  label: string;
  description?: string;
  theme?: Theme;
  onAnswered: (answers: SurveyAnswer[]) => void;
};

const smileyOptions = [
  <AngryEmoji />,
  <SadEmoji />,
  <NeutralEmoji />,
  <SatisfiedEmoji />,
  <HappyEmoji />,
];

const getCountBasedIndex = (count: number, optionIndex: number): number => {
  if (count === 3) {
    return optionIndex * 2;
  } else if (count === 5) {
    return optionIndex;
  }
  return 0;
};

const renderSmiley = (count: number, optionIndex: number) => {
  const smileyIndex = getCountBasedIndex(count, optionIndex);
  return smileyOptions[smileyIndex];
};

export const SmileyResponse = ({
  question,
  label,
  description,
  theme,
  onAnswered,
}: Props) => {
  const count = question.options?.length ?? (question.settings as RangeSettings).count ?? 0;

  return (
    <AnswerContainer>
      <Header
        title={label ?? ''}
        description={description}
        color={theme?.question ?? '#050505'}
      />

      <div>
        <div className={'flex justify-center gap-1 my-2 mx-auto'}>
          {question.options?.map((option, index) => (
            <Button
              key={option.id}
              type='button'
              onClick={() =>
                onAnswered([{ answerId: option.id, answer: option.label }])
              }
              color={theme?.answer}
              classname={'cursor-pointer block p-2 w-auto h-auto'}
              variant='rounded'
            >
              {renderSmiley(count, index)}
            </Button>
          ))}
        </div>
        <div className={'flex gap-12 justify-between w-full '}>
          <span
            style={{
              color: theme?.answer ?? '#050505',
            }}
          >
            {(question?.settings as RangeSettings).leftText}
          </span>
          <span
            style={{
              color: theme?.answer ?? '#050505',
            }}
          >
            {(question?.settings as RangeSettings).rightText}
          </span>
        </div>
      </div>
    </AnswerContainer>
  );
};
