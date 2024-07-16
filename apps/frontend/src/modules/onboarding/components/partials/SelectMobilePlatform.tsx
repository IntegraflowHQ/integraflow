import { ComingSoon } from "@/ui";
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
            <ComingSoon
                className="rounded-lg border border-intg-bg-14 hover:border-intg-bg-2"
                eventProperties={{ feature: "Android sdk" }}
            >
                <Platform name="Android" image={Android} onClick={() => setMobilePlatform("android")} comingSoon />
            </ComingSoon>

            <ComingSoon
                className="rounded-lg border border-intg-bg-14 hover:border-intg-bg-2"
                eventProperties={{ feature: "IOS SDK" }}
            >
                <Platform name="IOS" image={IOS} onClick={() => setMobilePlatform("ios")} comingSoon />
            </ComingSoon>
            <ComingSoon
                className="rounded-lg border border-intg-bg-14 hover:border-intg-bg-2"
                eventProperties={{ feature: "React Native SDK" }}
            >
                <Platform name="React Native" image={ReactNative} comingSoon onClick={() => setMobilePlatform("rn")} />
            </ComingSoon>
            <ComingSoon
                className="rounded-lg border border-intg-bg-14 hover:border-intg-bg-2"
                eventProperties={{ feature: "Flutter SDK" }}
            >
                <Platform name="Flutter" image={Flutter} comingSoon onClick={() => setMobilePlatform("flutter")} />
            </ComingSoon>
        </div>
    );
}
