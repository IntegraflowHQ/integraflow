import Android from "assets/images/onboarding/integrate-android.png";
import Flutter from "assets/images/onboarding/integrate-flutter.png";
import IOS from "assets/images/onboarding/integrate-ios.png";
import ReactNative from "assets/images/onboarding/integrate-react-native.png";
import { useOnboarding } from "../../hooks/useOnboarding";
import Platform from "./Platform";

export default function SelectMobilePlatform() {
    const { setMobilePlatform } = useOnboarding();
    return (
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
    );
}
