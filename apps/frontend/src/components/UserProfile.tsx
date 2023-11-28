import {
    CirclePlusIcon,
    CircleStackIcon,
    LogoutIcon,
    QuestionIcon,
    SettingsIcon,
} from "@/assets/images";
import useDatabase from "@/database/hooks/useDatabase";
import { useAuthToken } from "@/modules/auth/hooks/useAuthToken";
import useSessionState from "@/modules/users/hooks/useSessionState";
import useUserState from "@/modules/users/hooks/useUserState";
import { Button } from "@/ui";
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
} from "@/ui/Dropdown/DropdownMenu";
import Frame from "assets/images/navbar/Frame.png";
import { ChevronDown, ChevronRight, NewspaperIcon } from "lucide-react";
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

    const { clearSession } = useSessionState();
    const { deleteUser } = useUserState();
    const { logout } = useAuthToken();
    const { clearDBs } = useDatabase();

    const handleLogout = async () => {
        await clearDBs();
        deleteUser();
        logout();
        clearSession();
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="flex w-full items-center text-intg-text outline-none">
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
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align="start"
                alignOffset={50}
                className="border-intg-bg-10 w-[310px] rounded border-[0.5px] bg-intg-bg-9 px-2 py-3 text-intg-text"
            >
                <DropdownMenuLabel className="pb-1">
                    <p className="text-xs">SIGNED IN AS USER</p>
                </DropdownMenuLabel>
                <DropdownMenuItem>
                    <div className="flex items-center justify-between px-2 py-[6px]">
                        <div className="flex space-x-2">
                            <img
                                src={Frame}
                                alt="user avatar"
                                className="rounded object-contain"
                            />
                            <div>
                                <p className="text-intg-text-7 text-sm">
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
                    <DropdownMenuSubTrigger className="my-3 flex justify-between px-3 py-2">
                        <div className="flex items-center space-x-2">
                            <span className="rounded bg-gradient-button px-1.5">
                                IF
                            </span>
                            <span>SOBTECH</span>
                        </div>
                        <ChevronRight />
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
                                    {item.name}
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
                                className="bg-intg-bg-11 w-full"
                            />
                        </DropdownMenuItem>
                    </DropdownMenuSubContent>
                </DropdownMenuSub>
                <DropdownMenuItem className="flex items-center space-x-2 px-3 py-2 ">
                    <SettingsIcon />
                    <p>Workspace Settings</p>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="my-3 border-[.5px] border-intg-bg-4" />
                {ProfileNavItems.map((item) => {
                    return (
                        <DropdownMenuItem className="flex items-center space-x-2 px-3 py-2">
                            {item.icon}
                            <p>{item.title}</p>
                        </DropdownMenuItem>
                    );
                })}
                <DropdownMenuSeparator className="my-3 border-[.5px] border-intg-bg-4" />
                <DropdownMenuItem
                    className="flex items-center space-x-2 px-3 py-2"
                    onClick={handleLogout}
                >
                    <LogoutIcon />
                    <p className="text-intg-error-text">Log out</p>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
