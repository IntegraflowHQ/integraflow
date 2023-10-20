import { h } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { Button, Header } from '../../components';
import useIsMobile from '../../hooks/useIsMobile';
import {
  AnswerType,
  ID,
  Question,
  QuestionOption,
  RangeSettings,
  SurveyAnswer,
  Theme,
} from '../../types';
import { cn, hexToRgba } from '../../utils';
import AnswerContainer from './AnswerContainer';
import RatingIcon from './RatingIcon';

interface RangeResponseProps {
  question: Question;
  label: string;
  description?: string;
  onAnswered: (answers: SurveyAnswer[]) => void;
  theme?: Theme;
}

function RangeResponse({
  question,
  label,
  description,
  onAnswered,
  theme,
}: RangeResponseProps) {
  const [value, setValue] = useState(0);
  const [answerId, setAnswerId] = useState<ID | null>(null);
  const [hoveredRatingValue, setHoveredRatingValue] = useState(0);
  const isMobile = useIsMobile();

  const answerColor = theme?.answer ?? '#050505';
  const maxCount =
    question.type === AnswerType.NPS
      ? 10
      : question.options?.length ??
        (question.settings as RangeSettings).count ??
        0;

  useEffect(() => {
    if (value === 0) return;

    onAnswered([
      { answerId: answerId ?? value, answer: String(answerId ?? value) },
    ]);
  }, [value, answerId]);

  const renderOption = (
    index: number,
    option: QuestionOption | null = null
  ) => {
    const isSelected = value === index + 1;

    const handleOptionClick = () => {
      option && setAnswerId(option.id); // When `question.options` is provided
      setValue(index + 1);
    };

    if (question.type === AnswerType.NPS || question.type === AnswerType.NUMERICAL_SCALE) {
      const getLabel = () => {
        if (isMobile && index === 0)
          return `${index + 1} - ${(question.settings as RangeSettings)
            ?.leftText ?? 'Not likely'}`;
        if (isMobile && index === maxCount - 1)
          return `${index + 1} - ${(question.settings as RangeSettings)
            ?.rightText ?? 'Very likely'}`;
        return `${index + 1}`;
      };
    
      return (
        <Button
          key={index}
          onClick={handleOptionClick}
          color={theme?.answer}
          classname={!isMobile ? 'w-[42px] h-[42px] shrink-0' : undefined}
          variant='surveyInput'
          isActive={isSelected}
          size={isMobile ? 'full' : undefined}
        >
          {getLabel()}
        </Button>
      );
    } else if (question.type === AnswerType.RATING) {
      return (
        <button
          onClick={handleOptionClick}
          key={index}
          onMouseOver={() => setHoveredRatingValue(index + 1)}
        >
          <RatingIcon
            shape={(question.settings as RangeSettings).shape}
            color={
              index + 1 <= hoveredRatingValue
                ? answerColor
                : hexToRgba(answerColor, 0.1)
            }
          />
        </button>
      );
    }

    return null;
  };

  const renderRangeContent = () => {
    if (question.type === AnswerType.NPS) {
      return Array.from({ length: maxCount }, (_, index) => index).map((_, index) =>
        renderOption(index)
      );
    } else if (question.options && question.options.length > 0) {
      return question.options
        .sort((a, b) => a.orderNumber - b.orderNumber)
        .map((option, index) => renderOption(index, option));
    } else if ((question.settings as RangeSettings).count) {
      return Array.from(
        { length: (question.settings as RangeSettings).count! },
        (_, index) => index + 1
      ).map((_, index) => renderOption(index));
    }

    return null;
  };

  return (
    <AnswerContainer className='space-y-3'>
      <Header title={label} description={description} color={theme?.question} />

      <div
        className={cn(
          'flex justify-center gap-1 overflow-auto',
          isMobile && question.type === AnswerType.NPS ? 'flex-col' : '',
          isMobile && question.type === AnswerType.NUMERICAL_SCALE ? 'flex-col' : '',
          question.type === AnswerType.RATING ? 'mx-auto w-fit max-w-full' : '',
        )}
        onMouseLeave={() => {
          if (question.type === AnswerType.RATING) setHoveredRatingValue(0);
        }}
      >
        {renderRangeContent()}
      </div>

      {!isMobile || question.type === AnswerType.RATING ? (
        <div className='flex justify-between'>
          <span style={{ color: answerColor }}>
            {(question.settings as RangeSettings).leftText ?? 'Very satisfied'}
          </span>
          <span style={{ color: answerColor }}>
            {(question.settings as RangeSettings).rightText ??
              'Very unsatisfied'}
          </span>
        </div>
      ) : null}
    </AnswerContainer>
  );
}

export default RangeResponse;
