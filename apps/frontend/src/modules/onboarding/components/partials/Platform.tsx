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
        <div
            className={cn(
                "flex-1 rounded-lg border border-intg-bg-14 bg-intg-bg-14 pt-4 hover:border-intg-bg-2",
                tall ? "h-[278px]" : "h-[190px]",
            )}
            onClick={() => {
                if (!comingSoon) {
                    onClick();
                }
            }}
        >
            <div
                className={cn(
                    "flex h-full w-full flex-col justify-between gap-6 rounded-lg",
                    comingSoon ? "opacity-30" : "",
                )}
                style={{
                    backgroundImage: `url(${image})`,
                    backgroundPosition: imagePosition === "center" ? "bottom center" : "bottom left",
                    backgroundRepeat: "no-repeat",
                }}
            >
                <p className={cn("self-center text-lg leading-6 text-white")}>{name}</p>
            </div>
        </div>
    );
}
