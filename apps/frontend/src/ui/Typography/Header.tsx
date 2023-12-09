import { cn } from "@/utils";

type Props = {
    title: string;
    description?: string;
    className?: string;
    variant?: "1" | "2" | "3" | "4";
    font?: "medium" | "semibold";
};

export const Header = ({
    title,
    description,
    variant = "1",
    font = "semibold",
    className,
}: Props) => {
    return (
        <header className={`flex flex-col gap-2 ${className}`}>
            {variant === "1" && (
                <h1
                    className={cn(
                        "text-[24px] leading-9 text-white",
                        font === "medium" ? "font-medium" : "font-semibold",
                    )}
                >
                    {title}
                </h1>
            )}

            {variant === "2" && (
                <h2
                    className={cn(
                        "text-lg text-white",
                        font === "medium" ? "font-medium" : "font-semibold",
                    )}
                >
                    {title}
                </h2>
            )}

            {variant === "3" && (
                <h3
                    className={cn(
                        "text-base text-white",
                        font === "medium" ? "font-medium" : "font-semibold",
                    )}
                >
                    {title}
                </h3>
            )}

            {variant === "4" && (
                <h3
                    className={cn(
                        "text-sm text-white",
                        font === "medium" ? "font-medium" : "font-semibold",
                    )}
                >
                    {title}
                </h3>
            )}

            {description && (
                <p className="text-sm text-intg-text">{description}</p>
            )}
        </header>
    );
};
