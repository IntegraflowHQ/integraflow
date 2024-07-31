import { cn } from "@/utils";
import * as AnnouncePrimitive from "@radix-ui/react-announce";

export type AnnounceVariant = "red" | "green";

type AnnounceProps = {
    text: string;
    variant: AnnounceVariant;
    classNames?: string;
};
export const Announce = ({ text, variant, classNames = "" }: AnnounceProps) => {
    return (
        <AnnouncePrimitive.Root
            className={cn(
                "rounded-xl border p-2 text-xs",
                variant === "green" ? "border-intg-green-medium text-intg-green-medium" : "",
                variant === "red" ? "border-intg-error-text text-intg-error-text" : "",
                classNames,
            )}
        >
            {text}
        </AnnouncePrimitive.Root>
    );
};
