import { Configuration, Listeners, Survey, State } from '../types';

type SdkEventType = 'eventTracked' | 'audienceUpdated';
export type SdkEvent<T = any> = { type: SdkEventType; data: T };
type SdkEventHandler = (event: SdkEvent) => void;

export class Context {
  readonly debug: boolean;
  readonly listeners: Listeners;

  private readonly subscribers: { [key: string]: SdkEventHandler[] };

  surveys: Survey[];
  state: State | null;

  constructor(config: Configuration) {
    this.surveys = config.surveys ?? [];

    this.debug = config.debug || false;
    this.listeners = {
      onAudienceChanged: config.onAudienceChanged,
      onEventTracked: config.onEventTracked,
      onSurveyDisplayed: config.onSurveyDisplayed,
      onSurveyClosed: config.onSurveyClosed,
      onQuestionAnswered: config.onQuestionAnswered,
      onSurveyCompleted: config.onSurveyCompleted
    };

    this.subscribers = {};  
    this.state = null;
  }

  setState(state: State) {
    this.state = state;
  }

  subscribe(event: SdkEventType, handler: SdkEventHandler) {
    if (!this.subscribers[event]) {
      this.subscribers[event] = [];
    }

    if (this.subscribers[event].indexOf(handler) > -1) {
      return;
    }

    this.subscribers[event].push(handler);
  }

  broadcast(event: SdkEventType, data: any) {
    if (!this.subscribers[event]) {
      return;
    }

    for (let i = 0; i < this.subscribers[event].length; ++i) {
      this.subscribers[event][i]({
        type: event,
        data
      });
    }
  }
}
