import Android from "assets/images/onboarding/integrate-android.png";
import Flutter from "assets/images/onboarding/integrate-flutter.png";
import IOS from "assets/images/onboarding/integrate-ios.png";
import ReactNative from "assets/images/onboarding/integrate-react-native.png";
import { useOnboarding } from "../../states/onboarding";
import Container from "../Container";
import Platform from "./Platform";

export default function SelectMobilePlatform() {
    const { clearEventSource, setMobilePlatform } = useOnboarding();
    return (
        <Container
            title="Pick a mobile platform"
            description="We'll provide you with snippets that you can easily add to your codebase to get started!"
            onBack={() => {
                clearEventSource();
            }}
        >
            <div className="grid grid-cols-2 gap-2 pt-8">
                <Platform
                    name="Android"
                    image={Android}
                    onClick={() => setMobilePlatform("android")}
                />
                <Platform
                    name="IOS"
                    image={IOS}
                    onClick={() => setMobilePlatform("ios")}
                />
                <Platform
                    name="React Native"
                    image={ReactNative}
                    comingSoon
                    onClick={() => {}}
                />
                <Platform
                    name="Flutter"
                    image={Flutter}
                    comingSoon
                    onClick={() => {}}
                />
            </div>
        </Container>
    );
}
