import {
    SurveyChannelCountableEdge,
    SurveyChannelTypeEnum,
} from "@/generated/graphql";
import useChannels from "@/modules/surveys/hooks/useChannels";
import { Button, Header } from "@/ui";
import { SendHorizontal } from "lucide-react";
import Link from "./Link";

export default function SharableLinks() {
    const { channels, createChannel } = useChannels();
    const linkChannels =
        channels?.channels?.edges.filter(
            (edge) => edge.node.type === SurveyChannelTypeEnum.Link,
        ) || ([] as SurveyChannelCountableEdge[]);

    const handleCreate = async () => {
        await createChannel({
            type: SurveyChannelTypeEnum.Link,
            id: crypto.randomUUID(),
        });
    };

    console.log("linkChannels", linkChannels);

    return (
        <div className="mx-auto h-full w-full p-4">
            {linkChannels.length ? (
                <div className="flex h-full w-full flex-col gap-6">
                    <div className="flex items-center justify-between border-b border-intg-bg-4 pb-2">
                        <Header
                            variant="2"
                            title="Sharable links"
                            font="medium"
                            description="Create survey links or QR codes to distribute your survey."
                        />
                        <Button
                            text="Create link"
                            className="w-max px-[12px] py-[8px]"
                            onClick={handleCreate}
                        />
                    </div>

                    <div className="scrollbar-hide flex h-full w-full flex-1 justify-center overflow-y-scroll">
                        <div className=" flex h-full w-full max-w-4xl flex-col gap-4">
                            {linkChannels.map((link) => (
                                <Link key={link.node.id} link={link.node} />
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex h-full w-full flex-col items-center justify-center">
                    <SendHorizontal
                        className="text-intg-text"
                        size={150}
                        strokeWidth={1}
                    />
                    <Header
                        title="Nothing to see here yet."
                        description="Create your first link!"
                        className="text-center"
                    />
                    <Button
                        text="Create link"
                        className="mt-4 w-max px-[12px] py-[8px]"
                        onClick={handleCreate}
                    />
                </div>
            )}
        </div>
    );
}
