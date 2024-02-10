import { IntegraflowIconProps } from "@/types";

export const BottomRight = ({ color, size }: IntegraflowIconProps) => {
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
                d="M20.2 7V19C20.2 23.8 19 25 14.2 25H7C2.2 25 1 23.8 1 19V7C1 2.2 2.2 1 7 1H14.2C19 1 20.2 2.2 20.2 7Z"
                stroke={color ?? "#AFAAC7"}
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M16.5969 21.3999H11.7969"
                stroke={color ?? "#AFAAC7"}
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
};
