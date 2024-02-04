import {
    SurveyQuestion,
    SurveyQuestionCreateInput,
    SurveyQuestionTypeEnum,
} from "@/generated/graphql";
import { Option } from "@/modules/surveys/components/studio/create/editor-panel/questions/attributes/ReactSelect";
import { LogicConditionEnum, QuestionOption, QuestionSettings } from "@/types";
import {
    FormFieldType,
    LogicBooleanCondition,
    LogicOperator,
} from "@integraflow/web/src/types";
import { generateUniqueId } from ".";

const CSATOptions = [
    "Very unsatisfied",
    "Unsatisfied",
    "Neutral",
    "Satisfied",
    "Very satisfied",
];

export const createFormFields = (): QuestionOption[] => {
    return [
        {
            id: generateUniqueId(),
            orderNumber: 1,
            label: "First name",
            required: false,
            type: FormFieldType.FIRST_NAME,
        },
        {
            id: generateUniqueId(),
            orderNumber: 2,
            label: "Last name",
            required: false,
            type: FormFieldType.LAST_NAME,
        },
    ];
};

export const createRangeOptions = (
    type: SurveyQuestionTypeEnum,
    length: number,
): QuestionOption[] => {
    const options = [];

    for (let i = 1; i <= length; i++) {
        options.push({
            id: crypto.randomUUID(),
            orderNumber: i,
            label:
                type === SurveyQuestionTypeEnum.Csat
                    ? CSATOptions[i - 1]
                    : `${i}`,
        });
    }

    return options;
};

export const createOptions = (
    type: SurveyQuestionTypeEnum,
): QuestionOption[] | undefined => {
    if (type === SurveyQuestionTypeEnum.Form) {
        return createFormFields();
    }

    if (
        type === SurveyQuestionTypeEnum.Rating ||
        type === SurveyQuestionTypeEnum.Csat ||
        type === SurveyQuestionTypeEnum.Nps ||
        type === SurveyQuestionTypeEnum.NumericalScale ||
        type === SurveyQuestionTypeEnum.SmileyScale
    ) {
        const length = type === SurveyQuestionTypeEnum.Nps ? 10 : 5;
        return createRangeOptions(type, length);
    }

    if (
        type === SurveyQuestionTypeEnum.Single ||
        type === SurveyQuestionTypeEnum.Multiple ||
        type === SurveyQuestionTypeEnum.Dropdown
    ) {
        return [
            {
                id: crypto.randomUUID(),
                orderNumber: 1,
                label: "Answer 1",
                comment: false,
            },
            {
                id: crypto.randomUUID(),
                orderNumber: 2,
                label: "Answer 2",
                comment: false,
            },
        ];
    }
};

export const createSettings = (
    type: SurveyQuestionTypeEnum,
): QuestionSettings | undefined => {
    if (type === SurveyQuestionTypeEnum.Form) {
        return {
            disclaimer: false,
            consent: false,
            logic: [],
        };
    }

    if (type === SurveyQuestionTypeEnum.Multiple) {
        return {
            randomize: false,
            randomizeExceptLast: false,
            choice: {
                min: 1,
                max: 2,
            },
            logic: [],
        };
    }
    if (
        type === SurveyQuestionTypeEnum.Single ||
        type === SurveyQuestionTypeEnum.Dropdown
    ) {
        return {
            randomize: false,
            randomizeExceptLast: false,
            logic: [],
        };
    }

    if (type === SurveyQuestionTypeEnum.Text) {
        return {
            singleLine: false,
            logic: [],
        };
    }
    if (type === SurveyQuestionTypeEnum.Boolean) {
        return {
            positiveText: "Good",
            negativeText: "Bad",
            shape: "thumb",
            logic: [],
        };
    }
    if (type === SurveyQuestionTypeEnum.Rating) {
        return {
            rightText: "Very Good",
            leftText: "Very Bad",
            shape: "star",
            logic: [],
        };
    }
    if (
        type === SurveyQuestionTypeEnum.Csat ||
        type === SurveyQuestionTypeEnum.NumericalScale ||
        type === SurveyQuestionTypeEnum.Nps
    ) {
        return {
            rightText: "Very Good",
            leftText: "Very Bad",
            logic: [],
        };
    }
    if (type === SurveyQuestionTypeEnum.SmileyScale) {
        return {
            rightText: "Very Satisfied",
            leftText: "Very Unsatisfied",
            count: 5,
            logic: [],
        };
    }
    if (type === SurveyQuestionTypeEnum.Date) {
        return {
            logic: [],
        };
    }
};

export const getDefaultValues = (
    type: SurveyQuestionTypeEnum,
): Partial<SurveyQuestionCreateInput> => {
    return {
        label: "",
        orderNumber: 1,
        options: createOptions(type),
        settings: createSettings(type),
    };
};

const MultipleLogicConditions = [
    {
        label: "does not include any",
        value: LogicConditionEnum.DOES_NOT_INCLUDE_ANY,
    },
    {
        label: "includes all",
        value: LogicConditionEnum.INCLUDES_ALL,
    },
    {
        label: "includes any",
        value: LogicConditionEnum.INCLUDES_ANY,
    },
    {
        label: "is exactly",
        value: LogicConditionEnum.IS_EXACTLY,
    },
    {
        label: "has any value",
        value: LogicConditionEnum.HAS_ANY_VALUE,
    },
];
const SingleLogicConditions = [
    {
        label: "is",
        value: LogicConditionEnum.IS,
    },
    {
        label: "is not",
        value: LogicConditionEnum.IS_NOT,
    },
    {
        label: "has any value",
        value: LogicConditionEnum.HAS_ANY_VALUE,
    },
];

