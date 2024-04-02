import { ReactNode } from "react";

type Props = {
    icon: ReactNode;
    title: string;
    number: number;
    text: string;
    graph: ReactNode;
};

export const OverviewCards = ({ icon, title, number, text, graph }: Props) => {
    return (
        <div className="flex-1 bg-intg-bg-9 text-intg-text">
            <p>
                <span>{icon}</span> <span>{title}</span>
            </p>
            <div>
                <div>
                    <p>{number}</p>
                    <p>{text}</p>
                </div>
                <div>graph</div>
            </div>
        </div>
    );
};
