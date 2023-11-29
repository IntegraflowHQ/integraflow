import { getAcronym } from "@/utils";
type Props = {
    text: string;
};

export const AcronynmBox = ({ text }: Props) => {
    return (
        <span className="flex h-6 w-6 items-center justify-center rounded bg-gradient-button px-1.5 text-left text-xs">
            {getAcronym(text)}
        </span>
    );
};
