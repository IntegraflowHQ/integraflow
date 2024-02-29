import { SurveyQuestionTypeEnum } from "@/generated/graphql";
import { LogicConditionEnum, ParsedQuestion, QuestionOption, TagOption } from "@/types";
import { LogicOperator } from "@integraflow/web/src/types";
import { stripHtmlTags } from "..";

export const questionsWithoutSettingsTab = [SurveyQuestionTypeEnum.Csat, "CES"];

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
        type === "CES"
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
            label: q.label ? `${q.orderNumber}- ${q.label} ` : `${q.orderNumber}- Empty Question`,
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

export const recallOptions = (questions: ParsedQuestion[], openQuestion: ParsedQuestion) => {
    const newQuestions = questions.filter(
        (q) => q.type !== SurveyQuestionTypeEnum.Form && q.type !== SurveyQuestionTypeEnum.Cta,
    );

    return [
        ...newQuestions
            .slice(
                0,
                newQuestions.findIndex((q) => q.id === openQuestion?.id),
            )
            .map((q) => ({
                value: ` ${q.orderNumber}. ${!stripHtmlTags(q.label) ? "-" : stripHtmlTags(q.label)}`,
                id: q.id + " " + `answer`,
                type: "recalledQuestion",
            })),
    ];
};

const attributes = [
    {
        node: {
            id: "UHJvcGVydHlEZWZpbml0aW9uOjAxOGM3MzVlLTkwZmMtMDAwMC1lZTgwLWE1OTE0MDNkZDk0YQ==",
            name: "name",
            isNumerical: false,
            type: "PERSON",
            propertyType: "String",
            __typename: "PropertyDefinition",
        },
        __typename: "PropertyDefinitionCountableEdge",
    },
    {
        node: {
            id: "UHJvcGVydHlEZWZpbml0aW9uOjAxOGM3MzVlLTkwZmMtMDAwMS02MGRlLTNjODBlY2MwYTA1Yw==",
            name: "sex",
            isNumerical: false,
            type: "PERSON",
            propertyType: "String",
            __typename: "PropertyDefinition",
        },
        __typename: "PropertyDefinitionCountableEdge",
    },
    {
        node: {
            id: "UHJvcGVydHlEZWZpbml0aW9uOjAxOGM3MzVlLTkwZmMtMDAwMi0wOTg1LWMxM2MxYTMzMWNiZA==",
            name: "city",
            isNumerical: false,
            type: "PERSON",
            propertyType: "String",
            __typename: "PropertyDefinition",
        },
        __typename: "PropertyDefinitionCountableEdge",
    },
    {
        node: {
            id: "UHJvcGVydHlEZWZpbml0aW9uOjAxOGM3MzVlLTkwZmMtMDAwMy04ZDc5LWEwNGI4NjdlYzM4YQ==",
            name: "age",
            isNumerical: true,
            type: "PERSON",
            propertyType: "Numeric",
            __typename: "PropertyDefinition",
        },
        __typename: "PropertyDefinitionCountableEdge",
    },
    {
        node: {
            id: "UHJvcGVydHlEZWZpbml0aW9uOjAxOGM3MzVlLTkwZmMtMDAwNC0wMzM3LTE3Y2MzM2MyY2Y3Nw==",
            name: "enabled",
            isNumerical: false,
            type: "PERSON",
            propertyType: "Boolean",
            __typename: "PropertyDefinition",
        },
        __typename: "PropertyDefinitionCountableEdge",
    },
];

const userAttributeOptions = attributes.map((attr) => ({
    value: attr.node.name,
    id: "attribute" + " " + `attribute.${attr.node.name}`,
    type: "userAttribute",
}));

export const tagOptions = (questions: ParsedQuestion[], openQuestion: ParsedQuestion): TagOption[] => {
    const recallOpts = recallOptions(questions, openQuestion);
    const userAttrOpts = userAttributeOptions;

    if (recallOpts.length === 0) {
        return [{ id: "UserAttribute", value: "User Attribute", disabled: true, type: "" }, ...userAttrOpts];
    } else if (userAttrOpts.length === 0) {
        return [{ id: "recalledQuestion", value: "Recall from", disabled: true, type: "" }, ...recallOpts];
    } else {
        return [
            { id: "recalledQuestion", value: "Recall from", disabled: true, type: "" },
            ...recallOpts,
            { id: "UserAttribute", value: "User Attribute", disabled: true, type: "" },
            ...userAttrOpts,
        ];
    }
};

function resolveQuestionIndex(questionId: string, tagOptions: TagOption[]): string {
    const option = tagOptions?.find((o) => {
        const optionId = o.id.split(" ")[0];
        return questionId === optionId;
    });

    return option?.value as string;
}

export function sendToDB(textContent: string): string {
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

export function getfromDB(encodedText: string, tagOptions: TagOption[]): string {
    const decodedText = encodedText
        .replace(/{{answer:([^ ]+) \| "([^"]*)"}}/g, (_, id, fallback) => {
            return `<span class="mention" data-index="4" data-denotation-char="" data-value="${resolveQuestionIndex(id, tagOptions)}" data-id="${id}" data-type="answer" data-fallback="${fallback}"><span contenteditable="false">${resolveQuestionIndex(id, tagOptions)}</span></span>`;
        })
        .replace(/{{attribute.([^ ]+) \| "([^"]*)"}}/g, (_, attr, fallback) => {
            return `<span class="mention" data-index="4" data-denotation-char="" data-value="${attr}" data-id="attribute" data-type="attribute.${attr}" data-fallback="${fallback}"><span contenteditable="false">${attr}</span></span>`;
        });

    return decodedText + " ";
}
