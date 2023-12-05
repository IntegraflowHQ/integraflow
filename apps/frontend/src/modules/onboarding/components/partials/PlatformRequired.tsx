import React from "react";
import { useOnboarding } from "../../states/onboarding";
import SelectEventSource from "./SelectEventSource";
import SelectMobilePlatform from "./SelectMobilePlatform";

type Props = {
    children: React.ReactNode;
};

export default function PlatformRequired({ children }: Props) {
    const { eventSource, mobilePlatform } = useOnboarding();

    if (eventSource == null) {
        return <SelectEventSource />;
    }

    if (eventSource == "mobile" && mobilePlatform == null) {
        return <SelectMobilePlatform />;
    }

    return <>{children}</>;
}
