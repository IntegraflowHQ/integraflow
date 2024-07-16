import { useProject } from "@/modules/projects/hooks/useProject";
import { CodeBlock, Header } from "@/ui";
import { esmInitSnippet, htmlInitSnippet, webInstallSnippet } from "../../snippets";

export default function IntegrateWeb() {
    const { project } = useProject();
    return (
        <>
            <div className="flex flex-col gap-8 py-6">
                <Header
                    title="Option 1. Code snippet"
                    description="Simply include this code snippet on your website, and you can start collecting website and in-product feedback."
                    variant="2"
                />

                <div className="flex flex-col gap-4">
                    <Header
                        variant="3"
                        title="Copy the snippet"
                        description="Insert this snippet in your website within the <head> tag."
                    />

                    <CodeBlock
                        type="single"
                        block={{
                            language: "javascript",
                            code: htmlInitSnippet(project?.apiToken),
                        }}
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

                <div className="space-y-3">
                    <Header variant="3" title="Initialize the SDK" />

                    <CodeBlock
                        type="single"
                        block={{
                            language: "javascript",
                            code: esmInitSnippet(project?.apiToken),
                        }}
                    />
                </div>
            </div>
        </>
    );
}
