import { Project } from "@/generated/graphql";
import { UserProfile } from "@/layout/partials/UserProfile";
import { useAuth } from "@/modules/auth/hooks/useAuth";
import { useOnboarding } from "@/modules/onboarding/hooks/useOnboarding";
import { CreateNewProject } from "@/modules/projects/components/CreateNewProject";
import { useProject } from "@/modules/projects/hooks/useProject";
import { WorkspaceInvite } from "@/modules/workspace/components/invite/WorkspaceInvite";
import { useWorkspace } from "@/modules/workspace/hooks/useWorkspace";
import { ROUTES } from "@/routes";
import { AcronymBox, Button, ProgressRadial } from "@/ui";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/ui/Dropdown/DropdownMenu";
import { NavItem } from "@/ui/NavItem/NavItem";
import { NavLink } from "@/ui/NavItem/NavLink";
import { CheckCircleIcon, CirclePlusIcon, CursorIcon, DocumentIcon, PeopleIcon, SettingsIcon } from "@/ui/icons";
import { cn } from "@/utils";
import * as Tooltip from "@radix-ui/react-tooltip";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export const Navbar = () => {
    const { user, switchProject } = useAuth();
    const { workspace, projects } = useWorkspace();
    const { project } = useProject();
    const [openCreateProjectModal, setOpenCreateProjectModal] = useState(false);
    const [openOrganizationInviteModal, setOpenOrganizationInviteModal] = useState(false);
    const { completionRate: onboardingCompletionRate } = useOnboarding();

    const location = useLocation();
    const navigate = useNavigate();

    const isActive = (path: string) => {
        return location.pathname === path;
    };

    const navItems = [
        {
            id: 2,
            title: "Surveys",
            icon: <DocumentIcon />,
            href: ROUTES.SURVEY_LIST.replace(":orgSlug", workspace?.slug as string).replace(
                ":projectSlug",
                project?.slug as string,
            ),
            disable: false,
        },
        {
            id: 3,
            title: "Events",
            icon: <CursorIcon />,
            href: ROUTES.EVENTS.replace(":orgSlug", workspace?.slug as string).replace(
                ":projectSlug",
                project?.slug as string,
            ),
            disable: false,
        },
        {
            id: 4,
            title: "Audience",
            icon: <PeopleIcon />,
            href: ROUTES.AUDIENCE.replace(":orgSlug", workspace?.slug as string).replace(
                ":projectSlug",
                project?.slug as string,
            ),
            disable: false,
        },
    ];

    return (
        <div
            className="scrollbar-hide flex h-screen w-[240px]  flex-col justify-between overflow-y-auto border-r border-intg-bg-4 bg-intg-black p-6"
            style={{
                backgroundImage: "radial-gradient(rgba(28, 15, 89, 0.30) 50%, rgba(5, 5, 5, 0.30))",
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
                            <DropdownMenuTrigger
                                className="w-[177px] select-none outline-none"
                                data-testid="project-dropdown"
                            >
                                <NavItem
                                    text={project?.name as string}
                                    leftIcon={<AcronymBox text={project?.name as string} />}
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
                                                data-testid={"project-btn"}
                                                key={item?.id}
                                                onClick={() => {
                                                    switchProject(item as Project);
                                                }}
                                                className={cn(item?.slug === project?.slug ? "active" : "")}
                                            >
                                                <NavItem
                                                    leftIcon={<AcronymBox text={item?.name ?? ""} />}
                                                    text={item?.name}
                                                    rightIcon={item?.slug === project?.slug && <CheckCircleIcon />}
                                                    ellipsis={true}
                                                    ellipsisLength={item?.slug === project?.slug ? 17 : 22}
                                                    classnames="overflow-x-hidden w-[205px] hover:bg-intg-bg-10 rounded p-2"
                                                />
                                            </DropdownMenuItem>
                                        );
                                    })}
                                </DropdownMenuGroup>

                                <DropdownMenuSeparator className="my-2 border-[.5px] border-intg-bg-4" />

                                <DropdownMenuGroup className="space-y-2">
                                    <DropdownMenuItem
                                        onClick={() =>
                                            navigate(
                                                ROUTES.WORKSPACE_SETTINGS_PROJECT.replace(
                                                    ":orgSlug",
                                                    workspace?.slug as string,
                                                ).replace(":projectSlug", project?.slug as string),
                                            )
                                        }
                                        className="flex cursor-pointer items-center gap-2 px-3 py-2 text-sm"
                                    >
                                        <span>
                                            <SettingsIcon />
                                        </span>
                                        <span>Project Settings</span>
                                    </DropdownMenuItem>

                                    <DropdownMenuItem>
                                        <Button
                                            data-testid="create-new-project"
                                            icon={<CirclePlusIcon />}
                                            variant="custom"
                                            text="New Project"
                                            size="md"
                                            className="bg-intg-bg-11 text-sm"
                                            onClick={() => setOpenCreateProjectModal(true)}
                                        />
                                    </DropdownMenuItem>
                                </DropdownMenuGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <CreateNewProject
                            open={openCreateProjectModal}
                            onOpenChange={(value: boolean) => setOpenCreateProjectModal(value)}
                        />
                    </div>
                    <div className="space-y-[27px] pb-[24px]">
                        <button
                            onClick={() =>
                                navigate(
                                    `${ROUTES.SURVEY_LIST}/?create=2`
                                        .replace(":orgSlug", workspace?.slug as string)
                                        .replace(":projectSlug", project?.slug as string),
                                )
                            }
                            className="flex items-center justify-between gap-2 rounded border border-intg-bg-4 bg-intg-bg-9 p-3 text-sm text-intg-text-4"
                        >
                            <span>
                                <DocumentIcon />
                            </span>
                            <span>Create new survey</span>
                        </button>
                        {!user?.isOnboarded && (
                            <Link
                                to={ROUTES.GET_STARTED.replace(":orgSlug", workspace?.slug as string).replace(
                                    ":projectSlug",
                                    project?.slug as string,
                                )}
                                className="flex w-[177px] items-center gap-2 rounded bg-intg-bg-8 px-3 py-2 text-sm text-intg-text-4"
                            >
                                <ProgressRadial value={onboardingCompletionRate} />
                                <span>Get started</span>
                            </Link>
                        )}
                    </div>
                    <hr className="border-intg-bg-4" />
                    <div className="space-y-2 py-4 text-sm text-intg-text-4">
                        {navItems.map((item) => {
                            if (item.disable) {
                                return (
                                    <Tooltip.Provider key={item.id}>
                                        <Tooltip.Root key={item.id} delayDuration={200}>
                                            <Tooltip.Trigger className="h-9 w-full rounded ease-in-out">
                                                <div className="flex w-full cursor-not-allowed items-center gap-2 overflow-x-hidden rounded bg-intg-bg-9 px-3 py-2 capitalize text-gray-500">
                                                    {item.icon}
                                                    {item.title}
                                                </div>
                                            </Tooltip.Trigger>

                                            <Tooltip.Portal>
                                                <Tooltip.Content
                                                    side="right"
                                                    align="center"
                                                    className="rounded border border-intg-bg-10 bg-intg-bg-9 px-2 py-3 text-xs leading-[18px] text-intg-text"
                                                >
                                                    coming soon
                                                    <Tooltip.Arrow
                                                        width={18}
                                                        height={16}
                                                        className="-mt-[1px] fill-[#181325] stroke-intg-bg-10"
                                                    />
                                                </Tooltip.Content>
                                            </Tooltip.Portal>
                                        </Tooltip.Root>
                                    </Tooltip.Provider>
                                );
                            } else {
                                return (
                                    <NavLink
                                        to={item.href}
                                        key={item.id}
                                        leftIcon={item.icon}
                                        text={item.title}
                                        className={"block"}
                                        classnames={cn(
                                            isActive(item.href) ? "bg-intg-bg-5" : "",
                                            "cursor-not-allowed px-3 py-2 hover:bg-intg-bg-8",
                                        )}
                                    />
                                );
                            }
                        })}
                    </div>
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

                        <WorkspaceInvite
                            open={openOrganizationInviteModal}
                            onOpenChange={(value: boolean) => setOpenOrganizationInviteModal(value)}
                        />
                    </ul>
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
