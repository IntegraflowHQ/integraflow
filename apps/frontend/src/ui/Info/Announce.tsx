import { cn } from "@/utils";
import * as AnnouncePrimitive from "@radix-ui/react-announce";

export const Announce = ({ text, variant }: { text: string; variant: "red" | "green" }) => {
    return (
        <AnnouncePrimitive.Root
            className={cn(
                "rounded-xl border p-2 text-xs",
                variant === "green" ? "border-intg-green-medium text-intg-green-medium" : "",
                variant === "red" ? "border-intg-error-text text-intg-error-text" : "",
            )}
        >
            {text}
        </AnnouncePrimitive.Root>
    );
};
