import useChannels from "@/modules/surveys/hooks/useChannels";
import { ParsedChannel } from "@/types";
import { ContainerWithTooltip, Dialog, DialogContent, DialogTrigger, Header } from "@/ui";
import { Copy, QRCode, SettingsIcon, Trash } from "@/ui/icons";
import { cn, copyToClipboard } from "@/utils";
import { ExternalLink } from "lucide-react";
import { useState } from "react";
import EditLink from "./EditLink";
import QRCodeView from "./QRCodeview";

export type LinkProps = {
    link: ParsedChannel;
};

const LINK_SURVEY_HOST = import.meta.env.VITE_LINK_SURVEY_HOST ?? "https://surveys.useintegraflow.com";

export default function Link({ link }: LinkProps) {
    const [editing, setEditing] = useState(false);
    const settings = link.settings;
    const { deleteChannel } = useChannels();
    const url = `${LINK_SURVEY_HOST}/${link.link}`;

    return (
        <div className="flex items-center justify-between rounded-lg bg-intg-bg-14 p-4">
            <Header variant="3" title={settings.name || "Link"} description={url} font="medium" />

            <div className={cn("flex gap-2 transition-opacity duration-300 ease-in")}>
                <ContainerWithTooltip text={"Copy"}>
                    <button
                        onClick={() => {
                            copyToClipboard(url, "Link copied to clipboard!");
                        }}
                    >
                        <Copy />
                    </button>
                </ContainerWithTooltip>

                <ContainerWithTooltip text={"QR code"}>
                    <Dialog>
                        <DialogTrigger>
                            <QRCode />
                        </DialogTrigger>
                        <DialogContent title={"QR Code"}>
                            <QRCodeView url={url} name={settings.name || "Link"} />
                        </DialogContent>
                    </Dialog>
                </ContainerWithTooltip>

                <ContainerWithTooltip text={"Settings"}>
                    <Dialog open={editing} onOpenChange={(value) => setEditing(value)}>
                        <DialogTrigger onClick={() => setEditing(true)}>
                            <SettingsIcon />
                        </DialogTrigger>
                        <DialogContent title={`${settings.name} settings`}>
                            <EditLink link={link} settings={settings} close={() => setEditing(false)} />
                        </DialogContent>
                    </Dialog>
                </ContainerWithTooltip>

                <ContainerWithTooltip text={"Open"}>
                    <a href={url} className="text-intg-text" target="_blank">
                        <ExternalLink size={20} />
                    </a>
                </ContainerWithTooltip>

                <ContainerWithTooltip text={"Delete"}>
                    <button onClick={() => deleteChannel(link)}>
                        <Trash />
                    </button>
                </ContainerWithTooltip>
            </div>
        </div>
    );
}
