import {
    SurveyQuestionCreateInput,
    SurveyQuestionTypeEnum,
} from "@/generated/graphql";
import { QuestionOption, QuestionSettings } from "@/types";
import { FormFieldType } from "@integraflow/web/src/types";

export const CSATOptions = [
    "Very unsatisfied",
    "Unsatisfied",
    "Neutral",
    "Satisfied",
    "Very satisfied",
];

export const createFormFields = (): QuestionOption[] => {
    return [
        {
            id: 1,
            orderNumber: 1,
            label: "First name",
            required: false,
            type: FormFieldType.FIRST_NAME,
        },
        {
            id: 2,
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
            id: i,
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
                id: 1,
                orderNumber: 1,
                label: "Answer 1",
                comment: false,
            },
            {
                id: 2,
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
        };
    }
    if (
        type === SurveyQuestionTypeEnum.Single ||
        type === SurveyQuestionTypeEnum.Dropdown
    ) {
        return {
            randomize: false,
            randomizeExceptLast: false,
        };
    }

    if (type === SurveyQuestionTypeEnum.Text) {
        return {
            singleLine: false,
        };
    }
    if (type === SurveyQuestionTypeEnum.Boolean) {
        return {
            positiveText: "Good",
            negativeText: "Bad",
            shape: "thumb",
        };
    }
    if (
        type === SurveyQuestionTypeEnum.Rating ||
        type === SurveyQuestionTypeEnum.Csat ||
        type === SurveyQuestionTypeEnum.NumericalScale
    ) {
        return {
            rightText: "Very Good",
            leftText: "Very Bad",
            
          
        };
    }
    if (type === SurveyQuestionTypeEnum.SmileyScale) {
        return {
            rightText: "Very Satisfied",
            leftText: "Very Unsatisfied",
            count: 5,
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

export const CsatOptions = [
    "Very unsatisfied",
    "Unsatisfied",
    "Neutral",
    "Satisfied",
    "Very satisfied",
];
