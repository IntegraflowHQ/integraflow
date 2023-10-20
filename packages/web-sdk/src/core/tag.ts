import { ID, State } from '../types';
import { Context } from './context';

export class TagManager {
  private readonly tags = {
    attribute: RegExp("\\{\\{attribute\\.(\\S+)(?:\\s?\\|\\s?\"([^\"]*)\")?\\}\\}", 'gi'),
    answer: RegExp("\\{\\{answer:(\\d+)(?:\\s?\\|\\s?\"([^\"]*)\")?\\}\\}", 'gi')
  };
  private readonly context: Context;

  constructor(ctx: Context) {
    this.context = ctx;
  }

  replaceTags = (surveyId: ID, content: string): string => {
    for (const key of Object.keys(this.tags)) {
      const tag = this.tags[key as keyof typeof this.tags];
      content = content.replace(tag, (match: string, ...args: any[]) => this.replaceTag(surveyId, key, match, args));
    }

    return content;
  }

  private replaceTag(surveyId: ID, key: string, match: string, ...args: any[]): string {
    const [attribute, fallback = ''] = args[0];
    const { state } = this.context;

    if (key === 'attribute') {
      return this.resolveAttribute(attribute, fallback, state?.user);
    }

    if (key === 'answer') {
      return this.resolveAnswer(attribute, fallback, surveyId, state?.surveyAnswers ?? {});
    }

    return fallback;
  }

  private resolveAttribute(attribute: string, fallback: string, attributes?: State['user']): string {
    if (!attributes) {
      return fallback;
    }

    const value = String(attributes[attribute]);

    return value ?? fallback;
  }

  private resolveAnswer(attribute: string, fallback: string, surveyId: ID, surveyAnswers: State['surveyAnswers']): string {
    if (!surveyAnswers || !surveyAnswers[surveyId]) {
      return fallback;
    }

    let answers = null;
    for (const [key, value] of surveyAnswers[surveyId]) {
      if (key == attribute) {
        answers = value;
        break;
      }
    }

    if (!answers || answers.length === 0) {
      return fallback;
    }

    const values = answers.map(({ answer }) => answer);
    if (values && values.length > 0) {
      return values.join(', ');
    }

    return fallback;
  }
}
