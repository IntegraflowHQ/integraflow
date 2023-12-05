import { useOnboarding } from "../../states/onboarding";
import PlatformRequired from "../partials/PlatformRequired";
import IntegrateMobile from "./IntegrateMobile";
import IntegrateWeb from "./IntegrateWeb";

export default function IntegrateIndex() {
    const { eventSource } = useOnboarding();
    return (
        <PlatformRequired>
            {eventSource === "web" && <IntegrateWeb />}
            {eventSource === "mobile" && <IntegrateMobile />}
        </PlatformRequired>
    );
}
