import {
  AnswerType,
  BooleanLogic,
  DateLogic,
  FormLogic,
  ID,
  LogicBooleanCondition,
  LogicDateCondition,
  LogicFormCondition,
  LogicMultipleCondition,
  LogicOperator,
  LogicRangeCondition,
  LogicSingleCondition,
  LogicTextCondition,
  MultipleLogic,
  Question,
  QuestionSettings,
  RangeLogic,
  SingleLogic,
  SurveyAnswer,
  TextLogic
} from '../types';
import { propConditionsMatched } from '../utils';

const resolveTextLogic = (answer: string | null, textLogic: TextLogic): boolean => {
  const { condition, operator = LogicOperator.OR, values = [] } = textLogic;
  if (!condition) {
    return false;
  }

  const matches = [];

  let conditionMatched = false;
  switch (condition) {
    case LogicTextCondition.ANSWER_CONTAINS:
      for (const value of values) {
        matches.push(answer ? answer.toLowerCase().includes(value?.toLowerCase()) : false);
      }

      conditionMatched = propConditionsMatched(matches, operator);
      break;

    case LogicTextCondition.ANSWER_DOES_NOT_CONTAIN:
      for (const value of values) {
        matches.push(answer ? !answer.toLowerCase().includes(value?.toLowerCase()) : false);
      }

      conditionMatched = propConditionsMatched(matches, operator);
      break;

    case LogicTextCondition.QUESTION_IS_ANSWERED:
      conditionMatched = !!answer;
      break;

    case LogicTextCondition.QUESTION_IS_NOT_ANSWERED:
      conditionMatched = !answer;
      break;

    case LogicTextCondition.HAS_ANY_VALUE:
      conditionMatched = true;
      break;

    default:
      conditionMatched = false;
      break;
  }

  return conditionMatched;
};

const resolveDateLogic = (answer: string | null, dateLogic: DateLogic): boolean => {
  const { condition } = dateLogic;
  if (!condition) {
    return false;
  }

  let conditionMatched = false;
  switch (condition) {
    case LogicDateCondition.QUESTION_IS_ANSWERED:
      conditionMatched = !!answer;
      break;

    case LogicDateCondition.QUESTION_IS_NOT_ANSWERED:
      conditionMatched = !answer;
      break;

    case LogicDateCondition.HAS_ANY_VALUE:
      conditionMatched = true;
      break;

    default:
      conditionMatched = false;
      break;
  }

  return conditionMatched;
};

const resolveRangeLogic = (answerId: ID | null, rangeLogic: RangeLogic): boolean => {
  const { condition, values = [] } = rangeLogic;
  if (!condition) {
    return false;
  }

  let conditionMatched = false;
  switch (condition) {
    case LogicRangeCondition.IS:
      conditionMatched = answerId ? values?.includes(answerId) : false;
      break;

    case LogicRangeCondition.IS_NOT:
      conditionMatched = answerId ? !values?.includes(answerId) : false;
      break;
    
    case LogicRangeCondition.IS_BETWEEN:
      if (values.length === 2) {
        conditionMatched = answerId ? (answerId <= values[1] && values[0] <= answerId) : false;
      } else {
        conditionMatched = false;
      }
      break;

    case LogicRangeCondition.HAS_ANY_VALUE:
      conditionMatched = true;
      break;

    default:
      conditionMatched = false;
      break;
  }

  return conditionMatched;
};

const resolveBooleanLogic = (answer: number | null, booleanLogic: BooleanLogic): boolean => {
  const { condition } = booleanLogic;
  if (!condition) {
    return false;
  }

  let conditionMatched = false;
  switch (condition) {
    case LogicBooleanCondition.IS_TRUE:
      conditionMatched = Boolean(answer) === true;
      break;

    case LogicBooleanCondition.IS_FALSE:
      conditionMatched = Boolean(answer) === false;
      break;

    case LogicBooleanCondition.HAS_ANY_VALUE:
      conditionMatched = true;
      break;

    default:
      conditionMatched = false;
      break;
  }

  return conditionMatched;
};

const resolveSingleLogic = (answerId: ID | null, singleLogic: SingleLogic): boolean => {
  const { condition, values = [] } = singleLogic;
  if (!condition) {
    return false;
  }

  let conditionMatched = false;
  switch (condition) {
    case LogicSingleCondition.IS:
      conditionMatched = answerId ? values.includes(answerId) : false;
      break;

    case LogicSingleCondition.IS_NOT:
      conditionMatched = answerId ? !values.includes(answerId) : false;
      break;

    case LogicSingleCondition.HAS_ANY_VALUE:
      conditionMatched = true;
      break;

    default:
      conditionMatched = false;
      break;
  }

  return conditionMatched;
};

