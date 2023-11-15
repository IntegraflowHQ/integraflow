import { CodeBlock, Header } from "@/ui";
import {
    androidConfigure,
    androidInstall,
    androidSendEvent,
} from "../../snippets";

export default function IntegrateAndroid() {
    return (
        <>
            <div className="flex flex-col gap-6 pt-6">
                <div className="space-y-2">
                    <Header variant="4" title="Install" />
                    <CodeBlock
                        blocks={[
                            {
                                language: "java",
                                code: androidInstall,
                            },
                        ]}
                    />
                </div>

                <div className="space-y-2">
                    <Header variant="4" title="Configure" />
                    <CodeBlock
                        blocks={[
                            {
                                language: "java",
                                code: androidConfigure,
                            },
                        ]}
                    />
                </div>

                <div className="space-y-2">
                    <Header variant="4" title="Send an event" />
                    <CodeBlock
                        blocks={[
                            {
                                language: "java",
                                code: androidSendEvent,
                            },
                        ]}
                    />
                </div>
            </div>
        </>
    );
}
