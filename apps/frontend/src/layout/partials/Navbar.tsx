import { Project } from "@/generated/graphql";
import { UserProfile } from "@/layout/partials/UserProfile";
import { useOnboarding } from "@/modules/onboarding/hooks/useOnboarding";
import { CreateNewProject } from "@/modules/projects/components/CreateNewProject";
import { useProject } from "@/modules/projects/hooks/useProject";
import { useCurrentUser } from "@/modules/users/hooks/useCurrentUser";
import { OrganizationInvite } from "@/modules/workspace/components/invite/OrganizationInvite";
import { useWorkspace } from "@/modules/workspace/hooks/useWorkspace";
import { ROUTES } from "@/routes";
import { Button, ProgressRadial } from "@/ui";
import { JoinDiscord } from "@/ui/Banner/JoinDiscord";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/ui/Dropdown/DropdownMenu";
import { AcronynmBox } from "@/ui/NavItem/AcronynmBox";
import { NavItem } from "@/ui/NavItem/NavItem";
import { NavLink } from "@/ui/NavItem/NavLink";
import {
    CheckCircleIcon,
    CirclePlusIcon,
    CursorIcon,
    DocumentIcon,
    HomeIcon,
    PeopleIcon,
    SettingsIcon,
    SpeakerIcon,
} from "@/ui/icons";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

export const Navbar = () => {
    const { user } = useCurrentUser();
    const { workspace, projects } = useWorkspace();
    const { project, switchProject } = useProject();
    const [openCreateProjectModal, setOpenCreateProjectModal] = useState(false);
    const [openOrganizationInviteModal, setOpenOrganizationInviteModal] =
        useState(false);
    const { completionRate: onboardingCompletionRate } = useOnboarding();

    const navItems = [
        {
            id: 1,
            title: "Home",
            icon: <HomeIcon />,
            href: "",
        },
        {
            id: 2,
            title: "Surveys",
            icon: <DocumentIcon />,
            href: ROUTES.SURVEY_LIST.replace(
                ":orgSlug",
                workspace?.slug as string,
            ).replace(":projectSlug", project?.slug as string),
        },
        {
            id: 3,
            title: "Events",
            icon: <CursorIcon />,
            href: "",
        },
        {
            id: 4,
            title: "Audience",
            icon: <PeopleIcon />,
            href: "",
        },
    ];

    return (
        <div
            className="scrollbar-hide flex h-screen w-[240px]  flex-col justify-between overflow-y-auto border-r border-intg-bg-4 bg-intg-black p-6"
            style={{
                backgroundImage:
                    "radial-gradient(rgba(28, 15, 89, 0.30) 50%, rgba(5, 5, 5, 0.30))",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                backgroundSize: "cover",
            }}
        >
            <div>
                <div>
                    <div className="mb-6 space-y-2">
                        <p className="text-xs text-intg-text-4">Project</p>
                        <DropdownMenu>
                            <DropdownMenuTrigger className="w-[177px] select-none outline-none">
                                <NavItem
                                    text={project?.name as string}
                                    leftIcon={
                                        <AcronynmBox
                                            text={project?.name as string}
                                        />
                                    }
                                    rightIcon={<ChevronDown size={16} />}
                                    classnames="w-[181px]"
                                    ellipsis={true}
                                    ellipsisLength={16}
                                />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                align="start"
                                className=" rounded border border-intg-bg-10 bg-intg-bg-9 p-2 py-3 text-intg-text"
                            >
                                <DropdownMenuGroup className="scrollbar-hide max-h-[20rem] overflow-y-scroll p-1">
                                    {projects.map((item) => {
                                        return (
                                            <DropdownMenuItem
                                                key={item?.id}
                                                onClick={() => {
                                                    switchProject(item as Project);
                                                }}
                                            >
                                                <NavItem
                                                    leftIcon={
                                                        <AcronynmBox
                                                            text={item?.name ?? ""}
                                                        />
                                                    }
                                                    text={item?.name}
                                                    rightIcon={
                                                        item?.slug ===
                                                            project?.slug && (
                                                            <CheckCircleIcon />
                                                        )
                                                    }
                                                    ellipsis={true}
                                                    ellipsisLength={
                                                        item?.slug ===
                                                        project?.slug
                                                            ? 17
                                                            : 22
                                                    }
                                                    classnames="overflow-x-hidden w-[205px] hover:bg-intg-bg-10 rounded p-2"
                                                />
                                            </DropdownMenuItem>
                                        );
                                    })}
                                </DropdownMenuGroup>
                                <DropdownMenuSeparator className="my-3 border-[.5px] border-intg-bg-4" />
                                <DropdownMenuGroup>
                                    <DropdownMenuItem className="flex cursor-pointer items-center space-x-2 px-3 py-2 text-sm">
                                        <span>
                                            <SettingsIcon />
                                        </span>
                                        <span>Project Settings</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <Button
                                            icon={<CirclePlusIcon />}
                                            variant="custom"
                                            text="New Project"
                                            size="md"
                                            className="bg-intg-bg-11 text-sm"
                                            onClick={() =>
                                                setOpenCreateProjectModal(true)
                                            }
                                        />
                                    </DropdownMenuItem>
                                </DropdownMenuGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <CreateNewProject
                            open={openCreateProjectModal}
                            onOpenChange={(value: boolean) =>
                                setOpenCreateProjectModal(value)
                            }
                        />
                    </div>
                    <div className="space-y-[27px] pb-[24px]">
                        <button className="flex items-center justify-between gap-2 rounded border border-intg-bg-4 bg-intg-bg-9 p-3 text-sm text-intg-text-4">
                            <span>
                                <DocumentIcon />
                            </span>
                            <span>Create new survey</span>
                        </button>
                        {!user?.isOnboarded && (
                            <Link
                                to={ROUTES.GET_STARTED.replace(
                                    ":orgSlug",
                                    workspace?.slug as string,
                                ).replace(
                                    ":projectSlug",
                                    project?.slug as string,
                                )}
                                className="flex w-[177px] items-center gap-2 rounded bg-intg-bg-8 px-3 py-2 text-sm text-intg-text-4"
                            >
                                <ProgressRadial
                                    value={onboardingCompletionRate}
                                />
                                <span>Get started</span>
                            </Link>
                        )}
                    </div>
                    <hr className="border-intg-bg-4" />
                    <ul className="space-y-2 py-4 text-sm text-intg-text-4">
                        {navItems.map((item) => {
                            return (
                                <NavLink
                                    to={item.href}
                                    className={({ isActive }) =>
                                        isActive ? "bg-intg-bg-8" : ""
                                    }
                                    key={item.id}
                                    leftIcon={item.icon}
                                    text={item.title}
                                    classnames="px-3 py-2"
                                />
                            );
                        })}
                    </ul>
                    <hr className="border-intg-bg-4" />
                    <ul className="space-y-2 py-4 text-sm text-intg-text-4">
                        <li
                            className="flex cursor-pointer items-center space-x-2 px-3 py-2"
                            onClick={() => {
                                setOpenOrganizationInviteModal(true);
                            }}
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
                        <li className="flex cursor-pointer items-center space-x-2 px-3 py-2">
                            <span>
                                <SpeakerIcon />
                            </span>
                            <span>Feedbacks</span>
                        </li>
                    </ul>
                    <JoinDiscord />
                </div>
            </div>
            <div>
                <div className="pb-3">
                    <hr className="border-intg-bg-4" />
                </div>
                <UserProfile />
            </div>
        </div>
    );
};
