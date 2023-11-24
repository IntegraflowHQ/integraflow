import {
    CircleIcon,
    CirclePlusIcon,
    CopyIcon,
    CursorIcon,
    DocumentIcon,
    HomeIcon,
    PeopleIcon,
    SpeakerIcon,
} from "@/assets/images";
import { Dialog, DialogContent, DialogTrigger } from "@/components";
import { Button, TextInput } from "@/ui";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import Discord from "../../assets/images/navbar/Discord.png";
import Frame from "../../assets/images/navbar/Frame.png";

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

    const [toggleInviteType, setToggleInviteType] = useState(false);

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
                        <p className="flex w-[177px] items-center text-intg-text-4">
                            <span className="mr-3 rounded bg-gradient-button px-1.5">
                                IF
                            </span>
                            <span>Integraflow</span>
                            <span className="ml-auto">
                                <ChevronDown size={16} />
                            </span>
                        </p>
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
                                    className="flex items-center space-x-2 px-3 py-2"
                                >
                                    <span>{item.icon}</span>
                                    <span>{item.title}</span>
                                </li>
                            );
                        })}
                    </ul>
                    <hr className="border-intg-bg-4" />
                    <ul className="my-4 space-y-2 text-sm text-intg-text-4">
                        <Dialog>
                            <DialogTrigger>
                                <li className="flex items-center space-x-2 px-3 py-2">
                                    <span>
                                        <CirclePlusIcon />
                                    </span>
                                    <span>Invite team</span>
                                </li>
                            </DialogTrigger>
                            <DialogContent
                                alignHeader="left"
                                title="Invite others to 'organization name'"
                                description="Invite others to your project to collaborate together in intergraflow. An invite is specific to an email address and expires after 3 days."
                            >
                                {!toggleInviteType ? (
                                    <form>
                                        <div className="mt-3 flex w-full items-end space-x-2">
                                            <div className="w-[65%]">
                                                <TextInput
                                                    label="Email address"
                                                    placeholder="example1@gmail.com, example2@gmail.com, "
                                                />
                                            </div>
                                            <div className="w-[35%]">
                                                <Button
                                                    text="Send Invite"
                                                    size="md"
                                                />
                                            </div>
                                        </div>
                                    </form>
                                ) : (
                                    <div className="mt-3">
                                        <p className="mb-4 text-sm text-intg-text">
                                            Invite link will provide a unique
                                            URL that allow anyone to join your
                                            organization
                                        </p>

                                        <div className="flex w-full items-end space-x-2">
                                            <div className="w-[75%]">
                                                <TextInput
                                                    placeholder="example1@gmail.com, example2@gmail.com,"
                                                    disabled={true}
                                                />
                                            </div>
                                            <div className="w-[25%]">
                                                <Button
                                                    text="Copy"
                                                    size="md"
                                                    icon={<CopyIcon />}
                                                    textAlign="center"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <div className="py-4">
                                    <hr className="border-intg-bg-4" />
                                </div>
                                <div className="w-[30%]">
                                    <Button
                                        variant="custom"
                                        text="Invite with link"
                                        className="hover:transparent bg-intg-bg-6 text-intg-text hover:bg-intg-text hover:text-white"
                                        size="md"
                                        onClick={() =>
                                            setToggleInviteType(
                                                !toggleInviteType,
                                            )
                                        }
                                    />
                                </div>
                            </DialogContent>
                        </Dialog>
                        <li className="flex items-center space-x-2 px-3 py-2">
                            <span>
                                <SpeakerIcon />
                            </span>
                            <span>Feedbacks</span>
                        </li>
                    </ul>

                    <div className="flex w-full space-x-2 rounded-lg bg-intg-bg-9 px-2 py-4">
                        <div className="h-8 w-8">
                            <img src={Discord} alt="Discord" />
                        </div>
                        <div className="space-y-[4px]">
                            <p className="flex">
                                <span className="text-sm text-white">
                                    Join our Discord Community
                                </span>
                            </p>
                            <p className="text-xs text-intg-text">
                                Add your card to prevent interruption after
                                trial
                            </p>
                            <Button text="Join now" className="py-[6px]" />
                        </div>
                    </div>
                    <div className="my-4">
                        <hr className="border-intg-bg-4" />
                    </div>
                </div>
                <div className="flex items-center text-intg-text">
                    <div className="flex space-x-3">
                        <img src={Frame} alt="picture frame" />
                        <span>Profile</span>
                    </div>
                    <span className="ml-auto">
                        <ChevronDown size={16} />
                    </span>
                </div>
            </div>
        </div>
    );
};
