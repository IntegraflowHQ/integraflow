import { Button } from "@/ui";
import { cn } from "@/utils";

interface Props {
    name: string;
    image: string;
    onClick: () => void;
    imagePosition?: "left" | "center";
    comingSoon?: boolean;
    tall?: boolean;
}

export default function Platform({
    name,
    image,
    imagePosition = "left",
    onClick,
    comingSoon = false,
    tall = false,
}: Props) {
    return (
        <button
            className={cn(
                "relative  flex-1 rounded-lg border border-intg-bg-10 bg-intg-bg-10 pt-4 hover:border-intg-bg-2",
                tall ? "h-[278px]" : "h-[190px]",
                comingSoon ? "bg-opacity-30" : "",
            )}
            onClick={onClick}
        >
            <div
                className={cn(
                    "flex h-full w-full flex-col justify-between gap-6 rounded-lg",
                    comingSoon ? "opacity-30" : "",
                )}
                style={{
                    backgroundImage: `url(${image})`,
                    backgroundPosition:
                        imagePosition === "center"
                            ? "bottom center"
                            : "bottom left",
                    backgroundRepeat: "no-repeat",
                }}
            >
                <p className={cn("self-center text-lg leading-6 text-white")}>
                    {name}
                </p>
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
