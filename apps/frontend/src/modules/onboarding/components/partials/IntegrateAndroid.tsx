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
                        type="single"
                        block={{
                            language: "java",
                            code: androidInstall,
                        }}
                    />
                </div>

                <div className="space-y-2">
                    <Header variant="4" title="Configure" />
                    <CodeBlock
                        type="multiple"
                        blocks={[
                            {
                                title: "Java",
                                language: "java",
                                code: androidConfigure,
                            },
                            {
                                title: "Kotlin",
                                language: "kotlin",
                                code: androidConfigure,
                            },
                        ]}
                    />
                </div>

                <div className="space-y-2">
                    <Header variant="4" title="Send an event with Java" />
                    <CodeBlock
                        type="single"
                        block={{
                            language: "java",
                            code: androidSendEvent,
                        }}
                    />
                </div>

                <div className="space-y-2">
                    <Header variant="4" title="Send an event with Kotlin" />
                    <CodeBlock
                        type="single"
                        block={{
                            language: "kotlin",
                            code: androidSendEvent,
                        }}
                    />
                </div>
            </div>
        </>
    );
}
