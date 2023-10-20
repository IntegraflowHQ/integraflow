import { h } from 'preact';
import { useState } from 'preact/hooks';
import { Button, Header } from '../../components';
import { Question, SurveyAnswer, TextSettings, Theme } from '../../types';
import { hexToRgba } from '../../utils';
type Props = {
  question: Question;
  label: string;
  description?: string;
  theme?: Theme;
  submitText?: string;
  onAnswered: (answer: SurveyAnswer[]) => void;
};

const TextResponse = ({
  theme,
  question,
  label,
  description,
  submitText,
  onAnswered,
}: Props) => {
  const [answer, setAnswer] = useState('');

  const onSubmitHandler = (
    event: h.JSX.TargetedEvent<HTMLFormElement, Event>
  ) => {
    event.preventDefault();

    onAnswered([{ answer }]);
  };

  const styles: h.JSX.CSSProperties = {
    color: theme?.answer ?? '#050505',
    backgroundColor: hexToRgba(theme?.answer ?? '#050505', 0.1),
    fontSize: '14px',
    fontWeight: 400,
    lineHeight: 'normal',
  };

  return (
    <div>
      <Header title={label} description={description} color={theme?.question} />

      <form onSubmit={onSubmitHandler}>
        {(question.settings as TextSettings).singleLine === true ? (
          <input
            type='text'
            className={'w-full mt-3 border rounded-xl p-3 '}
            style={styles}
            name={question.id.toString()}
            id={question.id.toString()}
            placeholder={'Type your answer here...'}
            value={answer}
            onChange={(e: h.JSX.TargetedEvent<HTMLInputElement, Event>) => {
              setAnswer(e.currentTarget.value);
            }}
          />
        ) : (
          <textarea
            name={question.id.toString()}
            id={question.id.toString()}
            cols={20}
            rows={5}
            placeholder={'Type your answer here...'}
            value={answer}
            onChange={(e: h.JSX.TargetedEvent<HTMLTextAreaElement, Event>) => {
              setAnswer(e.currentTarget.value);
            }}
            className={'w-full h-full mt-3 resize-none border rounded-xl p-4'}
            style={styles}
          ></textarea>
        )}
        <Button
          color={theme?.button}
          type='submit'
          size='full'
          classname='mt-3'
        >
          {submitText ?? 'Submit'}
        </Button>
      </form>
    </div>
  );
};

export default TextResponse;
