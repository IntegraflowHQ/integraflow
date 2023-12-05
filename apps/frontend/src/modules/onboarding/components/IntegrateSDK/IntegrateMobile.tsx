import { Button } from "@/ui";
import { useOnboarding } from "../../states/onboarding";
import Container from "../Container";
import IntegrateAndroid from "../partials/IntegrateAndroid";
import IntegrateIos from "../partials/IntegrateIos";

export default function IntegrateMobile() {
    const { mobilePlatform, setMobilePlatform } = useOnboarding();

    return (
        <Container
            title={
                mobilePlatform === "android"
                    ? "Setup Android"
                    : mobilePlatform === "ios"
                    ? "Setup iOS"
                    : mobilePlatform === "rn"
                    ? "Setup React Native"
                    : "Setup Flutter"
            }
            onBack={() => setMobilePlatform(null)}
        >
            {mobilePlatform === "android" && <IntegrateAndroid />}
            {mobilePlatform === "ios" && <IntegrateIos />}

            <div className="pt-8">
                <Button text="Continue" />
            </div>
        </Container>
    );
}
