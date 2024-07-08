import { GlobalSpinner, Header } from "@/ui";
import { TemplateProps } from "@/utils/survey";
import Birthday from "assets/images/surveys/Birthday.svg";
import Boolean from "assets/images/surveys/Boolean.svg";
import Contact from "assets/images/surveys/Contact.svg";
import Dropdown from "assets/images/surveys/Dropdown.svg";
import Multiple from "assets/images/surveys/Multiple.svg";
import NPS from "assets/images/surveys/NPS.svg";
import Single from "assets/images/surveys/Single.svg";
import Star from "assets/images/surveys/Star.svg";
import Text from "assets/images/surveys/Text.svg";
import Welcome from "assets/images/surveys/Welcome.svg";
import { useSurvey } from "../hooks/useSurvey";
import CreateSurveyButton from "./partials/CreateSurveyButton";
import Template from "./partials/Template";

export const surveyTypes: TemplateProps[] = [
    {
        title: "Welcome message",
        description: "Take a moment to introduce the purpose of your survey or say hi to your audience.",
        image: Welcome,
    },
    {
        title: "Single answer selection",
        description: "Get people to select only one option. Good for getting definite answers.",
        image: Single,
    },
    {
        title: "Multiple answer selection",
        description: "Let people choose multiple answers from a list. Use it when more than one answer applies.",
        image: Multiple,
    },
    {
        title: "Text answer",
        description: "Provide a text box so people can share written, open-ended feedback.",
        image: Text,
    },
    {
        title: "Rating scale",
        description: "Ask your customers to rate their experience on your platform or your services.",
        image: Star,
    },
    {
        title: "NPS®",
        description: "Measure customer loyalty and satisfaction by asking customers a single question.",
        image: NPS,
        right: true,
    },
    {
        title: "Contact form",
        description: "Ask for your customers data to personalize their experience.",
        image: Contact,
    },
    {
        title: "Birthday",
        description: "Take note of dates important to your customers.",
        image: Birthday,
    },
    {
        title: "Dropdown list",
        description: "Make a list of options for your customers to choose from.",
        image: Dropdown,
    },
    {
        title: "Boolean",
        description: "Get people to select only one option. Good for getting definite answers.",
        image: Boolean,
    },
    {
        title: "Smiley scale",
        description: "Get people to express their satisfaction using emojis.",
        image: Welcome,
    },
    {
        title: "Thank you",
        description: "Let your customers know you appreciate their feedback.",
        image: Welcome,
    },
];

export default function Templates() {
    const { createSurvey, creatingSurvey } = useSurvey();

    if (creatingSurvey) {
        return <GlobalSpinner />;
    }

    return (
        <div className="px-12 pb-[52px] pt-20">
            <div className="flex items-end justify-between pb-10">
                <Header
                    title="Add Question"
                    description="Integraflow enables you to understand your customers  To get started, we'll need to integrate your SDK product."
                    className="max-w-[386px]"
                />

                <CreateSurveyButton
                    onClick={() => {
                        createSurvey();
                    }}
                />
            </div>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(351px,1fr))] gap-x-5 gap-y-[26px]">
                {surveyTypes.map((surveyType) => (
                    <Template {...surveyType} key={surveyType.title} />
                ))}
            </div>
        </div>
    );
}
