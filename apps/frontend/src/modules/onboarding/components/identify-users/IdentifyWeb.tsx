import { CodeBlock, Header } from "@/ui";
import { esmIdentify, htmlIdentify } from "../../snippets";

export const IdentifyWeb = () => {
    return (
        <>
            <div className="flex flex-col gap-8 py-6">
                <Header title="Option 1. HTML" variant="2" />

                <div className="flex flex-col gap-4">
                    <Header
                        variant="3"
                        title="Copy the snippet"
                        description="Insert the snippet in the <script> tag to identify users on your website."
                    />

                    <CodeBlock
                        type="single"
                        block={{
                            language: "javascript",
                            code: htmlIdentify,
                        }}
                    />
                </div>
            </div>

            <hr className="border border-intg-bg-4" />

            <div className="flex flex-col gap-6 pt-6">
                <Header variant="2" title="Option 2. ESM" />

                <div className="space-y-3">
                    <Header variant="3" title="Copy the ESM snippet." />

                    <CodeBlock
                        type="single"
                        block={{
                            language: "javascript",
                            code: esmIdentify,
                        }}
                    />
                </div>
            </div>
        </>
    );
};
