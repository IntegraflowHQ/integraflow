import { Header } from "@/ui";
import { ReactElement } from "react";
import { Link } from "react-router-dom";

type Props = {
    icon: ReactElement;
    title: string;
    description: string;
    href: string;
};

export const SurveyCreateOption = ({
    icon: Icon,
    title,
    description,
    href,
}: Props) => {
    return (
        <Link
            className="flex flex-1 flex-col items-center justify-center gap-3 rounded-lg bg-[#261F36]"
            to={href}
        >
            {/* <Icon /> */}
            <Header
                title={title}
                description={description}
                className="text-center"
            />
        </Link>
    );
};
