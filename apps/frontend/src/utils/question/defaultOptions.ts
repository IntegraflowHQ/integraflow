import { SurveyQuestionCreateInput, SurveyQuestionTypeEnum } from "@/generated/graphql";
import { QuestionOption, QuestionSettings } from "@/types";
import { FormFieldType } from "@integraflow/web/src/types";
import { generateUniqueId } from "..";

const CSATOptions = ["Very unsatisfied", "Unsatisfied", "Neutral", "Satisfied", "Very satisfied"];

const CESOptions = [
    "Strongly Disagree",
    "Disagree",
    "Somewhat Disagree",
    "Normal",
    "Somewhat Agree",
    "Agree",
    "Strongly Agree",
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

export const createRangeOptions = (type: SurveyQuestionTypeEnum, length: number): QuestionOption[] => {
    const options = [];
    for (let i = 1; i <= length; i++) {
        let label = `${i}`;

        const index = i - 1;
        if (type === SurveyQuestionTypeEnum.Csat) {
            label = CSATOptions[index];
        }

        if (type === SurveyQuestionTypeEnum.Ces) {
            label = CESOptions[index];
        }

        if (type === SurveyQuestionTypeEnum.Nps) {
            label = `${index}`;
        }


        options.push({
            id: generateUniqueId(),
            orderNumber: i,
            label,
        });
    }
    return options;
};

export const createOptions = (type: SurveyQuestionTypeEnum): QuestionOption[] | undefined => {
    if (type === SurveyQuestionTypeEnum.Form) {
        return createFormFields();
    }

    if (
        type === SurveyQuestionTypeEnum.Rating ||
        type === SurveyQuestionTypeEnum.Csat ||
        type === SurveyQuestionTypeEnum.Ces ||
        type === SurveyQuestionTypeEnum.Nps ||
        type === SurveyQuestionTypeEnum.NumericalScale ||
        type === SurveyQuestionTypeEnum.SmileyScale
    ) {
        const length = type === SurveyQuestionTypeEnum.Nps ? 11 : type === SurveyQuestionTypeEnum.Ces ? 7 : 5;
        return createRangeOptions(type, length);
    }

    if (
        type === SurveyQuestionTypeEnum.Single ||
        type === SurveyQuestionTypeEnum.Multiple ||
        type === SurveyQuestionTypeEnum.Dropdown
    ) {
        return [
            {
                id: generateUniqueId(),
                orderNumber: 1,
                label: "Answer 1",
                comment: false,
            },
            {
                id: generateUniqueId(),
                orderNumber: 2,
                label: "Answer 2",
                comment: false,
            },
        ];
    }
};

export const createSettings = (type: SurveyQuestionTypeEnum): QuestionSettings | undefined => {
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
    if (type === SurveyQuestionTypeEnum.Single || type === SurveyQuestionTypeEnum.Dropdown) {
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
    if (type === SurveyQuestionTypeEnum.NumericalScale || type === SurveyQuestionTypeEnum.Nps) {
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
    if (type === SurveyQuestionTypeEnum.Date || type === SurveyQuestionTypeEnum.Csat) {
        return {
            logic: [],
        };
    }
};

export const getDefaultValues = (type: SurveyQuestionTypeEnum): Partial<SurveyQuestionCreateInput> => {
    return {
        label: "",
        orderNumber: 1,
        options: createOptions(type),
        settings: createSettings(type),
    };
};
