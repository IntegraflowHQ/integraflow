import { AnalyticsEnum, useAnalytics } from "@/hooks/useAnalytics";
import { cn } from "@/utils";
import { useState } from "react";
import Button from "../Button/Button";

type Props = React.HTMLAttributes<HTMLDivElement> & {
    eventProperties: {
        screen?: string;
        feature?: string;
        component?: string;
    };
};

export const ComingSoon = ({ className, children, eventProperties, ...props }: Props) => {
    const { capture } = useAnalytics();
    const [buttonText, setButtonText] = useState("Notify me");

    const handleNotify = () => {
        capture(AnalyticsEnum.NOTIFY_ME, {
            screen: eventProperties.screen,
            feature: eventProperties.feature,
            component: eventProperties.component,
        });

        setButtonText("Done");
        const timeoutId = setTimeout(() => {
            setButtonText("Notify me");
        }, 3000);

        return () => clearTimeout(timeoutId);
    };

    return (
        <div className={cn("relative w-full", className ?? "")} {...props}>
            {children}

            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-lg">
                <span className="text-lg text-white">Coming Soon</span>
                <Button
                    variant="secondary"
                    text={buttonText}
                    className="w-max min-w-[140px] px-8 py-[8px]"
                    onClick={handleNotify}
                />
            </div>
        </div>
    );
};
