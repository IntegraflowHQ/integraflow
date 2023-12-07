import { CodeBlock, Header } from "@/ui";
import {
    androidConfigure,
    androidInstall,
    androidSendEvent,
} from "../../snippets";

export default function IntegrateIos() {
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
                                language: "swift",
                                code: androidConfigure,
                                title: "Swift",
                            },
                            {
                                language: "objective-c",
                                code: androidConfigure,
                                title: "Objective-C",
                            },
                        ]}
                    />
                </div>

                <div className="space-y-2">
                    <Header variant="4" title="Send an event with swift" />
                    <CodeBlock
                        type="single"
                        block={{
                            language: "java",
                            code: androidSendEvent,
                        }}
                    />
                </div>

                <div className="space-y-2">
                    <Header
                        variant="4"
                        title="Send an event with Objective-C"
                    />
                    <CodeBlock
                        type="single"
                        block={{
                            language: "java",
                            code: androidSendEvent,
                        }}
                    />
                </div>
            </div>
        </>
    );
}
