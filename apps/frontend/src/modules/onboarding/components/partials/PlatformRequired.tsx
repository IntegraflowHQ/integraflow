import { Button } from "@/ui";
import { useOnboarding } from "../../hooks/useOnboarding";
import Container, { OnboardingScreenProps } from "../Container";
import SelectEventSource from "./SelectEventSource";
import SelectMobilePlatform from "./SelectMobilePlatform";

export default function PlatformRequired({
    title,
    description,
    webScreen,
    mobileScreen,
    onSkip,
    onBack,
    onComplete,
}: OnboardingScreenProps & { mobileScreen: React.ReactNode; webScreen: React.ReactNode }) {
    const { eventSource, mobilePlatform, setMobilePlatform, clearEventSource } = useOnboarding();

    return (
        <Container
            title={
                !eventSource
                    ? "Where do you want to send events from?"
                    : eventSource === "mobile" && !mobilePlatform
                      ? "Pick a mobile platform"
                      : title
            }
            description={
                !eventSource
                    ? "With Integraflow, you can collect customer feedback from nearly anywhere. Select one to start, and you can always add more sources later."
                    : eventSource === "mobile" && !mobilePlatform
                      ? "We'll provide you with snippets that you can easily add to your codebase to get started!"
                      : description
            }
            onSkip={!eventSource ? onSkip : undefined}
            onBack={mobilePlatform ? () => setMobilePlatform(null) : eventSource ? () => clearEventSource() : onBack}
        >
            {!eventSource ? (
                <SelectEventSource />
            ) : eventSource === "mobile" && !mobilePlatform ? (
                <SelectMobilePlatform />
            ) : (
                <>
                    {eventSource === "web" && webScreen}
                    {eventSource === "mobile" && mobileScreen}

                    <div className="pt-8">
                        <Button
                            text="Continue"
                            onClick={() => {
                                onComplete?.();
                            }}
                        />
                    </div>
                </>
            )}
        </Container>
    );
}
