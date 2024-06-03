import { CursorIcon, PeopleIcon, PlusCircle } from "@/ui/icons";
import { BarChart } from "lucide-react";

export enum BillingCategoriesEnum {
    RESPONSES = "responses",
    EVENTS = "events",
    PERSONS = "persons",
}

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
        icon: BarChart,
        title: "Survey responses Usage ",
        description:
            "Build in-app popups with freeform text responses, multiple choice, NPS, ratings, and emoji reactions. Or use the API for complete control.",
        tag: "Free trial reached",
        category: BillingCategoriesEnum.RESPONSES,
    },
    {
        icon: CursorIcon,
        title: "Event Usage",
        description: "Send surveys to your audience ",
        tag: "Free trial reached",
        category: BillingCategoriesEnum.EVENTS,
    },
    {
        icon: PeopleIcon,
        title: "Audience  Usage",
        description: "Send surveys to your audience",
        tag: "Free trial reached",
        category: BillingCategoriesEnum.PERSONS,
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