const BooleanLogicConditions = [
    {
        label: "is false",
        value: LogicConditionEnum.IS_FALSE,
    },
    {
        label: "is true",
        value: LogicConditionEnum.IS_TRUE,
    },
    {
        label: "has any value",
        value: LogicBooleanCondition.HAS_ANY_VALUE,
    },
];

const DateLogicConditions = [
    {
        label: "answered",
        value: LogicConditionEnum.ANSWERED,
    },
    {
        label: "not answered",
        value: LogicConditionEnum.NOT_ANSWERED,
    },
    {
        label: "has any value",
        value: LogicConditionEnum.HAS_ANY_VALUE,
    },
];

const RangeLogicConditions = [
    {
        label: "is",
        value: LogicConditionEnum.IS,
    },
    {
        label: "is not",
        value: LogicConditionEnum.IS_NOT,
    },
    {
        label: "is between",
        value: LogicConditionEnum.BETWEEN,
    },
    {
        label: "has any value",
        value: LogicConditionEnum.HAS_ANY_VALUE,
    },
];
const FormLogicConditions = [
    {
        label: "is filled in",
        value: LogicConditionEnum.IS_FILLED_IN,
    },
    {
        label: "is not filled in",
        value: LogicConditionEnum.IS_NOT_FILLED_IN,
    },
    {
        label: "has any value",
        value: LogicConditionEnum.HAS_ANY_VALUE,
    },
];

const TextLogicConditions = [
    {
        label: "answer contains",
        value: LogicConditionEnum.ANSWER_CONTAINS,
    },
    {
        label: "answer does not contain",
        value: LogicConditionEnum.ANSWER_DOES_NOT_CONTAIN,
    },
    {
        label: "question is answered",
        value: LogicConditionEnum.ANSWERED,
    },
    {
        label: "question is not answered",
        value: LogicConditionEnum.NOT_ANSWERED,
    },
    {
        label: "has any value",
        value: LogicConditionEnum.HAS_ANY_VALUE,
    },
];

export const getLogicConditions = (type: SurveyQuestionTypeEnum) => {
    if (type === SurveyQuestionTypeEnum.Multiple) {
        return MultipleLogicConditions;
    }
    if (
        type === SurveyQuestionTypeEnum.Single ||
        type === SurveyQuestionTypeEnum.Dropdown
    ) {
        return SingleLogicConditions;
    }
    if (type === SurveyQuestionTypeEnum.Boolean) {
        return BooleanLogicConditions;
    }
    if (type === SurveyQuestionTypeEnum.Date) {
        return DateLogicConditions;
    }
    if (type === SurveyQuestionTypeEnum.Text) {
        return TextLogicConditions;
    }
    if (
        type === SurveyQuestionTypeEnum.Rating ||
        type === SurveyQuestionTypeEnum.NumericalScale ||
        type === SurveyQuestionTypeEnum.Nps ||
        type === SurveyQuestionTypeEnum.SmileyScale ||
        type === SurveyQuestionTypeEnum.Csat
    ) {
        return RangeLogicConditions;
    }
    if (type === SurveyQuestionTypeEnum.Form) {
        return FormLogicConditions;
    }
};

export const getLogicOperator = (condition: LogicConditionEnum) => {
    if (
        condition === LogicConditionEnum.ANSWER_CONTAINS ||
        condition === LogicConditionEnum.ANSWER_DOES_NOT_CONTAIN ||
        condition === LogicConditionEnum.ANSWERED ||
        condition === LogicConditionEnum.NOT_ANSWERED ||
        condition === LogicConditionEnum.HAS_ANY_VALUE
    ) {
        return LogicOperator.AND;
    } else if (
        condition === LogicConditionEnum.IS_EXACTLY ||
        condition === LogicConditionEnum.INCLUDES_ALL ||
        condition === LogicConditionEnum.BETWEEN ||
        condition === LogicConditionEnum.IS_FILLED_IN ||
        condition === LogicConditionEnum.IS_NOT_FILLED_IN ||
        condition === LogicConditionEnum.DOES_NOT_INCLUDE_ANY ||
        condition === LogicConditionEnum.INCLUDES_ANY ||
        condition === LogicConditionEnum.IS_NOT ||
        condition === LogicConditionEnum.IS
    ) {
        return LogicOperator.OR;
    } else {
        return LogicOperator.OR;
    }
};

export const questionOptions = (question: SurveyQuestion) => {
    return question.options.map((option: Option) => ({
        value: option.id,
        label: option.label,
    }));
};

export const generateNumericalOptions = (
    start: number,
    end: number,
): { label: string; value: number }[] => {
    const options = [];
    for (let i = start; i <= end; i++) {
        options.push({
            label: i.toString(),
            value: i,
        });
    }
    return options;
};

export const changeableOperator = (question: SurveyQuestion) => {
    if (
        question.type === SurveyQuestionTypeEnum.Text ||
        question.type === SurveyQuestionTypeEnum.Form
    ) {
        return true;
    } else {
        return false;
    }
};
