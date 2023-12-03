import useLogout from "@/modules/auth/hooks/useLogout";
import { Button } from "@/ui";
import { AcronynmBox } from "@/ui/NavItem/AcronynmBox";
import { NavItem } from "@/ui/NavItem/NavItem";
import { NavLink } from "@/ui/NavItem/NavLink";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/ui/dropdown/DropdownMenu";
import {
    CirclePlusIcon,
    CircleStackIcon,
    LogoutIcon,
    NewspaperIcon,
    QuestionIcon,
    SettingsIcon,
} from "@/ui/icons";
import Frame from "assets/images/Frame.png";
import { ChevronDown, ChevronRight } from "lucide-react";
export const UserProfile = () => {
    const ProfileNavItems = [
        {
            id: 1,
            title: "Billing",
            icon: <NewspaperIcon />,
        },
        {
            id: 2,
            title: "Status Page",
            icon: <CircleStackIcon />,
        },
        {
            id: 3,
            title: "Help and doc",
            icon: <QuestionIcon />,
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

    const { handleLogout } = useLogout();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="flex w-full items-center text-intg-text outline-none">
                <div className="flex items-center space-x-2">
                    <img
                        src={Frame}
                        alt="picture frame"
                        className="h-[31px] w-[31px] rounded object-contain"
                    />
                    <span className="text-sm">Profile</span>
                </div>
                <span className="ml-auto">
                    <ChevronDown size={16} />
                </span>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align="start"
                alignOffset={50}
                className="w-[310px] rounded border-[0.5px] border-intg-bg-10 bg-intg-bg-9 px-2 py-3 text-intg-text"
            >
                <DropdownMenuLabel className="pb-1">
                    <p className="text-xs">SIGNED IN AS USER</p>
                </DropdownMenuLabel>
                <DropdownMenuItem>
                    <div className="flex items-center justify-between px-2 py-[6px]">
                        <div className="flex items-center space-x-2">
                            <img
                                src={Frame}
                                alt="user avatar"
                                className="h-[31px] w-[31px] rounded object-contain"
                            />
                            <div>
                                <p className="text-sm text-intg-text-7">
                                    User name
                                </p>
                                <p className="text-sm">user@gmail.com</p>
                            </div>
                        </div>
                        <div>
                            <SettingsIcon />
                        </div>
                    </div>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="my-3 border-[.5px] border-intg-bg-4" />
                <DropdownMenuSub>
                    <DropdownMenuLabel>
                        <p className="text-xs">CURRENT WORKSPACE</p>
                    </DropdownMenuLabel>
                    <DropdownMenuSubTrigger>
                        <NavItem
                            text="SOBTECH"
                            leftIcon={<AcronynmBox text="Sobtech" />}
                            rightIcon={<ChevronRight size={20} />}
                            classnames="px-3 py-2 my-3"
                        />
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSeparator className="my-3 border-[.5px] border-intg-bg-4" />
                    <DropdownMenuSubContent className="ml-4 w-[221px] rounded bg-intg-bg-9 px-2 py-4 text-intg-text">
                        <DropdownMenuLabel>
                            <p className="mb-2 text-xs">OTHER WORKSPACES</p>
                        </DropdownMenuLabel>

                        {workspaces.map((item) => {
                            return (
                                <DropdownMenuItem
                                    className="px-3 py-2"
                                    key={item.name}
                                >
                                    <NavItem
                                        text={item.name}
                                        leftIcon={
                                            <AcronynmBox text={item.name} />
                                        }
                                    />
                                </DropdownMenuItem>
                            );
                        })}
                        <DropdownMenuSeparator className="my-3 border-[.5px] border-intg-bg-4" />
                        <DropdownMenuItem className="px-3 py-2">
                            <Button
                                icon={<CirclePlusIcon />}
                                variant="custom"
                                text="New Workspace"
                                size="md"
                                className="w-full bg-intg-bg-11"
                            />
                        </DropdownMenuItem>
                    </DropdownMenuSubContent>
                </DropdownMenuSub>
                <DropdownMenuItem className="flex items-center space-x-2 px-3 py-2 ">
                    <SettingsIcon />
                    <p className="text-sm">Workspace Settings</p>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="my-3 border-[.5px] border-intg-bg-4" />
                {ProfileNavItems.map((item) => {
                    return (
                        <DropdownMenuItem>
                            <NavLink
                                text={item.title}
                                leftIcon={item.icon}
                                to="/test"
                                className={({ isActive }) =>
                                    isActive ? "" : ""
                                }
                                classnames="px-3 py-2 text-sm text-intg-text"
                            />
                        </DropdownMenuItem>
                    );
                })}
                <DropdownMenuSeparator className="my-3 border-[.5px] border-intg-bg-4" />
                <DropdownMenuItem
                    className="flex items-center space-x-2 px-3 py-2"
                    onClick={handleLogout}
                >
                    <LogoutIcon />
                    <p className="text-sm text-intg-error-text">Log out</p>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
