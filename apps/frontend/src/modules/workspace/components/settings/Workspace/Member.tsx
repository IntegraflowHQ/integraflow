import { WorkspaceInvite } from "@/modules/workspace/components/invite/WorkspaceInvite";
import { useWorkspaceInvite } from "@/modules/workspace/hooks/useWorkspaceInvite";
import { Button, Header, TextInput } from "@/ui";
import { Copy, PlusCircle, Search } from "@/ui/icons";
import { copyToClipboard } from "@/utils";
import { RefreshCcwIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { InviteList } from "./components/InviteList";
import { MemberList } from "./components/MemberList";

export const Member = () => {
    const { getInviteLink, resetInviteLink, loading } = useWorkspaceInvite();

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

    const handleInviteLinkRefresh = async () => {
        const response = await resetInviteLink();
        if (response?.inviteLink) {
            setInviteLink(`${window.location.host}${response?.inviteLink}`);
        }
    };

    return (
        <div className="w-[810px] pt-10 text-intg-text-4">
            <div className="space-y-4">
                <Header
                    title="Invite Link"
                    description="Invite link will provide a unique URL that allows anyone to join your organization."
                    variant="3"
                />

                <div className="flex w-full items-end gap-2">
                    <div className="flex-1">
                        <TextInput
                            placeholder=""
                            inputSize="md"
                            value={inviteLink}
                            disabled={true}
                            rightIcon={
                                <Button
                                    variant="custom"
                                    size="sm"
                                    disabled={loading}
                                    onClick={handleInviteLinkRefresh}
                                    icon={<RefreshCcwIcon size={16} className={loading ? "spinner__circle" : ""} />}
                                />
                            }
                        />
                    </div>
                    <div className="w-[92px]">
                        <Button
                            text="Copy"
                            size="sm"
                            icon={<Copy color="#FFFFFF" />}
                            textAlign="center"
                            onClick={() => copyToClipboard(inviteLink, "Invite link copied to clipboard")}
                        />
                    </div>
                </div>
            </div>
            <hr className="my-6 border-[1px] border-intg-bg-4" />
            <div className="space-y-6">
                <Header
                    title="Manage members"
                    description="Invite others to your project to collaborate together in Integraflow. An invite is specific to an email address and expires after 3 days."
                    variant="3"
                />
                <div className="flex justify-between">
                    <div className="basis-[40%]">
                        <TextInput
                            placeholder="Search by name or email"
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            icon={Search}
                            className="w-full"
                            inputSize="md"
                        />
                    </div>
                    <div>
                        <Button
                            icon={<PlusCircle />}
                            size="sm"
                            text="Invite team member"
                            onClick={() => setOpenInviteModal(true)}
                        />
                    </div>
                    <WorkspaceInvite
                        open={openInviteModal}
                        onOpenChange={(value) => {
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
