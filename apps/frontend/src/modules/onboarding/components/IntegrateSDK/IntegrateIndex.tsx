import { Button, CodeBlock, Header } from "@/ui";
import Android from "assets/images/onboarding/integrate-android.png";
import Flutter from "assets/images/onboarding/integrate-flutter.png";
import IOS from "assets/images/onboarding/integrate-ios.png";
import Mobile from "assets/images/onboarding/integrate-mobile.png";
import ReactNative from "assets/images/onboarding/integrate-react-native.png";
import Web from "assets/images/onboarding/integrate-web.png";
import { useState } from "react";
import { htmlInitSnippet, webInstallSnippet } from "../../snippets";
import Container from "../Container";
import Platform from "../Platform";
import IntegrateAndroid from "../partials/IntegrateAndroid";
import IntegrateIos from "../partials/IntegrateIos";

export default function IntegrateIndex() {
    const [eventSource, setEventSource] = useState<"web" | "mobile" | null>(
        null,
    );
    const [mobilePlatform, setMobilePlatform] = useState<
        "android" | "ios" | "rn" | "flutter" | null
    >(null);

    if (eventSource == "web") {
        return (
            <Container
                title="Connect your web app or product"
                onBack={() => setEventSource(null)}
            >
                <div className="flex flex-col gap-8 py-6">
                    <Header
                        title="Option 1. Code snippet"
                        description="Simply include this code snippet on your website, and it will seamlessly collect data on page views, sessions, and other meaningful interactions taking place on your site."
                        variant="2"
                    />

                    <div className="flex flex-col gap-4">
                        <Header
                            variant="3"
                            title="Install the snippet"
                            description="Insert this snippet in your website within the <head> tag."
                        />

                        <CodeBlock
                            type="single"
                            block={{
                                language: "javascript",
                                code: htmlInitSnippet,
                            }}
                        />
                    </div>
                </div>

                <hr className="border border-intg-bg-4" />

                <div className="flex flex-col gap-6 pt-6">
                    <Header
                        variant="2"
                        title="Option 2. Install a npm library"
                        description="Insert this snippet in your website within the <head> tag."
                    />

                    <div className="flex flex-col gap-8">
                        <div className="space-y-3">
                            <Header variant="3" title="Install the package" />

                            <CodeBlock
                                type="single"
                                block={{
                                    language: "bash",
                                    code: webInstallSnippet,
                                }}
                            />
                        </div>

                        <Button text="Continue" />
                    </div>
                </div>
            </Container>
        );
    }

    if (eventSource == "mobile") {
        if (!mobilePlatform) {
            return (
                <Container
                    title="Pick a mobile platform"
                    description="We'll provide you with snippets that you can easily add to your codebase to get started!"
                    onBack={() => {
                        setMobilePlatform(null);
                        setEventSource(null);
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
        } else {
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
    }

    return (
        <Container
            title="Where do you want to send events from?"
            description="With integraflow, you can collect customer feedback from nearly anywhere. Select one to start, and you can always add more sources later."
            onSkip={() => {
                console.log("skip");
            }}
        >
            <div className="grid grid-cols-2 gap-2 pt-8">
                <Platform
                    name="Web"
                    image={Web}
                    onClick={() => setEventSource("web")}
                    tall
                />
                <Platform
                    name="Mobile"
                    image={Mobile}
                    onClick={() => setEventSource("mobile")}
                    imagePosition="center"
                    tall
                />
            </div>
        </Container>
    );
}
