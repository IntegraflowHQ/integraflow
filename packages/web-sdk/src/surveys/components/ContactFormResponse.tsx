import { h } from 'preact';
import {
  FormField,
  FormSettings,
  ID,
  Question,
  SurveyAnswer,
  Theme,
} from '../../types';
import { Button, Header, Input } from '../../components';
import { useMemo, useState } from 'preact/hooks';
import { LockIcon } from 'lucide-preact';
import { hexToRgba } from '../../utils';
import AnswerContainer from './AnswerContainer';

type Props = {
  question: Question;
  theme?: Theme;
  onAnswered: (answers: SurveyAnswer[]) => void;
  submitText?: string;
  label: string;
  description: string;
};

export const ContactFormResponse = ({
  label,
  description,
  question,
  theme,
  onAnswered,
  submitText,
}: Props) => {
  const [inputValues, setInputValues] = useState<{ [key: ID]: string }>({});
  const handleInputChange = (fieldId: string, value: string) => {
    setInputValues((prevValues) => ({
      ...prevValues,
      [fieldId]: value,
    }));
  };

  const [checked, setChecked] = useState(!(question.settings as FormSettings).consent);
  const handleChange = () => {
    setChecked(!checked);
  };

  const isValid = useMemo(() => {
    if (!checked) {
      return false;
    }

    const valid = (question.options as FormField[])?.every(option => {
      if (!option.required) {
        return true;
      }

      return !!inputValues[option.id];
    });

    return valid;
  }, [question, inputValues, checked]);

  const onSubmit = (e: h.JSX.TargetedEvent<HTMLFormElement, Event>) => {
    e.preventDefault();
    const answers: SurveyAnswer[] = [];
    (question.options as FormField[]).forEach((option) => {
      const answer = inputValues[option.id];
      answers.push({
        fieldType: option.type,
        answerId: option.id,
        answer,
      });
    });

    onAnswered(answers);
  };

  return (
    <AnswerContainer>
      <Header title={label} description={description} color={theme?.question} />
      <form onSubmit={onSubmit}>
        {(question.options as FormField[]).map((option) => {
          return (
            <div className={'mb-2 mt-3'}>
              <Input
                option={option}
                required={option.required}
                value={inputValues[option.id] || ''}
                color={theme?.answer}
                name={option.id + ''}
                id={option.id}
                label={option.label}
                type={option.type}
                onChange={(value) => handleInputChange(option.id + '', value)}
              />
            </div>
          );
        })}
        <div className={'space-y-3'}>
          {(question.settings as FormSettings).consent && (
            <label
              className={
                'rounded-md mt-3 flex p-2 px-4 gap-2 items-center text-sm'
              }
              style={{
                color: theme?.answer ?? '#050505',
                backgroundColor: theme?.answer
                  ? hexToRgba(theme?.answer, 0.1)
                  : '#F0F0F0',
              }}
            >
              <input
                style={{
                  width: '20px',
                  height: '20px',
                  accentColor: theme?.answer ?? '#050505',
                  borderWidth: '2px',
                  borderStyle: 'solid',
                  borderColor: theme?.answer ?? '#050505',
                  borderRadius: '4px'
                }}
                type="checkbox"
                value=""
                checked={checked}
                onChange={handleChange}
              />
              <span>{(question.settings as FormSettings).consentText}</span>
            </label>
          )}
          {(question.settings as FormSettings).disclaimer && (
            <p
              className={'flex items-center rounded-md p-2 px-4 gap-2'}
              style={{
                color: theme?.answer ?? '#050505',
                fontSize: '14px',
                backgroundColor: theme?.answer
                  ? hexToRgba(theme?.answer, 0.1)
                  : '#F0F0F0',
              }}
            >
              <span>
                <LockIcon size={13} />
              </span>
              <span>{(question.settings as FormSettings).disclaimerText}</span>
            </p>
          )}
          <Button
            color={theme?.button}
            size="full"
            type="submit"
            disabled={!isValid}
            classname='mt-3'
          >
            {submitText ?? 'Submit'}
          </Button>
        </div>
      </form>
    </AnswerContainer>
  );
};
