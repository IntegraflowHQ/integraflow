import { Button, CodeBlock, Header } from "@/ui";
import { htmlInitSnippet, webInstallSnippet } from "../../snippets";
import { useOnboarding } from "../../states/onboarding";
import Container from "../Container";

export default function IntegrateWeb() {
    const { clearEventSource } = useOnboarding();

    return (
        <Container
            title="Connect your web app or product"
            onBack={() => clearEventSource()}
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
