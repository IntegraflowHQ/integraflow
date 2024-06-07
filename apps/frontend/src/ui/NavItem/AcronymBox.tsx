import { getAcronym } from "@/utils";
type Props = {
    text: string;
    size?: "sm" | "md";
};

export const AcronymBox = ({ text, size = "sm" }: Props) => {
    return (
        <span
            className={` ${
                size === "sm" ? "h-6 w-6 px-1.5 text-xs" : "h-20 w-20  text-[2rem] font-extrabold"
            } flex  items-center justify-center rounded bg-gradient-button  text-left`}
        >
            {getAcronym(text)}
        </span>
    );
};
