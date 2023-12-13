import { SurveyChannelCountableEdge } from "@/generated/graphql";
import useChannels from "@/modules/surveys/hooks/useChannels";
import { ChannelSettings } from "@/types";
import { Dialog, DialogContent, DialogTrigger, Header } from "@/ui";
import { Copy, QRCode, SettingsIcon, Trash } from "@/ui/icons";
import { cn, copyToClipboard } from "@/utils";
import { useState } from "react";
import EditLink from "./EditLink";
import QRCodeView from "./QRCodevie";

export type LinkProps = {
    link: SurveyChannelCountableEdge["node"];
};

export default function Link({ link }: LinkProps) {
    const [editing, setEditing] = useState(false);
    const settings: ChannelSettings = JSON.parse(
        link.settings,
    ) as ChannelSettings;
    const { deleteChannel } = useChannels();

    return (
        <div className="flex items-center justify-between rounded-lg bg-intg-bg-14 p-4">
            <Header
                variant="3"
                title={settings.name || "Link"}
                description="useintegraflow.com"
                font="medium"
            />

            <div
                className={cn(
                    "flex gap-2 transition-opacity duration-300 ease-in",
                )}
            >
                <button
                    onClick={() => {
                        copyToClipboard(
                            "useintegraflow.com",
                            "Link copied to clipboard!",
                        );
                    }}
                >
                    <Copy />
                </button>

                <Dialog>
                    <DialogTrigger>
                        <QRCode />
                    </DialogTrigger>
                    <DialogContent title={"QR Code"}>
                        <QRCodeView url={"useintegraflow.com"} />
                    </DialogContent>
                </Dialog>

                <Dialog
                    open={editing}
                    onOpenChange={(value) => setEditing(value)}
                >
                    <DialogTrigger onClick={() => setEditing(true)}>
                        <SettingsIcon />
                    </DialogTrigger>
                    <DialogContent title={`${settings.name} settings`}>
                        <EditLink
                            link={link}
                            settings={settings}
                            close={() => setEditing(false)}
                        />
                    </DialogContent>
                </Dialog>

                <button onClick={() => deleteChannel(link)}>
                    <Trash />
                </button>
            </div>
        </div>
    );
}
