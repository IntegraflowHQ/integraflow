import { SurveyQuestionTypeEnum } from "@/generated/graphql";
import {
    FormFieldType,
    LogicBooleanCondition,
    LogicFormCondition,
    LogicMultipleCondition,
    LogicOperator,
    LogicRangeCondition,
    LogicTextCondition,
} from "@integraflow/web/src/types";
import BirthdayIcon from "assets/icons/studio/birthday.png";
import BooleanIcon from "assets/icons/studio/boolean.png";
import ContactIcon from "assets/icons/studio/contact.png";
import DropdownIcon from "assets/icons/studio/dropdown.png";
import MultipleIcon from "assets/icons/studio/multiple.png";
import NPSIcon from "assets/icons/studio/nps.png";
import RatingIcon from "assets/icons/studio/rating.png";
import SingleIcon from "assets/icons/studio/single.png";
import SmileyIcon from "assets/icons/studio/smiley.png";
import TextIcon from "assets/icons/studio/text.png";
import ThankYouIcon from "assets/icons/studio/thankyou.png";
import WelcomeIcon from "assets/icons/studio/welcome.png";

type DropdownOption = {
    label: string;
    value: string;
};

export const questionTypes = [
    {
        name: "Welcome message",
        icon: WelcomeIcon,
        type: SurveyQuestionTypeEnum.Cta,
    },
    {
        name: "Single answer selection",
        icon: SingleIcon,
        type: SurveyQuestionTypeEnum.Single,
    },
    {
        name: "Dropdown list",
        icon: SingleIcon,
        type: SurveyQuestionTypeEnum.Dropdown,
    },
    {
        name: "Multiple answer selection",
        icon: MultipleIcon,
        type: SurveyQuestionTypeEnum.Multiple,
    },
    {
        name: "Text answer",
        icon: TextIcon,
        type: SurveyQuestionTypeEnum.Text,
    },
    {
        name: "Smiley scale",
        icon: SmileyIcon,
        type: SurveyQuestionTypeEnum.SmileyScale,
    },
    {
        name: "Rating scale",
        icon: RatingIcon,
        type: SurveyQuestionTypeEnum.Rating,
    },
    {
        name: "NPS®",
        icon: NPSIcon,
        type: SurveyQuestionTypeEnum.Nps,
    },
    {
        name: "Contact form",
        icon: ContactIcon,
        type: SurveyQuestionTypeEnum.Form,
    },
    {
        name: "Boolean",
        icon: BooleanIcon,
        type: SurveyQuestionTypeEnum.Boolean,
    },
    {
        name: "Birthday",
        icon: BirthdayIcon,
        type: SurveyQuestionTypeEnum.Date,
    },
    {
        name: "Thank you",
        icon: ThankYouIcon,
        type: SurveyQuestionTypeEnum.Cta,
    },
];

export type TemplateProps = {
    title: string;
    description: string;
    image: string;
    right?: boolean;
};

export const formOptions = [
    {
        label: "First name",
        value: FormFieldType.FIRST_NAME,
    },
    {
        label: "Last name",
        value: FormFieldType.LAST_NAME,
    },
    {
        label: "Email",
        value: FormFieldType.EMAIL,
    },
    {
        label: "Organization",
        value: FormFieldType.ORGANIZATION,
    },
    {
        label: "Department",
        value: FormFieldType.DEPARTMENT,
    },
    {
        label: "Job title",
        value: FormFieldType.JOB_TITLE,
    },
    {
        label: "Website",
        value: FormFieldType.WEBSITE,
    },
    {
        label: "Country",
        value: FormFieldType.COUNTRY,
    },
    {
        label: "Address 1",
        value: FormFieldType.ADDRESS_ONE,
    },
    {
        label: "Address 2",
        value: FormFieldType.ADDRESS_TWO,
    },
    {
        label: " City",
        value: FormFieldType.CITY,
    },
    {
        label: "State",
        value: FormFieldType.STATE,
    },
    {
        label: "Zip code",
        value: FormFieldType.ZIP,
    },
    {
        label: "Fax",
        value: FormFieldType.FAX,
    },
    {
        label: "Annual revenue",
        value: FormFieldType.ANNUAL_REVENUE,
    },
    {
        label: "Employees",
        value: FormFieldType.EMPLOYEES,
    },
    {
        label: "Industry",
        value: FormFieldType.INDUSTRY,
    },

    {
        label: "Comment",
        value: FormFieldType.COMMENT,
    },
];

export const surveyConditions: DropdownOption[] = [
    {
        label: "select condition",
        value: "1",
    },
    {
        label: "has any value",
        value: LogicTextCondition.HAS_ANY_VALUE,
    },
    {
        label: "is false",
        value: LogicBooleanCondition.IS_FALSE,
    },
    {
        label: "is true",
        value: LogicBooleanCondition.IS_TRUE,
    },
    {
        label: "does not include any",
        value: LogicMultipleCondition.DOES_NOT_INCLUDE_ANY,
    },
    {
        label: "includes all",
        value: LogicMultipleCondition.INCLUDES_ALL,
    },
    {
        label: "is true",
        value: LogicMultipleCondition.INCLUDES_ANY,
    },
    {
        label: "is exactly",
        value: LogicMultipleCondition.IS_EXACTLY,
    },
    {
        label: "is filled in",
        value: LogicFormCondition.IS_FILLED_IN,
    },
    {
        label: "is not filled in",
        value: LogicFormCondition.IS_NOT_FILLED_IN,
    },
    {
        label: "and",
        value: LogicOperator.AND,
    },
    {
        label: "is",
        value: LogicRangeCondition.IS,
    },
    {
        label: "is between",
        value: LogicRangeCondition.IS_BETWEEN,
    },
    {
        label: "is not",
        value: LogicRangeCondition.IS_NOT,
    },
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
];
