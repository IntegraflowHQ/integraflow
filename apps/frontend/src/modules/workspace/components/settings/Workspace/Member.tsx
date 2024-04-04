import { OrganizationInvite } from "@/modules/workspace/components/invite/OrganizationInvite";
import { useWorkspaceInvite } from "@/modules/workspace/hooks/useWorkspaceInvite";
import { Button, TextInput } from "@/ui";
import { PlusCircle, Search } from "@/ui/icons";
import { addEllipsis, copyToClipboard } from "@/utils";
import { CopyIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { InviteList } from "./components/InviteList";
import { MemberList } from "./components/MemberList";

export const Member = () => {
    const { getInviteLink } = useWorkspaceInvite();

    const [inviteLink, setInviteLink] = useState("");
    const [openInviteModal, setOpenInviteModal] = useState(false);
    const [searchValue, setSearchValue] = useState("");

    const handleLinkInvite = async () => {
        const response = await getInviteLink();
        if (response?.inviteLink) {
            setInviteLink(`${window.location.host}${response?.inviteLink}`);
        }
    };
    useEffect(() => {
        handleLinkInvite();
    }, []);

    return (
        <div className="w-[810px] pt-10 text-intg-text-4">
            <div className="space-y-4">
                <div>
                    <h3 className="font-semibold">Invite Link</h3>
                    <p className="text-sm">
                        Invite link will provide a unique URL that allow anyone to join your organization
                    </p>
                </div>

                <div className="flex w-full items-end gap-2">
                    <div className="w-[75%]">
                        <TextInput placeholder="" value={addEllipsis(inviteLink, 40)} disabled={true} />
                    </div>
                    <div className="w-[25%]">
                        <Button
                            text="Copy"
                            size="md"
                            className="text-sm"
                            icon={<CopyIcon size={16} />}
                            textAlign="center"
                            onClick={() => copyToClipboard(inviteLink, "Invite link copied to clipboard")}
                        />
                    </div>
                    p
                </div>
            </div>
            <hr className="my-6 border-[1px] border-intg-bg-4" />
            <div className="space-y-6">
                <div>
                    <h3 className="font-semibold">Manage members</h3>
                    <p className="text-sm">
                        Invite others to your project to collaborate together in intergraflow. An invite is specific to
                        an email address and expires after 3 days.
                    </p>
                </div>
                <div className="flex justify-between">
                    <div className="basis-[40%]">
                        <TextInput
                            placeholder="Search by name or email"
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            icon={Search}
                            className="w-full"
                        />
                    </div>
                    <div>
                        <Button className="flex items-center gap-2 " size="md" onClick={() => setOpenInviteModal(true)}>
                            <span>
                                <PlusCircle />
                            </span>
                            <span>Invite team member</span>
                        </Button>
                    </div>
                    <OrganizationInvite
                        open={openInviteModal}
                        onOpenChange={(value) => {
                            console.log(value);
                            setOpenInviteModal(value);
                        }}
                    />
                </div>
                <MemberList searchValue={searchValue} />
                <InviteList />
            </div>
        </div>
    );
};
