import { CodeBlock, Header } from "@/ui";
import { esmInitSnippet, htmlInitSnippet, webInstallSnippet } from "../../snippets";

export default function IntegrateWeb() {
    return (
        <>
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
                        type="multiple"
                        blocks={[
                            {
                                language: "javascript",
                                code: htmlInitSnippet,
                                title: "HTML",
                            },
                            {
                                language: "javascript",
                                code: esmInitSnippet,
                                title: "ESM",
                            },
                        ]}
                    />
                </div>
            </div>

            <hr className="border border-intg-bg-4" />

            <div className="flex flex-col gap-6 pt-6">
                <Header variant="2" title="Option 2. Install a npm library" />

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
            </div>
        </>
    );
}
