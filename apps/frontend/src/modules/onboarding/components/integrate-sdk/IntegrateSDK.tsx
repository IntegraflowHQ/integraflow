import { useOnboarding } from "../../hooks/useOnboarding";
import { SwitchProps } from "../Container";
import PlatformRequired from "../partials/PlatformRequired";
import IntegrateMobile from "./IntegrateMobile";
import IntegrateWeb from "./IntegrateWeb";

export default function IntegrateSDK(props: SwitchProps) {
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
        <PlatformRequired title={title} webScreen={<IntegrateWeb />} mobileScreen={<IntegrateMobile />} {...props} />
    );
}
