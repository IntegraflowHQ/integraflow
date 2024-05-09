import { PlusCircle } from "@/ui/icons";
import ThankYouIcon from "assets/icons/studio/thankyou.png";
import { PeopleIcon } from "./../../../ui/icons/PeopleIcon";

export const settingsCardInfo = [
    {
        id: crypto.randomUUID,
        icon: PeopleIcon,
        title: "profile",
        details:
            "If you want to permanently delete this workspace and all of it’s data, including all users responses.",
        link: "Profile settings",
    },
    {
        id: crypto.randomUUID,
        icon: PlusCircle,
        title: "workspace",
        details:
            "If you want to permanently delete this workspace and all of it’s data, including all users responses.",
        link: "Workspace settings",
    },
    {
        id: crypto.randomUUID,
        icon: PlusCircle,
        title: "project",
        details:
            "If you want to permanently delete this workspace and all of it’s data, including all users responses.",
        link: "Project settings",
    },
];

export const planDetails = [
    {
        icon: ThankYouIcon,
        title: "Survey responses Usage ",
        description:
            "Build in-app popups with freeform text responses, multiple choice, NPS, ratings, and emoji reactions. Or use the API for complete control.",
        current: 250,
        freeTrial: 750,
        tag: "Free trial reached",
    },
    {
        icon: ThankYouIcon,
        title: "Event Usage",
        description: "Send surveys to your audience ",
        current: 250,
        freeTrial: 750,
        tag: "Free trial reached",
    },
    {
        icon: ThankYouIcon,
        title: "Audience  Usage",
        description: "Send surveys to your audience",
        current: 250,
        freeTrial: 750,
        tag: "Free trial reached",
    },
];

export const billingDetails = [
    {
        type: "Free",
        price: 0,
        text: "Change your current workspace plan",
        cta: "Current plan",
        features: [
            "250 responses per month",
            "250 responses per month",
            "250 responses per month",
            "250 responses per month",
            "250 responses per month",
        ],
    },
    {
        type: "Free",
        price: 0,
        text: "Change your current workspace plan",
        cta: "Current plan",
        features: [
            "250 responses per month",
            "250 responses per month",
            "250 responses per month",
            "250 responses per month",
            "250 responses per month",
        ],
    },
    {
        type: "Free",
        price: 0,
        text: "Change your current workspace plan",
        cta: "Current plan",
        features: [
            "250 responses per month",
            "250 responses per month",
            "250 responses per month",
            "250 responses per month",
            "250 responses per month",
        ],
    },
];