const resolveMultipleLogic = (answerIds: ID[] | null, multipleLogic: MultipleLogic): boolean => {
  const { condition, values = [] } = multipleLogic;
  if (!condition) {
    return false;
  }

  let conditionMatched = false;
  switch (condition) {
    case LogicMultipleCondition.IS_EXACTLY:
      conditionMatched = answerIds ? (answerIds.length === values.length && answerIds.every((answerId) => values.includes(answerId))) : false;
      break;

    case LogicMultipleCondition.INCLUDES_ALL:
      conditionMatched = answerIds ? values.every((value) => answerIds.includes(value)) : false;
      break;

    case LogicMultipleCondition.INCLUDES_ANY:
      conditionMatched = answerIds ? values.some((value) => answerIds.includes(value)) : false;
      break;

    case LogicMultipleCondition.DOES_NOT_INCLUDE_ANY:
      conditionMatched = answerIds ? !(values.some((value) => answerIds.includes(value))) : false;
      break;

    case LogicMultipleCondition.HAS_ANY_VALUE:
      conditionMatched = true;
      break;

    default:
      conditionMatched = false;
      break;
  }

  return conditionMatched;
};

const resolveFormLogic = (answers: { [key: ID]: string | null }, formLogic: FormLogic): boolean => {
  const { operator, groups } = formLogic;
  if (!operator || !groups) {
    return false;
  }

  const matches = [];

  for (const group of groups) {
    matches.push(resolveFormGroup(answers, group));
  }

  return propConditionsMatched(matches, operator);
};

const resolveFormGroup = (answers: { [key: ID]: string | null }, group: FormLogic['groups'][0]): boolean => {
  const { condition } = group;
  if (!condition) {
    return false;
  }

  let conditionMatched = false;
  switch (condition) {
    case LogicFormCondition.IS_FILLED_IN:
      conditionMatched = resolveIsFilledInFormLogic(answers, group);
      break;
    case LogicFormCondition.IS_NOT_FILLED_IN:
      conditionMatched = resolveIsNotFilledInFormLogic(answers, group);
      break;
    case LogicFormCondition.HAS_ANY_VALUE:
      conditionMatched = resolveHasAnyValueFormLogic(answers, group);
      break;
    default:
      conditionMatched = false;
      break;
  }

  return conditionMatched;
};

const resolveIsFilledInFormLogic = (answers: { [key: ID]: string | null }, group: FormLogic['groups'][0]): boolean => {
  const { operator, fields } = group;
  if (!operator || !fields) {
    return false;
  }

  const matches = [];

  for (const field of fields) {
    const value = answers[field];
    matches.push(!!value);
  }

  return propConditionsMatched(matches, operator);
}

const resolveIsNotFilledInFormLogic = (answers: { [key: ID]: string | null }, group: FormLogic['groups'][0]): boolean => {
  const { operator, fields } = group;
  if (!operator || !fields) {
    return false;
  }

  const matches = [];

  for (const field of fields) {
    const value = answers[field];
    matches.push(!value);
  }

  return propConditionsMatched(matches, operator);
}

const resolveHasAnyValueFormLogic = (answers: { [key: ID]: string | null }, group: FormLogic['groups'][0]): boolean => {
  const { operator, fields } = group;
  if (!operator || !fields) {
    return false;
  }

  const matches = [];

  for (const field of fields) {
    matches.push(answers.hasOwnProperty(field));
  }

  return propConditionsMatched(matches, operator);
}

