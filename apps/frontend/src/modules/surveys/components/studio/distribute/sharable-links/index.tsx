import { SurveyChannelTypeEnum } from "@/generated/graphql";
import useChannels from "@/modules/surveys/hooks/useChannels";
import { ChannelSettings } from "@/types";
import { Button, Header } from "@/ui";
import { cn } from "@/utils";
import { toast } from "@/utils/toast";
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
                recurring: false,
                startDate: "",
                endDate: "",
            } as ChannelSettings),
        });
    };

    return (
        <div
            className={cn(
                "flex w-full min-w-[660px] flex-col gap-6 rounded-xl bg-intg-bg-9 p-12",
                linkChannels.length ? "min-h-full" : "h-full",
            )}
        >
            <div className="flex items-center justify-between">
                <Header
                    title={"Sharable links"}
                    font="medium"
                    description="Get survey links and QR codes to distribute your survey."
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
                <div className="flex h-full w-full flex-1 justify-center">
                    <div className=" flex h-full w-full flex-col gap-2">
                        {linkChannels.map((link) => (
                            <Link key={link.id} link={link} />
                        ))}
                    </div>
                </div>
            ) : (
                <div className="flex h-full w-full flex-1 flex-col items-center justify-center gap-6">
                    <div className="flex flex-col items-center gap-2">
                        <LinkIcon className="text-intg-text" size={62} strokeWidth={2} />
                        <p className="max-w-[371px] text-center text-sm text-intg-text">
                            There is no link created. Click on 'Add link' button to create your first shareable link for
                            this survey.
                        </p>
                    </div>
                    <Button
                        icon={<LinkIcon size={20} strokeWidth={1} />}
                        text="Add link"
                        className="w-max px-[24px] py-[12px] text-base font-normal"
                        onClick={() => {
                            handleCreate();
                            toast.custom("You are yet to Publish your Survey");
                        }}
                    />
                </div>
            )}
        </div>
    );
}
