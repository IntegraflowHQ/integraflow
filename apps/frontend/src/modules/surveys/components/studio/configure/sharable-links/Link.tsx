import { SurveyChannelCountableEdge } from "@/generated/graphql";
import useChannels from "@/modules/surveys/hooks/useChannels";
import type { LinkSettings } from "@/types";
import { Dialog, DialogContent, DialogTrigger } from "@/ui";
import { Copy, Trash } from "@/ui/icons";
import { cn, copyToClipboard } from "@/utils";
import { QrCode, SendHorizontal, SettingsIcon } from "lucide-react";
import QRCode from "qrcode.react";
import { useState } from "react";
import EditLink from "./EditLink";

export type LinkProps = {
    link: SurveyChannelCountableEdge["node"];
};

export default function Link({ link }: LinkProps) {
    const [editing, setEditing] = useState(false);
    const settings: LinkSettings = JSON.parse(link.settings) as LinkSettings;
    const { deleteChannel } = useChannels();

    return (
        <div key={link.id} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
                <div className="flex h-[40px] w-[40px] items-center justify-center rounded-lg bg-intg-bg-8">
                    <SendHorizontal
                        className="text-intg-text"
                        size={20}
                        strokeWidth={1}
                    />
                </div>
                <div className="flex flex-col">
                    <span className="text-sm text-intg-text">
                        {settings.name}
                    </span>
                    <span className="text-xs text-intg-text">
                        useintegraflow.com
                    </span>
                </div>
            </div>

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
                        <QrCode className="text-intg-text" />
                    </DialogTrigger>
                    <DialogContent>
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col items-center justify-center gap-2">
                                <QRCode
                                    value={"useintegraflow.com"}
                                    className="bg-transparent"
                                    size={150}
                                    strokeWidth={1}
                                    bgColor="#00000000"
                                    fgColor="#FFFFFF"
                                />
                                <span className="text-sm text-intg-text">
                                    Scan this QR code to open the link on your
                                    phone
                                </span>
                            </div>
                            <div className="flex flex-col items-center justify-center gap-2">
                                <span className="text-sm text-intg-text">
                                    Or copy the link below
                                </span>

                                <span className="px-2 py-1 text-sm text-white">
                                    {"useintegraflow.com"}
                                </span>

                                <button
                                    onClick={() => {
                                        copyToClipboard(
                                            "useintegraflow.com",
                                            "Link copied to clipboard!",
                                        );
                                    }}
                                    className="text-sm text-intg-text underline"
                                >
                                    Copy link
                                </button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>

                <Dialog
                    open={editing}
                    onOpenChange={(value) => setEditing(value)}
                >
                    <DialogTrigger onClick={() => setEditing(true)}>
                        <SettingsIcon className="text-intg-text" />
                    </DialogTrigger>
                    <DialogContent>
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
