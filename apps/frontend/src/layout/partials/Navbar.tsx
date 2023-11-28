import {
    CircleIcon,
    CirclePlusIcon,
    CircleStackIcon,
    CursorIcon,
    DocumentIcon,
    HomeIcon,
    LogoutIcon,
    NewspaperIcon,
    PeopleIcon,
    QuestionIcon,
    SettingsIcon,
    SpeakerIcon,
} from "@/assets/images";
import { CreateNewProject } from "@/components/CreateNewProject";
import { OrganizationInvite } from "@/components/OrganizationInvite";
import useDatabase from "@/database/hooks/useDatabase";
import { Project } from "@/generated/graphql";
import { useAuthToken } from "@/modules/auth/hooks/useAuthToken";
import useSession from "@/modules/users/hooks/useSession";
import useSessionState from "@/modules/users/hooks/useSessionState";
import useUserState from "@/modules/users/hooks/useUserState";
import { Button } from "@/ui";
import { JoinDiscord } from "@/ui/Banner/JoinDiscord";
import { getAcronym } from "@/utils";
import { DeepOmit } from "@apollo/client/utilities";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";
import {
    default as Frame,
    default as Profile,
} from "../../assets/images/navbar/Frame.png";

export const Navbar = () => {
    const navItems = [
        {
            id: 1,
            title: "Home",
            icon: <HomeIcon />,
        },
        {
            id: 2,
            title: "Surveys",
            icon: <DocumentIcon />,
        },
        {
            id: 3,
            title: "Events",
            icon: <CursorIcon />,
        },
        {
            id: 4,
            title: "Audience",
            icon: <PeopleIcon />,
        },
    ];

    const workspaces = [
        {
            id: 1,
            name: "Workspace 1",
        },
        {
            id: 2,
            name: "Workspace 2",
        },
    ];

    const { clearSession } = useSessionState();
    const { session, projects, switchProject } = useSession();
    const { deleteUser } = useUserState();
    const { logout } = useAuthToken();
    const { clearDBs } = useDatabase();

    const [openCreateProjectModal, setOpenCreateProjectModal] = useState(false);
    const [openOrganizationInviteModal, setOpenOrganizationInviteModal] =
        useState(false);

    const handleLogout = async () => {
        await clearDBs();
        deleteUser();
        logout();
        clearSession();
    };

    return (
        <div
            className="w-[240px] border-r border-intg-bg-4 bg-intg-black p-6"
            style={{
                backgroundImage:
                    "radial-gradient(rgba(28, 15, 89, 0.30) 50%, rgba(5, 5, 5, 0.30))",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                backgroundSize: "cover",
            }}
        >
            <div className="flex flex-col justify-between">
                <div>
                    <div className="mb-9 space-y-2">
                        <p className="text-xs text-intg-text-4">Project</p>
                        <DropdownMenu.Root>
                            <DropdownMenu.Trigger className="outline-none">
                                <p className="flex w-[177px] items-center text-intg-text-4">
                                    <span className="mr-3 rounded bg-gradient-button px-1.5">
                                        {getAcronym(
                                            session?.project?.name as string,
                                        )}
                                    </span>
                                    <span className="capitalize">
                                        {session?.project?.name}
                                    </span>
                                    <span className="ml-auto">
                                        <ChevronDown size={16} />
                                    </span>
                                </p>
                            </DropdownMenu.Trigger>
                            <DropdownMenu.Portal>
                                <DropdownMenu.Content
                                    align="start"
                                    alignOffset={50}
                                    className="border-intg-bg-10  w-[221px] rounded border bg-intg-bg-9 p-2 text-white"
                                >
                                    <DropdownMenu.Group>
                                        {projects.map((item) => {
                                            return (
                                                <DropdownMenu.Item
                                                    key={item.node.id}
                                                    className="hover:bg-intg-bg-10 flex cursor-pointer rounded p-2"
                                                    onClick={() => {
                                                        switchProject(
                                                            item.node as DeepOmit<
                                                                Project,
                                                                "__typename"
                                                            >,
                                                        );
                                                    }}
                                                >
                                                    <span className="mr-3 rounded bg-gradient-button px-1.5">
                                                        {getAcronym(
                                                            item.node.name,
                                                        )}
                                                    </span>
                                                    <span>
                                                        {item.node.name}
                                                    </span>
                                                </DropdownMenu.Item>
                                            );
                                        })}
                                    </DropdownMenu.Group>

                                    <DropdownMenu.Separator className="my-3 border-[.5px] border-intg-bg-4" />
                                    <DropdownMenu.Group>
                                        <DropdownMenu.Item className="flex cursor-pointer items-center space-x-2 px-3 py-2">
                                            <span>
                                                <SettingsIcon />
                                            </span>
                                            <span>Project Settings</span>
                                        </DropdownMenu.Item>
                                        <DropdownMenu.Item>
                                            <Button
                                                icon={<CirclePlusIcon />}
                                                variant="custom"
                                                text="New Project"
                                                size="md"
                                                className="bg-intg-bg-11"
                                                onClick={() =>
                                                    setOpenCreateProjectModal(
                                                        true,
                                                    )
                                                }
                                            />
                                        </DropdownMenu.Item>
                                    </DropdownMenu.Group>
                                    <DropdownMenu.CheckboxItem>
                                        <DropdownMenu.ItemIndicator />
                                    </DropdownMenu.CheckboxItem>
                                    <DropdownMenu.Separator />
                                </DropdownMenu.Content>
                            </DropdownMenu.Portal>
                        </DropdownMenu.Root>

                        <CreateNewProject
                            open={openCreateProjectModal}
                            onOpenChange={(value) =>
                                setOpenCreateProjectModal(value)
                            }
                        />
                    </div>
                    <div className="mb-[14px] space-y-[27px]">
                        <button className="flex items-center justify-between space-x-2 rounded border border-intg-bg-4 bg-intg-bg-9 p-3 text-sm text-intg-text-4">
                            <span>
                                <DocumentIcon />
                            </span>
                            <span>Create new survey</span>
                        </button>
                        <button className="flex w-[177px]  items-center  space-x-2 rounded bg-intg-bg-8 px-3 py-2 text-sm text-intg-text-4">
                            <span>
                                <CircleIcon />
                            </span>
                            <span>Get started</span>
                        </button>
                    </div>
                    <hr className="border-intg-bg-4" />
                    <ul className="my-4 space-y-2 text-sm text-intg-text-4">
                        {navItems.map((item) => {
                            return (
                                <li
                                    key={item.id}
                                    className="flex cursor-pointer items-center space-x-2 px-3 py-2"
                                >
                                    <span>{item.icon}</span>
                                    <span>{item.title}</span>
                                </li>
                            );
                        })}
                    </ul>
                    <hr className="border-intg-bg-4" />
                    <ul className="my-4 space-y-2 text-sm text-intg-text-4">
                        <li
                            className="flex items-center space-x-2 px-3 py-2"
                            onClick={() => setOpenOrganizationInviteModal(true)}
                        >
                            <span>
                                <CirclePlusIcon />
                            </span>
                            <span>Invite team</span>
                        </li>

                        <OrganizationInvite
                            open={openOrganizationInviteModal}
                            onOpenChange={(value: boolean) =>
                                setOpenOrganizationInviteModal(value)
                            }
                        />
                        <li className="flex items-center space-x-2 px-3 py-2">
                            <span>
                                <SpeakerIcon />
                            </span>
                            <span>Feedbacks</span>
                        </li>
                    </ul>

                    <JoinDiscord />
                    <div className="my-4">
                        <hr className="border-intg-bg-4" />
                    </div>
                </div>
            </div>
            <div>
                <DropdownMenu.Root>
                    <DropdownMenu.Trigger className="flex w-full items-center text-intg-text outline-none">
                        <div className="flex items-center space-x-2">
                            <img
                                src={Frame}
                                alt="picture frame"
                                className="rounded object-contain"
                            />
                            <span>Profile</span>
                        </div>
                        <span className="ml-auto">
                            <ChevronDown size={16} />
                        </span>
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Portal>
                        <DropdownMenu.Content
                            align="start"
                            alignOffset={50}
                            className="border-intg-bg-10 w-[310px] rounded border-[0.5px] bg-intg-bg-9 px-2 py-3 text-intg-text"
                        >
                            <DropdownMenu.Label className="pb-1">
                                <p className="text-xs">SIGNED IN AS USER</p>
                            </DropdownMenu.Label>
                            <DropdownMenu.Item>
                                <div className="flex items-center justify-between px-2 py-[6px]">
                                    <div className="flex space-x-2">
                                        <img
                                            src={Profile}
                                            alt="user avatar"
                                            className="rounded object-contain"
                                        />
                                        <div>
                                            <p className="text-intg-text-7 text-sm">
                                                User name
                                            </p>
                                            <p className="text-sm">
                                                user@gmail.com
                                            </p>
                                        </div>
                                    </div>
                                    <div>
                                        <SettingsIcon />
                                    </div>
                                </div>
                            </DropdownMenu.Item>
                            <DropdownMenu.Separator className="my-3 border-[.5px] border-intg-bg-4" />
                            <DropdownMenu.Sub>
                                <DropdownMenu.Label>
                                    <p className="text-xs">CURRENT WORKSPACE</p>
                                </DropdownMenu.Label>
                                <DropdownMenu.SubTrigger className="my-3 flex justify-between px-3 py-2">
                                    <div className="flex items-center space-x-2">
                                        <span className="rounded bg-gradient-button px-1.5">
                                            IF
                                        </span>
                                        <span>SOBTECH</span>
                                    </div>
                                    <ChevronRight />
                                </DropdownMenu.SubTrigger>
                                <DropdownMenu.Separator className="my-3 border-[.5px] border-intg-bg-4" />
                                <DropdownMenu.Portal>
                                    <DropdownMenu.SubContent className="ml-4 w-[221px] rounded bg-intg-bg-9 px-2 py-4 text-intg-text">
                                        <DropdownMenu.Label>
                                            <p className="mb-2 text-xs">
                                                OTHER WORKSPACES
                                            </p>
                                        </DropdownMenu.Label>

                                        {workspaces.map((item) => {
                                            return (
                                                <DropdownMenu.Item
                                                    className="px-3 py-2"
                                                    key={item.name}
                                                >
                                                    {item.name}
                                                </DropdownMenu.Item>
                                            );
                                        })}
                                        <DropdownMenu.Separator className="my-3 border-[.5px] border-intg-bg-4" />
                                        <DropdownMenu.Item className="px-3 py-2">
                                            <Button
                                                icon={<CirclePlusIcon />}
                                                variant="custom"
                                                text="New Workspace"
                                                size="md"
                                                className="bg-intg-bg-11 w-full"
                                            />
                                        </DropdownMenu.Item>
                                    </DropdownMenu.SubContent>
                                </DropdownMenu.Portal>
                            </DropdownMenu.Sub>
                            <DropdownMenu.Separator />
                            <DropdownMenu.Item className="flex items-center space-x-2 px-3 py-2 ">
                                <SettingsIcon />
                                <p>Workspace Settings</p>
                            </DropdownMenu.Item>
                            <DropdownMenu.Separator className="my-3 border-[.5px] border-intg-bg-4" />
                            <DropdownMenu.Item className="flex items-center space-x-2 px-3 py-2">
                                <NewspaperIcon />
                                <p>Billing</p>
                            </DropdownMenu.Item>
                            <DropdownMenu.Item className="flex items-center space-x-2 px-3 py-2">
                                <CircleStackIcon />
                                <p>Status Page</p>
                            </DropdownMenu.Item>
                            <DropdownMenu.Item className="flex items-center space-x-2 px-3 py-2">
                                <QuestionIcon />
                                <p>Help and doc</p>
                            </DropdownMenu.Item>
                            <DropdownMenu.Separator className="my-3 border-[.5px] border-intg-bg-4" />
                            <DropdownMenu.Item
                                className="flex items-center space-x-2 px-3 py-2"
                                onClick={handleLogout}
                            >
                                <LogoutIcon />
                                <p>Log out</p>
                            </DropdownMenu.Item>
                        </DropdownMenu.Content>
                    </DropdownMenu.Portal>
                </DropdownMenu.Root>
            </div>
        </div>
    );
};
