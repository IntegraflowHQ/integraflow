import { SurveyQuestionTypeEnum } from "@/generated/graphql";
import {
    FormFieldType
} from "@integraflow/web/src/types";
import BirthdayIcon from "assets/icons/studio/birthday.png";
import BooleanIcon from "assets/icons/studio/boolean.png";
import ContactIcon from "assets/icons/studio/contact.png";
import MultipleIcon from "assets/icons/studio/multiple.png";
import NPSIcon from "assets/icons/studio/nps.png";
import RatingIcon from "assets/icons/studio/rating.png";
import SingleIcon from "assets/icons/studio/single.png";
import SmileyIcon from "assets/icons/studio/smiley.png";
import TextIcon from "assets/icons/studio/text.png";
import ThankYouIcon from "assets/icons/studio/thankyou.png";
import WelcomeIcon from "assets/icons/studio/welcome.png";

export const questionTypes = [
    {
        id: 'welcome',
        name: "Welcome message",
        icon: WelcomeIcon,
        type: SurveyQuestionTypeEnum.Cta,
    },
    {
        id: 'single',
        name: "Single answer selection",
        icon: SingleIcon,
        type: SurveyQuestionTypeEnum.Single,
    },
    {
        id: 'dropdown',
        name: "Dropdown list",
        icon: SingleIcon,
        type: SurveyQuestionTypeEnum.Dropdown,
    },
    {
        id: 'multiple',
        name: "Multiple answer selection",
        icon: MultipleIcon,
        type: SurveyQuestionTypeEnum.Multiple,
    },
    {
        id: 'text',
        name: "Text answer",
        icon: TextIcon,
        type: SurveyQuestionTypeEnum.Text,
    },
    {
        id: 'smiley',
        name: "Smiley scale",
        icon: SmileyIcon,
        type: SurveyQuestionTypeEnum.SmileyScale,
    },
    {
        id:'rating',
        name: "Rating scale",
        icon: RatingIcon,
        type: SurveyQuestionTypeEnum.Rating,
    },
    {
        id:'rating',
        name: "numerical scale",
        icon: RatingIcon,
        type: SurveyQuestionTypeEnum.NumericalScale,
    },
    {
        id:'rating',
        name: "csat",
        icon: RatingIcon,
        type: SurveyQuestionTypeEnum.Csat,
    },
    {
        id:'nps',
        name: "NPS®",
        icon: NPSIcon,
        type: SurveyQuestionTypeEnum.Nps,
    },
    {
        id: 'form',
        name: "Contact form",
        icon: ContactIcon,
        type: SurveyQuestionTypeEnum.Form,
    },
    {
        id: 'boolean',
        name: "Boolean",
        icon: BooleanIcon,
        type: SurveyQuestionTypeEnum.Boolean,
    },
    {
        id:'birthday',
        name: "Birthday",
        icon: BirthdayIcon,
        type: SurveyQuestionTypeEnum.Date,
    },
    {
        id:'thankyou',
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
