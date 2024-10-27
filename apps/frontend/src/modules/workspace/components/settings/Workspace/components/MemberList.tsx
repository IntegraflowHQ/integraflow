import { Organization, OrganizationMemberCountableEdge, Project, RoleLevel, User } from "@/generated/graphql";
import { useAuth } from "@/modules/auth/hooks/useAuth";
import { convertToAuthOrganization } from "@/modules/auth/states/user";
import { useWorkspace } from "@/modules/workspace/hooks/useWorkspace";
import { useWorkspaceInvite } from "@/modules/workspace/hooks/useWorkspaceInvite";
import { ROUTES } from "@/routes";
import { GlobalSpinner } from "@/ui";
import { DeepPartial } from "@apollo/client/utilities";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

type Props = {
    searchValue: string;
};

export const MemberList = ({ searchValue }: Props) => {
    const navigate = useNavigate();
    const { workspace } = useWorkspace();
    const { user, switchWorkspace, organizations, updateUser } = useAuth();
    const { removeOrganizationMember, leaveOrganization, updateMemberRole, loading } = useWorkspaceInvite();

    const [filteredMembers, setFilteredMembers] = useState<OrganizationMemberCountableEdge[]>([]);

    useEffect(() => {
        if (searchValue) {
            const value = searchValue.toLowerCase();
            const filtered = workspace?.members?.edges?.filter(
                (member) =>
                    `${member?.node?.firstName} ${member?.node?.lastName}`.toLowerCase().includes(value) ||
                    member?.node?.email?.toLowerCase().includes(value),
            );
            setFilteredMembers(filtered as OrganizationMemberCountableEdge[]);
        } else {
            setFilteredMembers(workspace?.members?.edges as OrganizationMemberCountableEdge[]);
        }
    }, [searchValue, workspace?.members?.edges]);

    const handleLeaveOrganization = async (organizationId: string) => {
        const response = await leaveOrganization(organizationId);

        if (response) {
            const remainingOrganizations = organizations.filter((org) => org?.id !== response.organization?.id);

            if (remainingOrganizations && remainingOrganizations[0]?.projects?.edges?.length) {
                switchWorkspace(
                    convertToAuthOrganization(remainingOrganizations[0]) as Organization,
                    remainingOrganizations[0].projects?.edges[0]?.node as Project,
                );
            } else {
                navigate(ROUTES.CREATE_WORKSPACE);
            }
        }
    };

    const handleRemoveMember = async (memberId: string) => {
        const response = await removeOrganizationMember(memberId);
        if (response?.organizationMembership) {
            const updatedUser = JSON.parse(JSON.stringify(user)) as DeepPartial<User>;
            const currentOrganization = updatedUser.organizations?.edges?.find(
                (org) => org?.node?.id === workspace?.id,
            );
            if (currentOrganization?.node?.members) {
                currentOrganization.node.members.edges = currentOrganization?.node?.members?.edges?.filter(
                    (member) => member?.node?.id !== memberId,
                );
            }

            updateUser(updatedUser, true);
            toast.success(`You have removed ${response.organizationMembership.email} from your organization`);
            return;
        }
        if (response?.organizationErrors.length) {
            toast.error(response.organizationErrors[0].message as string);
            return;
        }
    };

    const handleUpdateMemberRole = async (memberId: string, currentRole: RoleLevel) => {
        let newRole = currentRole;
        if (currentRole === RoleLevel.Member) {
            newRole = RoleLevel.Admin;
        } else {
            newRole = RoleLevel.Member;
        }
        const response = await updateMemberRole(memberId, newRole);

        if (response?.organizationMembership) {
            const updatedUser = JSON.parse(JSON.stringify(user)) as DeepPartial<User>;
            const currentOrganization = updatedUser.organizations?.edges?.find(
                (org) => org?.node?.id === workspace?.id,
            );
            const member = currentOrganization?.node?.members?.edges?.find((item) => {
                return item?.node?.id === response.organizationMembership?.id;
            });

            if (member?.node?.role) {
                member.node.role = response.organizationMembership.role;
            }
            updateUser(updatedUser, true);

            toast.success(`You have made ${response.organizationMembership.email} ${newRole}`);
        }
    };

    const userIsOwner = useMemo(() => {
        const owner = workspace?.members?.edges?.find((mem) => mem?.node?.role === RoleLevel.Owner);
        return user.email === owner?.node?.email;
    }, [workspace, user.email]);

    const userIsAdmin = useMemo(() => {
        const admin = workspace?.members?.edges?.find((mem) => mem?.node?.email === user.email);
        return admin?.node?.role === RoleLevel.Admin;
    }, [workspace, user.email]);

    const userIsMember = useMemo(() => {
        const member = workspace?.members?.edges?.find((mem) => mem?.node?.email === user.email);
        return member?.node?.role === RoleLevel.Member;
    }, []);

    if (loading) {
        return <GlobalSpinner />;
    }
    return (
        <div>
            <p className="text-sm font-semibold text-white">
                {filteredMembers
                    ? `${filteredMembers.length} ${filteredMembers.length === 1 ? "member" : "members"}`
                    : `${workspace?.memberCount} ${workspace?.memberCount === 1 ? "member" : "members"}`}
            </p>
            <div>
                {filteredMembers?.map((member) => {
                    return (
                        <div
                            key={member?.node?.id}
                            className="flex items-center justify-between border-b border-intg-bg-4 px-2 py-3 text-sm"
                        >
                            <div className="flex h-[48px] basis-[60%] flex-col justify-center">
                                <p className="font-sm font-medium capitalize text-white">{`${member.node.firstName} ${member.node.lastName}`}</p>
                                <p className="font-sm space-x-1">
                                    <span>{member?.node?.email}</span>
                                    <span>
                                        {member?.node?.email === user.email ? (
                                            <span className="rounded-md bg-intg-bg-2 p-1 text-xs text-white">you</span>
                                        ) : null}
                                    </span>
                                </p>
                            </div>

                            <div className="font-sm basis-[20%] capitalize">
                                {member?.node?.role.toLocaleLowerCase()}
                            </div>

                            {member.node.role === RoleLevel.Owner ||
                            (userIsMember && member?.node?.email !== user.email) ? (
                                <div className="w-[24px]"></div>
                            ) : (
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
                                            className="rounded-md border border-intg-bg-4 bg-intg-bg-8 px-3 py-4"
                                        >
                                            {(userIsOwner || (userIsAdmin && member?.node?.email !== user.email)) && (
                                                <DropdownMenu.Item
                                                    onClick={() => handleRemoveMember(member?.node?.id as string)}
                                                    className="flex gap-[6px] rounded-md px-2 py-[7px] text-sm font-normal text-intg-text-4 hover:cursor-pointer hover:bg-intg-bg-1"
                                                >
                                                    Remove user
                                                </DropdownMenu.Item>
                                            )}
                                            {(userIsAdmin && member?.node?.role !== RoleLevel.Admin) || userIsOwner ? (
                                                <DropdownMenu.Item
                                                    onClick={() =>
                                                        handleUpdateMemberRole(member?.node?.id, member?.node?.role)
                                                    }
                                                    className="flex gap-[6px] rounded-md px-2 py-[7px] text-sm font-normal text-intg-text-4 hover:cursor-pointer hover:bg-intg-bg-1"
                                                >
                                                    {member?.node?.role === RoleLevel.Member
                                                        ? "Make Admin"
                                                        : member?.node?.role === RoleLevel.Admin
                                                          ? "Make member"
                                                          : null}
                                                </DropdownMenu.Item>
                                            ) : null}
                                            {!userIsOwner && member?.node?.email === user.email && (
                                                <DropdownMenu.Item
                                                    onClick={() => handleLeaveOrganization(workspace?.id as string)}
                                                    className="flex gap-[6px] rounded-md px-2 py-[7px] text-sm font-normal text-intg-text-4 hover:cursor-pointer hover:bg-intg-bg-1"
                                                >
                                                    Leave workspace
                                                </DropdownMenu.Item>
                                            )}
                                        </DropdownMenu.Content>
                                    </DropdownMenu.Portal>
                                </DropdownMenu.Root>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
