import { VNode, h } from 'preact';
import { useMemo, useState } from 'preact/hooks';
import { Button, Header } from '../../components';
import {
  AnswerType,
  MultipleSettings,
  Question,
  QuestionOption,
  SingleSettings,
  SurveyAnswer,
  Theme,
} from '../../types';
import { hexToRgba, shuffleArray } from '../../utils';
import AnswerContainer from './AnswerContainer';

interface ChoiceResponseProps {
  question: Question;
  label: string;
  description?: string;
  onAnswered: (answers: SurveyAnswer[]) => void;
  theme?: Theme;
  submitText?: string;
}

export default function ChoiceResponse({
  question,
  label,
  description,
  submitText,
  theme,
  onAnswered
}: ChoiceResponseProps): VNode {
  const [selectedOption, setSelectedOption] = useState<QuestionOption[]>([]);

  const handleOptionChange = (option: QuestionOption) => {
    if (question.type === AnswerType.MULTIPLE) {
      setSelectedOption((prevState) =>
        prevState?.includes(option)
          ? prevState.filter((id) => id !== option)
          : [...(prevState ?? []), option]
      );
    } else {
      onAnswered([{
        answerId: option.id,
        answer: option.label
      }]);
    }
  };

  const handleSubmit = (e?: h.JSX.TargetedEvent<HTMLFormElement, Event>) => {
    e?.preventDefault();

    onAnswered(
      selectedOption.map((option) => ({
        answerId: option.id,
        answer: option.label
      }))
    );
  };

  const questionOptions = useMemo(() => {
    if (
      (question.settings as MultipleSettings | SingleSettings)
        .randomizeExceptLast
    ) {
      return shuffleArray(question.options as QuestionOption[], 'exceptLast');
    }

    if ((question.settings as MultipleSettings | SingleSettings).randomize) {
      return shuffleArray(question.options as QuestionOption[], 'all');
    }

    return question.options;
  }, [question.options]);

  const isValid = useMemo(() => {
    if (question.type === AnswerType.SINGLE) {
      return true;
    }

    const choice = (question.settings as MultipleSettings).choice;
    if (!choice) {
      return true;
    }

    const minValid = !choice.min || selectedOption.length >= choice.min;
    const maxValid = !choice.max || choice.max >= selectedOption.length;

    return minValid && maxValid;
  }, [question, selectedOption]);

  return (
    <form className={'space-y-4'} onSubmit={handleSubmit}>
      <Header
        title={label}
        description={description}
        color={theme?.question}
      />

      <AnswerContainer className={'space-y-2'}>
        {questionOptions &&
          questionOptions.map((option) => (
            <label
              key={option.id}
              className={`rounded-xl py-3 px-4 flex gap-2 items-center cursor-pointer`}
              style={{
                backgroundColor: theme?.answer
                  ? hexToRgba(theme.answer, 0.1)
                  : '#F0F0F0',
                color: theme?.answer ?? '#050505',
              }}
            >
              <input
                style={{
                  width: '20px',
                  height: '20px',
                  accentColor: theme?.answer ?? '#050505',
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  borderColor: theme?.answer ?? '#050505',
                  borderRadius: question.type === AnswerType.MULTIPLE ? '4px' : undefined
                }}
                type={
                  question.type === AnswerType.MULTIPLE ? 'checkbox' : 'radio'
                }
                value={option.id}
                checked={selectedOption.some(selected => selected.id === option.id)}
                onChange={() => handleOptionChange(option)}
              />
              <span>{option.label}</span>
            </label>
          ))}
      </AnswerContainer>

      {question.type === AnswerType.MULTIPLE && <Button
        color={theme?.button}
        size='full'
        disabled={!isValid}
      >
        {submitText ?? 'Submit'}
      </Button>}
    </form>
  );
}
