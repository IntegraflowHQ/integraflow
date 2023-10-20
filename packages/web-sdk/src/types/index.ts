export enum AnswerType {
  SINGLE = 'single',
  MULTIPLE = 'multiple',
  TEXT = 'text',
  DATE = 'date',
  CSAT = 'csat',
  SMILEY_SCALE = 'smiley_scale',
  NUMERICAL_SCALE = 'numerical_scale',
  RATING = 'rating',
  NPS = 'nps',
  FORM = 'form',
  CTA = 'cta',
  BOOLEAN = 'boolean',
  DROPDOWN = 'dropdown'
}

export enum FormFieldType {
  FIRST_NAME = 'first_name',
  LAST_NAME = 'last_name',
  EMAIL = 'email',
  ORGANIZATION = 'organization',
  DEPARTMENT = 'department',
  JOB_TITLE = 'job_title',
  PHONE = 'phone',
  WEBSITE = 'website',
  COUNTRY = 'country',
  ADDRESS_ONE = 'address_one',
  ADDRESS_TWO = 'address_two',
  CITY = 'city',
  STATE = 'state',
  ZIP = 'zip',
  FAX = 'fax',
  ANNUAL_REVENUE = 'annual_revenue',
  EMPLOYEES = 'employees',
  INDUSTRY = 'industry',
  CONFIRMATION = 'confirmation',
  SECURITY_INFO = 'security_info',
  COMMENT = 'comment'
}

export enum LogicOperator {
  OR = 'or',
  AND = 'and',
}

export enum LogicFormCondition {
  IS_FILLED_IN = 'filled',
  IS_NOT_FILLED_IN = 'not_filled',
  HAS_ANY_VALUE = 'any_value',
}

export enum LogicRangeCondition {
  IS = 'is',
  IS_NOT = 'is_not',
  IS_BETWEEN = 'between',
  HAS_ANY_VALUE = 'any_value',
}

export enum LogicBooleanCondition {
  IS_TRUE = 'is_true',
  IS_FALSE = 'is_false',
  HAS_ANY_VALUE = 'any_value',
}

export enum LogicDateCondition {
  HAS_ANY_VALUE = 'any_value',
  QUESTION_IS_ANSWERED = 'answered',
  QUESTION_IS_NOT_ANSWERED = 'not_answered',
}

export enum LogicMultipleCondition {
  IS_EXACTLY = 'exactly',
  INCLUDES_ALL = 'includes_all',
  INCLUDES_ANY = 'includes_any',
  DOES_NOT_INCLUDE_ANY = 'not_include_any',
  HAS_ANY_VALUE = 'any_value',
}

export enum LogicTextCondition {
  ANSWER_CONTAINS = 'contains',
  ANSWER_DOES_NOT_CONTAIN = 'not_contain',
  HAS_ANY_VALUE = 'any_value',
  QUESTION_IS_ANSWERED = 'answered',
  QUESTION_IS_NOT_ANSWERED = 'not_answered',
}

export enum LogicSingleCondition {
  IS = 'is',
  IS_NOT = 'is_not',
  HAS_ANY_VALUE = 'any_value',
}

export enum CTAType {
  LINK = 'link',
  NEXT = 'next',
  CLOSE = 'close',
  HIDDEN = 'hidden',
}

export type PlacementType =
  | 'bottomLeft'
  | 'bottomRight'
  | 'topLeft'
  | 'topRight'
  | 'center';

export type ID = string | number;

export interface SurveyAnswer {
  finished?: boolean;
  ctaSuccess?: boolean;
  fieldType?: FormFieldType;
  completionRate?: number;
  answer?: string;
  answerId?: ID;
}

export interface QuestionOption {
  id: ID;
  orderNumber: number;
  label: string;
}

export interface FormField extends QuestionOption {
  type: FormFieldType;
  required: boolean;
}

export interface QuestionLogic {
  id?: ID;
  orderNumber: number;
  destination: ID;
}

export interface FormLogic extends QuestionLogic {
  operator: LogicOperator;
  groups: {
    condition: LogicFormCondition;
    operator: LogicOperator;
    fields: ID[];
  }[];
}

export interface RangeLogic extends QuestionLogic {
  condition: LogicRangeCondition;
  operator?: LogicOperator;
  values?: ID[];
}

export interface BooleanLogic extends QuestionLogic {
  condition: LogicBooleanCondition;
}

export interface DateLogic extends QuestionLogic {
  condition: LogicDateCondition;
  operator?: LogicOperator;
  values?: string[];
}

export interface MultipleLogic extends QuestionLogic {
  condition: LogicMultipleCondition;
  operator?: LogicOperator;
  values?: ID[];
}

export interface SingleLogic extends QuestionLogic {
  condition: LogicSingleCondition;
  operator?: LogicOperator;
  values?: ID[];
}

