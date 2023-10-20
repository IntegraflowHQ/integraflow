import { h } from 'preact';

import { Header } from '../../components';
import { Button } from '../../components/Button';
import {
  CTASettings,
  CTAType,
  Question,
  SurveyAnswer,
  Theme,
} from '../../types';

type Props = {
  question: Question;
  theme?: Theme;
  label: string;
  description?: string;
  onAnswered: (answers: SurveyAnswer[]) => void;
};

export const CTAResponse = ({
  question,
  theme,
  label,
  description,
  onAnswered,
}: Props) => {
  const onClickHandler = () => {
    const settings = question?.settings as CTASettings
    if (settings.type === CTAType.LINK && settings.link) {
      window.open(settings.link, '_blank');
    }

    onAnswered([{ ctaSuccess: true, answer: '' }]);
  };

  return (
    <div className={'min-w-[255px] space-y-3'}>
      <Header title={label} description={description} color={theme?.question} />

      {(question?.settings as CTASettings).type === CTAType.HIDDEN ? null : (
        <Button
          onClick={onClickHandler}
          size='full'
          color={theme?.button}
        >
          {(question?.settings as CTASettings).text}
        </Button>
      )}
    </div>
  );
};