export class SurveyLogic {
  getNextQuestionId = (question: Question, answers: SurveyAnswer[]): ID | null => {
    const { type, settings } = question;

    const logic = (settings as QuestionSettings<any>).logic;
    if (!logic) {
      return null;
    }
  
    let nextQuestionId = null;
    switch (type) {
      case AnswerType.TEXT:
        nextQuestionId = this.getTextQuestionDestination(answers[0].answer ?? null, (logic as TextLogic[]));
        break;
      case AnswerType.SINGLE:
        nextQuestionId = this.getSingleQuestionDestination(answers[0].answerId ?? null, (logic as SingleLogic[]));
        break;
      case AnswerType.MULTIPLE:
        const answerIds = (answers || []).map(answer => answer.answerId!).filter(answer => !!answer);
        nextQuestionId = this.getMultipleQuestionDestination(answerIds ?? null, (logic as MultipleLogic[]));
        break;
      case AnswerType.DATE:
        nextQuestionId = this.getDateQuestionDestination(answers[0].answer ?? null, (logic as DateLogic[]));
        break;
      case AnswerType.BOOLEAN:
        nextQuestionId = this.getBooleanQuestionDestination(answers[0].answer ? parseInt(answers[0].answer) : null, (logic as BooleanLogic[]));
        break;
      case AnswerType.FORM:
        const answerMap: { [key: ID]: string | null; } = {};
        for (const ans of answers) {
          const { answer, answerId } = ans;
          if (answerId) {
            answerMap[answerId] = answer ?? null;
          }
        }

        nextQuestionId = this.getFormQuestionDestination(answerMap, (logic as FormLogic[]));
        break;
      case AnswerType.CSAT:
      case AnswerType.NPS:
      case AnswerType.NUMERICAL_SCALE:
      case AnswerType.RATING:
      case AnswerType.SMILEY_SCALE:
        nextQuestionId = this.getRangeQuestionDestination((answers[0].answerId as number) ?? null, (logic as RangeLogic[]));
        break;
    }

    return nextQuestionId;
  }

  private getTextQuestionDestination(answer: string | null, logic: TextLogic[]): ID | null {
    const sortedLogic = logic.sort((a, b) => a.orderNumber - b.orderNumber);

    let nextId = null;
    for (const textLogic of sortedLogic) {
      if (resolveTextLogic(answer, textLogic)) {
        nextId = textLogic.destination;
        break;
      }
    }

    return nextId;
  }

  private getDateQuestionDestination(answer: string | null, logic: DateLogic[]): ID | null {
    const sortedLogic = logic.sort((a, b) => a.orderNumber - b.orderNumber);

    let nextId = null;
    for (const dateLogic of sortedLogic) {
      if (resolveDateLogic(answer, dateLogic)) {
        nextId = dateLogic.destination;
        break;
      }
    }

    return nextId;
  }

  private getRangeQuestionDestination(answerId: ID | null, logic: RangeLogic[]): ID | null {
    const sortedLogic = logic.sort((a, b) => a.orderNumber - b.orderNumber);

    let nextId = null;
    for (const rangeLogic of sortedLogic) {
      if (resolveRangeLogic(answerId, rangeLogic)) {
        nextId = rangeLogic.destination;
        break;
      }
    }

    return nextId;
  }

  private getBooleanQuestionDestination(answer: number | null, logic: BooleanLogic[]): ID | null {
    const sortedLogic = logic.sort((a, b) => a.orderNumber - b.orderNumber);

    let nextId = null;
    for (const booleanLogic of sortedLogic) {
      if (resolveBooleanLogic(answer, booleanLogic)) {
        nextId = booleanLogic.destination;
        break;
      }
    }

    return nextId;
  }

  private getSingleQuestionDestination(answerId: ID | null, logic: SingleLogic[]): ID | null {
    const sortedLogic = logic.sort((a, b) => a.orderNumber - b.orderNumber);

    let nextId = null;
    for (const singleLogic of sortedLogic) {
      if (resolveSingleLogic(answerId, singleLogic)) {
        nextId = singleLogic.destination;
        break;
      }
    }

    return nextId;
  }

  private getMultipleQuestionDestination(answerIds: ID[] | null, logic: MultipleLogic[]): ID | null {
    const sortedLogic = logic.sort((a, b) => a.orderNumber - b.orderNumber);

    let nextId = null;
    for (const multipleLogic of sortedLogic) {
      if (resolveMultipleLogic(answerIds, multipleLogic)) {
        nextId = multipleLogic.destination;
        break;
      }
    }

    return nextId;
  }

  private getFormQuestionDestination(answers: { [key: ID]: string | null }, logic: FormLogic[]): ID | null {
    const sortedLogic = logic.sort((a, b) => a.orderNumber - b.orderNumber);

    let nextId = null;
    for (const formLogic of sortedLogic) {
      if (resolveFormLogic(answers, formLogic)) {
        nextId = formLogic.destination;
        break;
      }
    }

    return nextId;
  }
}
