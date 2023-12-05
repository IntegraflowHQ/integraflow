import { Button } from "@/ui";
import { useOnboarding } from "../../states/onboarding";
import { SwitchProps } from "../Container";
import PlatformRequired from "../partials/PlatformRequired";
import IntegrateMobile from "./IntegrateMobile";
import IntegrateWeb from "./IntegrateWeb";

export default function IntegrateSDK({ onComplete, ...props }: SwitchProps) {
    const { eventSource, mobilePlatform } = useOnboarding();
    let title = "";

    if (eventSource === "web") {
        title = "Connect your web app or product";
    }

    if (eventSource === "mobile") {
        title =
            mobilePlatform === "android"
                ? "Setup Android"
                : mobilePlatform === "ios"
                ? "Setup iOS"
                : mobilePlatform === "rn"
                ? "Setup React Native"
                : "Setup Flutter";
    }

    return (
        <PlatformRequired title={title} {...props}>
            {eventSource === "web" && <IntegrateWeb />}
            {eventSource === "mobile" && <IntegrateMobile />}
            <div className="pt-8">
                <Button text="Continue" onClick={onComplete} />
            </div>
        </PlatformRequired>
    );
}
