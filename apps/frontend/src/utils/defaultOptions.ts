import {
    SurveyQuestionCreateInput,
    SurveyQuestionTypeEnum,
} from "@/generated/graphql";
import { QuestionOption, QuestionSettings } from "@/types";
import {
    FormFieldType,
    LogicBooleanCondition,
    LogicDateCondition,
    LogicFormCondition,
    LogicMultipleCondition,
    LogicOperator,
    LogicRangeCondition,
    LogicSingleCondition,
    LogicTextCondition,
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
        value: LogicMultipleCondition.DOES_NOT_INCLUDE_ANY,
    },
    {
        label: "includes all",
        value: LogicMultipleCondition.INCLUDES_ALL,
    },
    {
        label: "includes any",
        value: LogicMultipleCondition.INCLUDES_ANY,
    },
    {
        label: "is exactly",
        value: LogicMultipleCondition.IS_EXACTLY,
    },
    {
        label: "has any value",
        value: LogicMultipleCondition.HAS_ANY_VALUE,
    },
];
const SingleLogicConditions = [
    {
        label: "is",
        value: LogicSingleCondition.IS,
    },
    {
        label: "is not",
        value: LogicSingleCondition.IS_NOT,
    },
    {
        label: "has any value",
        value: LogicSingleCondition.HAS_ANY_VALUE,
    },
];

const BooleanLogicConditions = [
    {
        label: "is false",
        value: LogicBooleanCondition.IS_FALSE,
    },
    {
        label: "is true",
        value: LogicBooleanCondition.IS_TRUE,
    },
    {
        label: "has any value",
        value: LogicBooleanCondition.HAS_ANY_VALUE,
    },
];

const DateLogicConditions = [
    {
        label: "answered",
        value: LogicDateCondition.QUESTION_IS_ANSWERED,
    },
    {
        label: "not answered",
        value: LogicDateCondition.QUESTION_IS_NOT_ANSWERED,
    },
    {
        label: "has any value",
        value: LogicDateCondition.HAS_ANY_VALUE,
    },
];

const RangeLogicConditions = [
    {
        label: "is",
        value: LogicRangeCondition.IS,
    },
    {
        label: "is not",
        value: LogicRangeCondition.IS_NOT,
    },
    {
        label: "is between",
        value: LogicRangeCondition.IS_BETWEEN,
    },
    {
        label: "has any value",
        value: LogicRangeCondition.HAS_ANY_VALUE,
    },
];
const FormLogicConditions = [
    {
        label: "is filled in",
        value: LogicFormCondition.IS_FILLED_IN,
    },
    {
        label: "is not filled in",
        value: LogicFormCondition.IS_NOT_FILLED_IN,
    },
    {
        label: "has any value",
        value: LogicFormCondition.HAS_ANY_VALUE,
    },
];

const TextLogicConditions = [
    {
        label: "answer contains",
        value: LogicTextCondition.ANSWER_CONTAINS,
    },
    {
        label: "answer does not contain",
        value: LogicTextCondition.ANSWER_DOES_NOT_CONTAIN,
    },
    {
        label: "question is answered",
        value: LogicTextCondition.QUESTION_IS_ANSWERED,
    },
    {
        label: "question is not answered",
        value: LogicTextCondition.QUESTION_IS_NOT_ANSWERED,
    },
    {
        label: "has any value",
        value: LogicTextCondition.HAS_ANY_VALUE,
    },
];

export const getLogicConditions = (type: SurveyQuestionTypeEnum) => {
    if (type === SurveyQuestionTypeEnum.Multiple) {
        return MultipleLogicConditions;
    }
    if (type === SurveyQuestionTypeEnum.Single) {
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
        type === SurveyQuestionTypeEnum.Csat ||
        type === SurveyQuestionTypeEnum.NumericalScale ||
        type === SurveyQuestionTypeEnum.Nps ||
        type === SurveyQuestionTypeEnum.SmileyScale
    ) {
        return RangeLogicConditions;
    }
    if (type === SurveyQuestionTypeEnum.Form) {
        return FormLogicConditions;
    }
};

export const getLogicOperator = (condition: string) => {
    if (
        condition === "does_not_include_any" ||
        condition === "includes_any" ||
        condition === "is_not"
    ) {
        return LogicOperator.OR;
    } else if (
        condition === "is_exactly" ||
        condition === "includes_all" ||
        condition === "is" ||
        condition === "is_between" ||
        condition === "is_filled_in" ||
        condition === "is_not_filled_in" ||
        condition === "answer_contains" ||
        condition === "answer_does_not_contain"
    ) {
        return LogicOperator.AND;
    } else {
        return "";
    }
};

