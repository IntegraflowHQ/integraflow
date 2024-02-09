import { SurveyQuestionTypeEnum } from "@/generated/graphql";
import { Option } from "@/modules/surveys/components/studio/create/editor-panel/questions/attributes/ReactSelect";
import { LogicConditionEnum, ParsedQuestion } from "@/types";
import { LogicOperator } from "@integraflow/web/src/types";
import { SingleValue } from "react-select";

export const questionsWithoutSettingsTab = [
    SurveyQuestionTypeEnum.Csat,
    SurveyQuestionTypeEnum.CES,
];

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
        value: LogicConditionEnum.HAS_ANY_VALUE,
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

export const conditionOptions = (type: SurveyQuestionTypeEnum) => {
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
        type === SurveyQuestionTypeEnum.Csat ||
        type === SurveyQuestionTypeEnum.CES
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

export const changeableOperator = (type: SurveyQuestionTypeEnum) => {
    if (
        type === SurveyQuestionTypeEnum.Text ||
        type === SurveyQuestionTypeEnum.Form
    ) {
        return true;
    } else {
        return false;
    }
};

export const destinationOptions = (
    questions: ParsedQuestion[],
    openQuestion: ParsedQuestion,
) => {
    return [
        ...questions
            .slice(questions.findIndex((q) => q.id === openQuestion?.id) + 1)
            .map((q) => ({
                value: q.id,
                label: q.label
                    ? `${q.orderNumber}- ${q.label} `
                    : `${q.orderNumber}- Empty Question`,
            })),
        {
            value: "-1",
            label: "End survey",
        },
    ];
};

export const logicValuesOptions = (question: ParsedQuestion) => {
    return [
        ...(question?.options?.map(
            (option: SingleValue<Option>, index: number) => ({
                value: option?.id,
                label: option?.label ?? `Empty Option ${index + 1}`,
            }),
        ) ?? []),
    ];
};

///settings
export const rangeOptions = (question: ParsedQuestion) => {
    return [...Array(question?.options.length).keys()].map((i) => {
        return {
            label: i + 1,
            value: i + 1,
            index: i,
        };
    });
};
