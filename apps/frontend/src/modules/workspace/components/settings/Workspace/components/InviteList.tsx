import { User } from "@/generated/graphql";
import { useAuth } from "@/modules/auth/hooks/useAuth";
import { useWorkspace } from "@/modules/workspace/hooks/useWorkspace";
import { useWorkspaceInvite } from "@/modules/workspace/hooks/useWorkspaceInvite";
import { toast } from "@/utils/toast";
import { DeepPartial } from "@apollo/client/utilities";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { MoreHorizontal } from "lucide-react";

export const InviteList = () => {
    const { user, updateUser } = useAuth();
    const { workspace } = useWorkspace();
    const { resendInviteLink, revokeInviteLink } = useWorkspaceInvite();

    const handleResendInviteLink = async (id: string) => {
        const response = await resendInviteLink(id);
        if (response?.organizationInvite) {
            toast.success(`A new link has been sent to the ${response.organizationInvite.email}`);
            return;
        }
        if (response?.organizationErrors.length) {
            toast.error(response.organizationErrors[0].message as string);
            return;
        }
    };

    const handleRevokeInviteLink = async (id: string) => {
        const response = await revokeInviteLink(id);
        if (response?.organizationInvite) {
            const updatedUser = JSON.parse(JSON.stringify(user)) as DeepPartial<User>;
            const currentOrganization = updatedUser.organizations?.edges?.find(
                (org) => org?.node?.id === workspace?.id,
            );

            if (currentOrganization?.node?.invites) {
                currentOrganization.node.invites.edges = currentOrganization?.node?.invites?.edges?.filter(
                    (invite) => invite?.node?.id !== response.organizationInvite?.id,
                );
            }

            updateUser(updatedUser);

            toast.success(`The invite sent to ${response.organizationInvite.email} has been revoked `);
            return;
        }
        if (response?.organizationErrors.length) {
            toast.error(response.organizationErrors[0].message as string);
            return;
        }
    };

    return (
        <div className="mt-6">
            {(workspace?.invites?.edges?.length as number) > 0 && (
                <h3 className="font-semibold">
                    {workspace?.invites?.edges?.length}{" "}
                    {workspace?.invites?.edges && workspace?.invites?.edges?.length > 1 ? "invites" : "invite"}
                </h3>
            )}
            {workspace?.invites?.edges?.map((invite, index) => {
                return (
                    <div key={invite?.node?.id}>
                        {index !== 0 && <hr className="border-[1px] border-intg-bg-4" />}
                        <div className="flex items-center justify-between px-2 py-3">
                            <div className="basis-[60%]">
                                <p className="font-sm font-medium">
                                    {invite?.node?.firstName} {invite?.node?.firstName}
                                </p>
                                <p className="font-sm">{invite?.node?.email}</p>
                            </div>
                            <DropdownMenu.Root>
                                <DropdownMenu.Trigger asChild>
                                    <button className="w-fit rounded-md px-1 py-1 transition-all duration-300 ease-in hover:cursor-pointer hover:bg-intg-bg-1 data-[state=a]:bg-intg-bg-1">
                                        <MoreHorizontal color="#AFAAC7" />
                                    </button>
                                </DropdownMenu.Trigger>

                                <DropdownMenu.Portal>
                                    <DropdownMenu.Content
                                        align="end"
                                        alignOffset={5}
                                        className="w-[140px] rounded-md border border-intg-bg-4 bg-intg-bg-8 px-3 py-4"
                                    >
                                        <DropdownMenu.Item
                                            onClick={() => {
                                                handleResendInviteLink(invite?.node?.id as string);
                                            }}
                                            className="flex gap-[6px] rounded-md px-2 py-[7px] text-sm font-normal text-intg-text-4 hover:cursor-pointer hover:bg-intg-bg-1"
                                        >
                                            Resend Invite
                                        </DropdownMenu.Item>
                                        <DropdownMenu.Item
                                            onClick={() => handleRevokeInviteLink(invite?.node?.id as string)}
                                            className="flex gap-[6px] rounded-md px-2 py-[7px] text-sm font-normal text-intg-text-4 hover:cursor-pointer hover:bg-intg-bg-1"
                                        >
                                            Revoke Invite
                                        </DropdownMenu.Item>
                                    </DropdownMenu.Content>
                                </DropdownMenu.Portal>
                            </DropdownMenu.Root>
                        </div>
                        {index !== 0 && <hr className="border-[1px] border-intg-bg-4" />}
                    </div>
                );
            })}
        </div>
    );
};