export interface TextLogic extends QuestionLogic {
  condition: LogicTextCondition;
  operator?: LogicOperator;
  values?: string[];
}

export interface BooleanLogic extends QuestionLogic {
  condition: LogicBooleanCondition;
}

export interface QuestionSettings<T> {
  logic?: T[];
}

export interface FormSettings extends QuestionSettings<FormLogic> {
  disclaimer?: boolean;
  disclaimerText?: string;
  consent?: boolean;
  consentText?: string;
}

export interface RangeSettings extends QuestionSettings<RangeLogic> {
  rightText?: string;
  leftText?: string;
  count?: number;
  shape?: 'star' | 'thumb' | 'heart';
}

export interface BooleanSettings extends QuestionSettings<BooleanLogic> {
  positiveText?: string;
  negativeText?: string;
  shape?: 'button' | 'thumb';
}

export interface CTASettings {
  type: CTAType;
  text?: string;
  link?: string;
}

export interface DateSettings extends QuestionSettings<DateLogic> {}

export interface MultipleSettings extends QuestionSettings<MultipleLogic> {
  randomize?: boolean;
  randomizeExceptLast?: boolean;
  choice?: {
    min?: number;
    max?: number;
  }
}

export interface SingleSettings extends QuestionSettings<SingleLogic> {
  randomize?: boolean;
  randomizeExceptLast?: boolean;
}

export interface TextSettings extends QuestionSettings<TextLogic> {
  singleLine?: boolean;
}

export interface BooleanSettings extends QuestionSettings<BooleanLogic> {
  positiveText?: string;
  negativeText?: string;
  shape?: 'button' | 'thumb';
}

export interface Question {
  id: string | number;
  orderNumber: number;
  label: string;
  description?: string;
  type: AnswerType;
  options?: (QuestionOption | FormField)[];
  maxPath: number;
  settings:
    | FormSettings
    | RangeSettings
    | CTASettings
    | DateSettings
    | MultipleSettings
    | SingleSettings
    | TextSettings
    | BooleanSettings;
}

export enum FilterOperator {
  IN = 'in',
  IS = 'is',
  IS_NOT = 'is_not',
  STARTS_WITH = 'starts_with',
  ENDS_WITH = 'ends_with',
  CONTAINS = 'contains',
  DOES_NOT_CONTAIN = 'not_contain',
  IS_UNKNOWN = 'is_unknown',
  HAS_ANY_VALUE = 'any_value',
  GREATER_THAN = 'greater_than',
  LESS_THAN = 'less_than',
  IS_TRUE = 'is_true',
  IS_FALSE = 'is_false',
}

export type FilterValue = number | boolean | string | string[];

export interface Trigger {
  delay?: number;
  conditions?: {
    event: string;
    operator: LogicOperator;
    filters?: {
      property: string;
      operator: FilterOperator;
      value: FilterValue;
    }[];
  }[];
}

export interface Audience {
  operator: LogicOperator;
  filters: {
    attribute: string;
    operator: FilterOperator;
    value: FilterValue;
  }[];
}

export interface SurveySettings {
  recurring: boolean;
  recurringPeriod: number;
  placement?: PlacementType;
  showProgressBar: boolean;
  close?: boolean;
  submitText?: string;
  showBranding?: boolean;
}

export interface Theme {
  question?: string;
  answer?: string;
  button?: string;
  background?: string;
  progressBar?: string;
}

export interface Survey {
  id: ID;
  name?: string;
  type?: string;
  questions: Question[];
  trigger?: Trigger;
  audience?: Audience;
  settings: SurveySettings;
  theme?: Theme;
  answeredCount?: number;
}

export type Jsonish =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Jsonish }
  | { toJSON: () => any }
  | Jsonish[]
  | undefined;

export interface UserAttributes {
  id?: ID;
  [key: string]: Jsonish;
}

export interface EventProperties {
  [key: string]: Jsonish;
}

export interface Event {
  event: string;
  uuid: string;
  timestamp: number;
  properties?: EventProperties;
  userId?: ID;
}

export interface State {
  surveys?: Survey[];
  installId?: string;
  user?: UserAttributes;
  seenSurveyIds?: Set<ID>;
  lastPresentationTimes?: Map<ID, Date>;
  surveyAnswers?: { [surveyId: ID]: Map<ID, SurveyAnswer[]>; }
}

export interface Listeners {
  onEventTracked?: (payload: Event) => void;
  onAudienceChanged?: (audience: UserAttributes) => void;
  onSurveyDisplayed?: (surveyId: ID) => void;
  onSurveyClosed?: (surveyId: ID) => void;
  onQuestionAnswered?: (
    surveyId: ID,
    questionId: ID,
    answers: SurveyAnswer[]
  ) => void;
  onSurveyCompleted?: (surveyId: ID) => void;
}

export interface Configuration extends Listeners {
  apiHost?: string;
  appKey?: string;
  surveys?: Survey[];
  debug?: boolean;
}
