import { SurveyChannelTypeEnum } from "@/generated/graphql";
import useChannels from "@/modules/surveys/hooks/useChannels";
import type { LinkSettings } from "@/types";
import { Button, Header } from "@/ui";
import { LinkIcon } from "lucide-react";
import Link from "./Link";

export default function SharableLinks() {
    const { createChannel, getChannels } = useChannels();
    const linkChannels = getChannels(SurveyChannelTypeEnum.Link);

    const handleCreate = async () => {
        await createChannel({
            type: SurveyChannelTypeEnum.Link,
            id: crypto.randomUUID(),
            settings: JSON.stringify({
                name: `Link ${linkChannels.length + 1}`,
                singleUse: false,
                startDate: linkChannels.length
                    ? null
                    : new Date().toISOString(),
                endDate: null,
            } as LinkSettings),
        });
    };

    console.log("linkChannels", linkChannels);

    return (
        <div className="mx-auto h-full w-full p-12">
            {/* {linkChannels.length ? ( */}
            <div className="flex h-full w-full flex-col gap-6">
                <div className="flex items-center justify-between">
                    <Header
                        title="Sharable links"
                        font="medium"
                        description="Create survey links or QR codes to distribute your survey."
                    />
                    {linkChannels.length ? (
                        <Button
                            icon={<LinkIcon size={20} strokeWidth={1} />}
                            text="Add link"
                            className="w-max px-[24px] py-[12px] text-base font-normal"
                            onClick={handleCreate}
                            variant="secondary"
                        />
                    ) : null}
                </div>

                {linkChannels.length ? (
                    <div className="scrollbar-hide flex h-full w-full flex-1 justify-center overflow-y-scroll">
                        <div className=" flex h-full w-full flex-col gap-2">
                            {linkChannels.map((link) => (
                                <Link key={link.node.id} link={link.node} />
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center gap-6">
                        <div className="flex flex-col items-center">
                            <LinkIcon
                                className="text-intg-text"
                                size={62}
                                strokeWidth={2}
                            />
                            <p className="max-w-[371px] text-center text-sm text-intg-text">
                                There is no link created. Click on 'Add link
                                button to create your first shareable link for
                                this survey.
                            </p>
                        </div>
                        <Button
                            icon={<LinkIcon size={20} strokeWidth={1} />}
                            text="Add link"
                            className="w-max px-[24px] py-[12px] text-base font-normal"
                            onClick={handleCreate}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
