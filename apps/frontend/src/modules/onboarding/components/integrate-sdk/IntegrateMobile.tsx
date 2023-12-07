import { useOnboarding } from "../../hooks/useOnboarding";
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
