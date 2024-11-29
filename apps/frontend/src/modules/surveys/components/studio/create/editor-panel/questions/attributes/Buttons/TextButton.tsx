import { cn } from "@/utils";

type Props = {
    text: string;
    onclick?: () => void;
    classname?: string;
    size?: "sm" | "md";
    dataTestid?: string;
};

const TextButton = ({ text, onclick, classname, size = "sm", dataTestid }: Props) => {
    return (
        <div
            onClick={onclick && onclick}
            className={cn(
                `${classname} ${
                    size === "md" ? "text-sm" : "text-xs"
                } w-fit cursor-pointer text-intg-text underline transition-colors delay-75 duration-500 ease-in hover:text-white `,
            )}
            data-testid={dataTestid}
        >
            {text}
        </div>
    );
};

export default TextButton;
