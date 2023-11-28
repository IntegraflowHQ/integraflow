import { SessionViewer } from "@/types";
import { toast } from "./toast";

export function cn(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
}

export function generateUniqueId() {
    const timestamp = new Date().getTime();
    const random = Math.random().toString(36).substr(2, 5); // 5 character random string

    return `${timestamp}-${random}`;
}

export function omitTypename<T>(obj: T): SessionViewer {
    return JSON.parse(JSON.stringify(obj), (key: string, value: any) =>
        key === "__typename" ? undefined : value,
    );
}

export function getAcronym(value: string) {
    return value.slice(0, 1);
}

export const copyToClipboard = (textToCopy: string, toastMessage: string) => {
    navigator.clipboard.writeText(textToCopy);
    toast.success(toastMessage);
};
