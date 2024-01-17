import { IntegraflowIconProps } from "@/types";

export const TopLeft = ({ color, size }: IntegraflowIconProps) => {
    const width = size ?? 21;
    const height = (width * 26) / 21;
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={width}
            height={height}
            viewBox="0 0 21 26"
            fill="none"
        >
            <path
                d="M19.9969 7V19C19.9969 23.8 18.7969 25 13.9969 25H6.79687C1.99687 25 0.796875 23.8 0.796875 19V7C0.796875 2.2 1.99687 1 6.79687 1H13.9969C18.7969 1 19.9969 2.2 19.9969 7Z"
                stroke={color ?? "#AFAAC7"}
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M9.19844 4.6001H4.39844"
                stroke={color ?? "#AFAAC7"}
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
};
