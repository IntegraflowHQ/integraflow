type Props = {
    title: string;
    description?: string;
    className?: string;
    variant?: "1" | "2" | "3" | "4";
};

export const Header = ({
    title,
    description,
    variant = "1",
    className,
}: Props) => {
    return (
        <header className={`flex flex-col gap-2 ${className}`}>
            {variant === "1" && (
                <h1 className="text-[24px] font-semibold leading-9 text-white">
                    {title}
                </h1>
            )}

            {variant === "2" && (
                <h2 className="text-lg font-semibold text-white">{title}</h2>
            )}

            {variant === "3" && (
                <h3 className="text-base font-semibold text-white">{title}</h3>
            )}

            {variant === "4" && (
                <h3 className="text-sm font-semibold text-white">{title}</h3>
            )}

            {description && (
                <p className="text-sm text-intg-text">{description}</p>
            )}
        </header>
    );
};
