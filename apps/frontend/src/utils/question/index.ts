import { PropertyDefinition, SurveyQuestionTypeEnum } from "@/generated/graphql";
import { CTAType, LogicOperator, LogicConditionEnum, MentionOption, ParsedQuestion, QuestionOption } from "@/types";
import {  } from "@integraflow/web";
import RatingIcon from "assets/icons/studio/rating.png";
import ThankYouIcon from "assets/icons/studio/thankyou.png";
import { addEllipsis, stripHtmlTags } from "..";
import { questionTypes } from "../survey";

const ANSWER_TAG_SUFFIX = "answer";
export const questionsWithoutSettingsTab = [SurveyQuestionTypeEnum.Csat, SurveyQuestionTypeEnum.Ces, SurveyQuestionTypeEnum.Date];
export const emptyLabel = "<p><br></p>";

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
    if (type === SurveyQuestionTypeEnum.Single || type === SurveyQuestionTypeEnum.Dropdown) {
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
        type === SurveyQuestionTypeEnum.Ces
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

export const generateNumericalOptions = (start: number, end: number): { label: string; value: number }[] => {
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
    if (type === SurveyQuestionTypeEnum.Text || type === SurveyQuestionTypeEnum.Form) {
        return true;
    } else {
        return false;
    }
};

export const destinationOptions = (questions: ParsedQuestion[], openQuestion: ParsedQuestion) => {
    return [
        ...questions.slice(questions.findIndex((q) => q.id === openQuestion?.id) + 1).map((q) => ({
            value: q.id,
            label:
                stripHtmlTags(q.label) && stripHtmlTags(q.label) !== emptyLabel
                    ? `${q.orderNumber} - ${addEllipsis(stripHtmlTags(q.label), 40)} `
                    : `${q.orderNumber} - Empty Question`,
        })),
        {
            value: "-1",
            label: "End survey",
        },
    ];
};

export const logicValuesOptions = (question: ParsedQuestion) => {
    return [
        ...(question?.options?.map((option: QuestionOption, index: number) => ({
            value: option?.id,
            label: option?.label ?? `Empty Option ${index + 1}`,
        })) ?? []),
    ];
};

export const rangeOptions = (question: ParsedQuestion) => {
    return [...Array(question?.options.length).keys()].map((i) => {
        return {
            label: i + 1,
            value: i + 1,
            index: i,
        };
    });
};

export function getAttrOpts(userAttributes: PropertyDefinition[]): MentionOption {
    return {
        title: "Attribute",
        items: userAttributes.map((attr) => ({
            value: attr.name,
            id: "attribute" + " " + `attribute.${attr.name}`,
            type: "userAttribute",
        })),
    };
}

export function getRecallOptions(openQuestion: ParsedQuestion, questions: ParsedQuestion[]): MentionOption {
    const openQuestionIndex = questions.findIndex((q) => q.id === openQuestion?.id);

    return {
        title: "Recall From",
        items: questions
            .slice(0, openQuestionIndex !== -1 ? openQuestionIndex : 0)
            .filter((q) => q.type !== SurveyQuestionTypeEnum.Form && q.type !== SurveyQuestionTypeEnum.Cta)
            .map((q) => ({
                value: addEllipsis(
                    `${questions.findIndex((o) => o.id == q.id) + 1}. ${!stripHtmlTags(q.label) ? "-" : stripHtmlTags(q.label)}`,
                    25,
                ),
                id: q.id + " " + ANSWER_TAG_SUFFIX,
                type: "recalledQuestion",
            })),
    };
}

export const tagOptions = (
    questions: ParsedQuestion[],
    openQuestion: ParsedQuestion,
    userAttributes: PropertyDefinition[],
): MentionOption[] => {
    const opts: MentionOption[] = [];
    const userAttrOpts = getAttrOpts(userAttributes);
    const recallOpts = getRecallOptions(openQuestion, questions);

    if (recallOpts.items.length > 0) {
        opts.push(recallOpts);
    }

    if (userAttrOpts.items.length > 0) {
        opts.push(userAttrOpts);
    }
    return opts;
};

function resolveTaggedQuestion(questionId: string, tagOptions: MentionOption[]): string {
    const option = tagOptions
        .flatMap((opts) => opts.items)
        .filter((item) => item.id.endsWith(ANSWER_TAG_SUFFIX))
        .find((o) => {
            const optionId = o.id.split(" ")[0];
            return questionId === optionId;
        });

    return option?.value ?? "";
}

export function encodeText(textContent: string): string {
    const encodedText = textContent.replace(
        /<span class="mention"([^>]*)data-id="([^"]*)"([^>]*)data-type="([^"]*)"([^>]*)data-fallback="([^"]*)"([^>]*)>(.*?)<\/span>/g,
        (_, __, dataId, ___, dataType, ____, fallback) => {
            if (dataId === "attribute") {
                return `{{${dataType} | "${fallback}"}}`;
            }
            return `{{${dataType}:${dataId} | "${fallback}"}}`;
        },
    );

    return encodedText.split("</span>").join("");
}

export function decodeText(encodedText: string, tagOptions: MentionOption[]): string {
    const decodedText = encodedText
        .replace(/{{answer:([^ ]+) \| "([^"]*)"}}/g, (_, id, fallback) => {
            return `<span class="mention" data-index="4" data-denotation-char="" data-value="${resolveTaggedQuestion(id, tagOptions)}" data-id="${id}" data-type="answer" data-fallback="${fallback}"><span contenteditable="false">${resolveTaggedQuestion(id, tagOptions)}</span></span>`;
        })
        .replace(/{{attribute.([^ ]+) \| "([^"]*)"}}/g, (_, attr, fallback) => {
            return `<span class="mention" data-index="4" data-denotation-char="" data-value="${attr}" data-id="attribute" data-type="attribute.${attr}" data-fallback="${fallback}"><span contenteditable="false">${attr}</span></span>`;
        });

    return decodedText + " ";
}

export const getQuestionIcon = (question: ParsedQuestion) => {
    if (question.type === SurveyQuestionTypeEnum.Cta && question.settings.type !== CTAType.NEXT) {
        return ThankYouIcon;
    }
    if (
        [
            SurveyQuestionTypeEnum.Rating,
            SurveyQuestionTypeEnum.NumericalScale,
            SurveyQuestionTypeEnum.Csat,
            SurveyQuestionTypeEnum.Ces,
        ].includes(question?.type)
    ) {
        return RatingIcon;
    }

    return questionTypes.find((type) => type.type === question?.type)?.icon;
};
