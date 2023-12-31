import { DeepOmit } from "@apollo/client/utilities";
import { toast } from "./toast";

export function cn(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
}

export function generateUniqueId() {
    const timestamp = new Date().getTime();
    const random = Math.random().toString(36).substr(2, 5); // 5 character random string

    return `${timestamp}-${random}`;
}

export function omitTypename<T>(obj: T): DeepOmit<T, "__typename"> {
    return JSON.parse(JSON.stringify(obj), (key: string, value: any) =>
        key === "__typename" ? undefined : value,
    );
}

export function isOver24Hours(previousTimestamp: number): boolean {
    const twentyFourHoursInMilliseconds = 24 * 60 * 60 * 1000;
    const currentTimestamp = Date.now();
    const timeDifference = currentTimestamp - previousTimestamp;

    return timeDifference > twentyFourHoursInMilliseconds;
}

export function getAcronym(value: string) {
    return value.slice(0, 1).toUpperCase();
}

export const copyToClipboard = (textToCopy: string, toastMessage: string) => {
    navigator.clipboard.writeText(textToCopy);
    toast.success(toastMessage);
};

export function addEllipsis(text: string, maxLength: number) {
    if (text.length > maxLength) {
        return text.substring(0, maxLength) + "...";
    } else {
        return text;
    }
}

export const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
