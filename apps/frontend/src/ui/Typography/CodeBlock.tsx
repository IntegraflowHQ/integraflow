import { toast } from "@/utils/toast";
import * as Tabs from "@radix-ui/react-tabs";
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import bash from "react-syntax-highlighter/dist/esm/languages/hljs/bash";
import java from "react-syntax-highlighter/dist/esm/languages/hljs/java";
import js from "react-syntax-highlighter/dist/esm/languages/hljs/javascript";
import objectiveC from "react-syntax-highlighter/dist/esm/languages/hljs/objectivec";
import swift from "react-syntax-highlighter/dist/esm/languages/hljs/swift";
import atomOneDark from "react-syntax-highlighter/dist/esm/styles/hljs/atom-one-dark";
import { Copy } from "../icons";

SyntaxHighlighter.registerLanguage("javascript", js);
SyntaxHighlighter.registerLanguage("bash", bash);
SyntaxHighlighter.registerLanguage("java", java);
SyntaxHighlighter.registerLanguage("swift", swift);
SyntaxHighlighter.registerLanguage("objective-c", objectiveC);

type Code = {
    language: string;
    code: string;
};

type WithTitle = Code & {
    title: string;
};

type Single = {
    type: "single";
    block: Code;
};
type Multiple = {
    type: "multiple";
    blocks: WithTitle[];
};

type Props = Single | Multiple;

const CopyButton = ({ onClick }: { onClick: () => void }) => (
    <button onClick={onClick} className="absolute right-4 top-4">
        <Copy />
    </button>
);

export function CodeBlock(block: Props) {
    const copyText = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success("Copied!");
    };

    if (block.type === "multiple") {
        return (
            <Tabs.Root
                className="flex flex-col"
                defaultValue={block.blocks[0].language}
            >
                <Tabs.List className="bg-intg-bg-12 flex justify-end gap-2 rounded-t-lg px-[19px] pb-[5px] pt-[10px]">
                    {block.blocks.map((block) => (
                        <Tabs.Trigger
                            key={block.language}
                            value={block.language}
                            className="text-intg-text-8 px-[3px] data-[state=active]:border-b data-[state=active]:border-[#299532] data-[state=active]:bg-gradient-button-hover data-[state=active]:bg-clip-text data-[state=active]:text-transparent"
                        >
                            {block.title}
                        </Tabs.Trigger>
                    ))}
                </Tabs.List>

                {block.blocks.map((block) => (
                    <Tabs.Content value={block.language} className="relative">
                        <CopyButton
                            onClick={() => {
                                copyText(block.code);
                            }}
                        />
                        <SyntaxHighlighter
                            language={block.language}
                            style={atomOneDark}
                            customStyle={{
                                background: "#29233E",
                                padding: "16px",
                                paddingTop: "23px",
                            }}
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
        <div className="relative">
            <CopyButton
                onClick={() => {
                    copyText(block.block.code);
                }}
            />
            <SyntaxHighlighter
                language={block.block.language}
                style={atomOneDark}
                customStyle={{ background: "#29233E", padding: "1rem" }}
                className="scrollbar-hide rounded-lg"
            >
                {block.block.code}
            </SyntaxHighlighter>
        </div>
    );
}
