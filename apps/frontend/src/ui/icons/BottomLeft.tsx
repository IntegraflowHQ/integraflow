import { IntegraflowIconProps } from "@/types";

export const BottomLeft = ({ color, size }: IntegraflowIconProps) => {
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
                d="M20.4031 7V19C20.4031 23.8 19.2031 25 14.4031 25H7.20312C2.40312 25 1.20312 23.8 1.20312 19V7C1.20312 2.2 2.40312 1 7.20312 1H14.4031C19.2031 1 20.4031 2.2 20.4031 7Z"
                stroke={color ?? "#AFAAC7"}
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M9.60469 21.3999H4.80469"
                stroke={color ?? "#AFAAC7"}
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
};
