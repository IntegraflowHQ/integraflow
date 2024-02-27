import { ROUTES } from "@/routes";
import { Header } from "@/ui";
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
import { Link, useParams } from "react-router-dom";
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
        description: "Take a moment to introduce the purpose of your survey or say hi to your audience.",
        image: Star,
    },
    {
        title: "NPS®",
        description: "Take a moment to introduce the purpose of your survey or say hi to your audience.",
        image: NPS,
        right: true,
    },
    {
        title: "Contact form",
        description: "Take a moment to introduce the purpose of your survey or say hi to your audience.",
        image: Contact,
    },
    {
        title: "Birthday",
        description: "Take a moment to introduce the purpose of your survey or say hi to your audience.",
        image: Birthday,
    },
    {
        title: "Dropdown list",
        description: "Take a moment to introduce the purpose of your survey or say hi to your audience.",
        image: Dropdown,
    },
    {
        title: "Boolean",
        description: "Take a moment to introduce the purpose of your survey or say hi to your audience.",
        image: Boolean,
    },
    {
        title: "Smiley scale",
        description: "Take a moment to introduce the purpose of your survey or say hi to your audience.",
        image: Welcome,
    },
    {
        title: "Thank you",
        description: "Take a moment to introduce the purpose of your survey or say hi to your audience.",
        image: Welcome,
    },
];

export default function Templates() {
    const { orgSlug, projectSlug } = useParams();
    return (
        <div className="px-12 pb-[52px] pt-20">
            <div className="flex items-end justify-between pb-10">
                <Header
                    title="Add Question"
                    description="Integraflow enables you to understand your customers  To get started, we'll need to integrate your SDK product."
                    className="max-w-[386px]"
                />

                <Link to={ROUTES.STUDIO.replace(":projectSlug", projectSlug!).replace(":orgSlug", orgSlug!)}>
                    <CreateSurveyButton />
                </Link>
            </div>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(351px,1fr))] gap-x-5 gap-y-[26px]">
                {surveyTypes.map((surveyType) => (
                    <Template {...surveyType} key={surveyType.title} />
                ))}
            </div>
        </div>
    );
}
