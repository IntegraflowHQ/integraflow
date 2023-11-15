import { Button } from "@/ui";
import { cn } from "@/utils";

interface Props {
    name: string;
    image: string;
    onClick: () => void;
    imagePosition?: "left" | "center";
    comingSoon?: boolean;
}

export default function Platform({
    name,
    image,
    imagePosition = "left",
    onClick,
    comingSoon = false,
}: Props) {
    return (
        <button
            className={cn(
                "relative flex flex-1 flex-col justify-between gap-6 rounded-lg border border-intg-bg-10 bg-intg-bg-10 pt-4 hover:border-intg-bg-2",
                comingSoon ? "bg-opacity-30" : "",
            )}
            onClick={onClick}
        >
            <p
                className={cn(
                    "self-center text-lg leading-6 text-white",
                    comingSoon ? "opacity-30" : "",
                )}
            >
                {name}
            </p>
            <div
                className={cn(
                    "flex w-full",
                    imagePosition === "left"
                        ? "justify-start"
                        : "justify-center",
                    comingSoon ? "opacity-30" : "",
                )}
            >
                <img
                    src={image}
                    alt={name}
                    className={cn(
                        "block self-end",
                        imagePosition === "left"
                            ? "max-w-[251px]"
                            : "max-w-[146px]",
                    )}
                />
            </div>

            {comingSoon && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-lg">
                    <span className="text-lg text-white">Coming Soon</span>
                    <Button
                        variant="secondary"
                        text="Notify me"
                        className="w-max px-8 py-[8px]"
                    />
                </div>
            )}
        </button>
    );
}
