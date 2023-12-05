import { useOnboarding } from "../../states/onboarding";
import IntegrateAndroid from "./IntegrateAndroid";
import IntegrateIos from "./IntegrateIos";

export default function IntegrateMobile() {
    const { mobilePlatform } = useOnboarding();

    return (
        <>
            {mobilePlatform === "android" && <IntegrateAndroid />}
            {mobilePlatform === "ios" && <IntegrateIos />}
        </>
    );
}
