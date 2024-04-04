import { RoleLevel, UserCountableEdge } from "@/generated/graphql";
import { useAuth } from "@/modules/auth/hooks/useAuth";
import { convertToAuthOrganization } from "@/modules/auth/states/user";
import { useWorkspace } from "@/modules/workspace/hooks/useWorkspace";
import { useWorkspaceInvite } from "@/modules/workspace/hooks/useWorkspaceInvite";
import { ROUTES } from "@/routes";
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
    const { user, switchWorkspace, organizations } = useAuth();
    const { removeOrganizationMember, leaveOrganization } = useWorkspaceInvite();

    const [isSearchingMembers, setIsSearchingMembers] = useState(false);
    const [filteredMembers, setFilteredMembers] = useState<UserCountableEdge[] | []>([]);

    useEffect(() => {
        setIsSearchingMembers(Boolean(searchValue));

        if (searchValue) {
            const filtered = workspace?.members?.edges?.filter((member) =>
                `${member?.node?.firstName} ${member?.node?.lastName}`
                    .toLowerCase()
                    .includes(searchValue.toLowerCase()),
            );
            setFilteredMembers(filtered as UserCountableEdge[]);
        } else {
            setFilteredMembers([]);
        }
    }, [searchValue, workspace?.members?.edges]);

    const handleLeaveOrganization = async (organizationId: string) => {
        const response = await leaveOrganization(organizationId);

        if (response) {
            const remainingOrganizations = organizations.filter((org) => org?.id !== response.organization?.id);

            if (remainingOrganizations && remainingOrganizations?.length > 0) {
                switchWorkspace(
                    convertToAuthOrganization(remainingOrganizations[0]),
                    remainingOrganizations[0].projects?.edges[0]?.node,
                );
            } else {
                navigate(ROUTES.CREATE_WORKSPACE);
            }
        }
    };
    const handleRemoveMember = async (memberId: string) => {
        const response = await removeOrganizationMember(memberId);
        if (response?.organizationMembership) {
            toast.success(`You have removed ${response.organizationMembership.email} from your organization`);
            return;
        }
        if (response?.organizationErrors.length) {
            toast.error(response.organizationErrors[0].message as string);
            return;
        }
    };

    const isOwner = useMemo(() => {
        // const currentMember = workspace?.members?.edges.fin
        const owner = workspace?.members?.edges?.find((mem) => mem?.node?.role === RoleLevel.Owner);
        console.log("owner", owner);
        console.log("workspace members", workspace?.members?.nodes);
        return user.email === owner?.node?.email;
    }, [workspace, user.email]);

    console.log(isOwner);

    return (
        <div>
            <p className="font-semibold">
                {isSearchingMembers
                    ? `${filteredMembers.length} ${filteredMembers.length === 1 ? "member" : "members"}`
                    : `${workspace?.memberCount} ${workspace?.memberCount === 1 ? "member" : "members"}`}
            </p>
            <div>
                {isSearchingMembers
                    ? (filteredMembers as UserCountableEdge[]).map((member, index) => (
                          <div key={member.node.id}>
                              <div className="flex items-center justify-between px-2 py-3">
                                  <div className="basis-[60%]">
                                      <p className="font-sm font-medium">
                                          {member.node.firstName} {member.node.lastName}
                                      </p>
                                      <p className="font-sm">{member.node.email}</p>
                                  </div>
                                  <div className="font-sm basis-[20%] lowercase">{member.node.role}</div>
                                  <MoreHorizontal color="#AFAAC7" size={16} className="basis-[10%]" />
                              </div>
                              {index !== 0 && <hr className="border-[1px] border-intg-bg-4" />}
                          </div>
                      ))
                    : workspace?.members?.edges?.map((member, index) => {
                          return (
                              <div key={member?.node?.id}>
                                  {index !== 0 && <hr className="border-[1px] border-intg-bg-4" />}
                                  <div className="flex items-center justify-between px-2 py-3">
                                      <div className="basis-[60%]">
                                          <p className="font-sm font-medium">
                                              {member?.node?.firstName} {member?.node?.lastName}
                                          </p>
                                          <p className="font-sm">{member?.node?.email}</p>
                                      </div>
                                      <div className="font-sm basis-[20%] lowercase">{member?.node?.role}</div>
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
                                                  {isOwner && member?.node?.role !== RoleLevel.Owner && (
                                                      <DropdownMenu.Item
                                                          onClick={() => handleRemoveMember(member?.node?.id as string)}
                                                          className="flex gap-[6px] rounded-md px-2 py-[7px] text-sm font-normal text-intg-text-4 hover:cursor-pointer hover:bg-intg-bg-1"
                                                      >
                                                          Remove user
                                                      </DropdownMenu.Item>
                                                  )}
                                                  {isOwner && member?.node?.role !== RoleLevel.Owner ? (
                                                      <DropdownMenu.Item
                                                          onClick={() => console.log("admin")}
                                                          className="flex gap-[6px] rounded-md px-2 py-[7px] text-sm font-normal text-intg-text-4 hover:cursor-pointer hover:bg-intg-bg-1"
                                                      >
                                                          Make admin
                                                      </DropdownMenu.Item>
                                                  ) : null}
                                                  {!isOwner && member?.node?.role !== RoleLevel.Owner && (
                                                      <DropdownMenu.Item
                                                          onClick={() =>
                                                              handleLeaveOrganization(workspace.id as string)
                                                          }
                                                          className="flex gap-[6px] rounded-md px-2 py-[7px] text-sm font-normal text-intg-text-4 hover:cursor-pointer hover:bg-intg-bg-1"
                                                      >
                                                          Leave workspace
                                                      </DropdownMenu.Item>
                                                  )}
                                              </DropdownMenu.Content>
                                          </DropdownMenu.Portal>
                                      </DropdownMenu.Root>
                                  </div>
                                  {index !== 0 && <hr className="border-[1px] border-intg-bg-4" />}
                              </div>
                          );
                      })}
            </div>
        </div>
    );
};
