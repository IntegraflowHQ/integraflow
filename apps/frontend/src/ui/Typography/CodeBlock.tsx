import * as Tabs from "@radix-ui/react-tabs";
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import bash from "react-syntax-highlighter/dist/esm/languages/hljs/bash";
import java from "react-syntax-highlighter/dist/esm/languages/hljs/java";
import js from "react-syntax-highlighter/dist/esm/languages/hljs/javascript";
import objectiveC from "react-syntax-highlighter/dist/esm/languages/hljs/objectivec";
import swift from "react-syntax-highlighter/dist/esm/languages/hljs/swift";
import atomOneDark from "react-syntax-highlighter/dist/esm/styles/hljs/atom-one-dark";

SyntaxHighlighter.registerLanguage("javascript", js);
SyntaxHighlighter.registerLanguage("bash", bash);
SyntaxHighlighter.registerLanguage("java", java);
SyntaxHighlighter.registerLanguage("swift", swift);
SyntaxHighlighter.registerLanguage("objective-c", objectiveC);

interface Code {
    language: string;
    code: string;
    title?: string;
}

interface Props {
    blocks: Code[];
}

export function CodeBlock({ blocks }: Props) {
    if (blocks && blocks.length > 1) {
        return (
            <Tabs.Root
                className="flex flex-col"
                defaultValue={blocks[0].language}
            >
                <Tabs.List className="bg-intg-bg-12 flex justify-end gap-2 rounded-t-lg px-[19px] pb-[5px] pt-[10px]">
                    {blocks.map((block) => (
                        <Tabs.Trigger
                            key={block.language}
                            value={block.language}
                            className="text-intg-text-8 px-[3px] data-[state=active]:border-b data-[state=active]:border-[#299532] data-[state=active]:bg-gradient-button-hover data-[state=active]:bg-clip-text data-[state=active]:text-transparent"
                        >
                            {block.title}
                        </Tabs.Trigger>
                    ))}
                </Tabs.List>

                {blocks.map((block) => (
                    <Tabs.Content value={block.language} asChild>
                        <SyntaxHighlighter
                            language={block.language}
                            style={atomOneDark}
                            customStyle={{ background: "#29233E" }}
                            className="scrollbar-hide rounded-b-lg"
                        >
                            {block.code}
                        </SyntaxHighlighter>
                    </Tabs.Content>
                ))}
            </Tabs.Root>
        );
    }

    return (
        <SyntaxHighlighter
            language={blocks[0].language}
            style={atomOneDark}
            customStyle={{ background: "#29233E" }}
            className="scrollbar-hide rounded-lg"
        >
            {blocks[0].code}
        </SyntaxHighlighter>
    );
}
