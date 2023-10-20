import { h } from 'preact';
import { useMemo } from 'preact/hooks';

import { AnswerType, Question, SurveyAnswer, Theme } from '../../types';
import BooleanResponse from './BooleanResponse';
import CSATResponse from './CSATResponse';
import { CTAResponse } from './CTAResponse';
import ChoiceResponse from './ChoiceResponse';
import { ContactFormResponse } from './ContactFormResponse';
import DateResponse from './DateResponse';
import DropdownResponse from './DropdownResponse';
import RangeResponse from './RangeResponse';
import { SmileyResponse } from './SmileyResponse';
import TextResponse from './TextResponse';

interface ResponseProps {
  question: Question;
  theme?: Theme;
  submitText?: string;
  replaceTags: (content: string) => string;
  onAnswered: (answers: SurveyAnswer[]) => void;
}

export default function Response({
  question,
  theme,
  submitText,
  onAnswered,
  replaceTags,
}: ResponseProps) {
  let element: h.JSX.Element | null = null;

  const label = useMemo(() => replaceTags(question.label), [question]);
  const description = useMemo(() => replaceTags(question.description ?? ''), [
    question,
  ]);

  switch (question.type) {
    case AnswerType.TEXT:
      element = (
        <TextResponse
          question={question}
          label={label}
          description={description}
          onAnswered={onAnswered}
          theme={theme}
          submitText={submitText}
        />
      );
      break;
    case AnswerType.SMILEY_SCALE:
      element = (
        <SmileyResponse
          question={question}
          label={label}
          description={description}
          onAnswered={onAnswered}
          theme={theme}
        />
      );
      break;
    case AnswerType.DATE:
      element = (
        <DateResponse
          question={question}
          label={label}
          description={description}
          onAnswered={onAnswered}
          theme={theme}
          submitText={submitText}
        />
      );
      break;
    case AnswerType.CTA:
      element = (
        <CTAResponse
          question={question}
          label={label}
          description={description}
          onAnswered={onAnswered}
          theme={theme}
        />
      );
      break;
    case AnswerType.NPS:
      element = (
        <RangeResponse
          question={question}
          label={label}
          description={description}
          onAnswered={onAnswered}
          theme={theme}
        />
      );
      break;
    case AnswerType.RATING:
      element = (
        <RangeResponse
          question={question}
          label={label}
          description={description}
          onAnswered={onAnswered}
          theme={theme}
        />
      );
      break;
    case AnswerType.CSAT:
      element = (
        <CSATResponse
          question={question}
          label={label}
          description={description}
          onAnswered={onAnswered}
          theme={theme}
        />
      );
      break;
    case AnswerType.MULTIPLE:
    case AnswerType.SINGLE:
      element = (
        <ChoiceResponse
          question={question}
          label={label}
          description={description}
          onAnswered={onAnswered}
          theme={theme}
          submitText={submitText}
        />
      );
      break;
    case AnswerType.FORM:
      element = (
        <ContactFormResponse
          question={question}
          label={label}
          description={description}
          onAnswered={onAnswered}
          theme={theme}
          submitText={submitText}
        />
      );
      break;
    case AnswerType.NUMERICAL_SCALE:
      element = (
        <RangeResponse
          question={question}
          label={label}
          description={description}
          onAnswered={onAnswered}
          theme={theme}
        />
      );
      break;
    case AnswerType.BOOLEAN:
      element = (
        <BooleanResponse
          question={question}
          label={label}
          description={description}
          onAnswered={onAnswered}
          theme={theme}
        />
      );
      break;
    case AnswerType.DROPDOWN:
      element = (
        <DropdownResponse
          question={question}
          label={label}
          description={description}
          onAnswered={onAnswered}
          theme={theme}
          submitText={submitText}
        />
      );
  }

  return element;
}
