import { IntegraflowIconProps } from "@/types";

export const Center = ({ color, size, ...props }: IntegraflowIconProps) => {
    const width = size ?? 21;
    const height = (width * 26) / 21;

    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={width}
            height={height}
            viewBox="0 0 22 26"
            fill="none"
            {...props}
        >
            <path
                d="M20.5984 7V19C20.5984 23.8 19.3984 25 14.5984 25H7.39844C2.59844 25 1.39844 23.8 1.39844 19V7C1.39844 2.2 2.59844 1 7.39844 1H14.5984C19.3984 1 20.5984 2.2 20.5984 7Z"
                stroke={color ?? "#AFAAC7"}
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M13.4016 13H8.60156"
                stroke={color ?? "#AFAAC7"}
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
};
