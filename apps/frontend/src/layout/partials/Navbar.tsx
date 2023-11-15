import {
    CircleIcon,
    CirclePlusIcon,
    CursorIcon,
    DocumentIcon,
    HomeIcon,
    PeopleIcon,
    QuestionIcon,
    SettingsIcon,
    SpeakerIcon,
} from "@/assets/images";
import { Dialog, DialogContent, DialogTrigger } from "@/components/Dialog";
import { Button, TextInput } from "@/ui";
import { ChevronDown } from "lucide-react";
import Discord from "../../assets/images/navbar/Discord.png";
import Frame from "../../assets/images/navbar/Frame.png";

import * as Popover from "@radix-ui/react-popover";

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
    const projects = [
        {
            id: 97,
            name: "Project1",
        },
        {
            id: 97,
            name: "Project1",
        },
    ];

    const bottomNav = [
        {
            id: 1,
            title: "Invite team",
            icon: <CirclePlusIcon />,
        },
        {
            id: 2,
            title: "Feedbacks",
            icon: <SpeakerIcon />,
        },
        {
            id: 3,
            title: "Help and doc",
            icon: <QuestionIcon />,
        },
    ];

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
            <div className="mb-9 space-y-2">
                <p className="text-xs text-intg-text-4">Project</p>
                <Popover.Root>
                    <Popover.Trigger className="text-white">
                        <p className="flex w-[177px] items-center text-intg-text-4">
                            <span className="mr-3 rounded bg-gradient-button px-1.5">
                                IF
                            </span>
                            <span>Integraflow</span>
                            <span className="ml-auto">
                                <ChevronDown size={16} />
                            </span>
                        </p>
                    </Popover.Trigger>
                    <Popover.Anchor />
                    <Popover.Portal>
                        <Popover.Content
                            align="start"
                            sideOffset={-10}
                            alignOffset={50}
                            className="border-intg-bg-10  h-[13rem] w-[221px] rounded border bg-intg-bg-9 p-2 text-white"
                        >
                            <ul className="text-intg-text">
                                {projects.map((item) => {
                                    return (
                                        <li
                                            className="hover:bg-intg-bg-10 flex cursor-pointer rounded p-2"
                                            onClick={() => {}}
                                        >
                                            <span className="mr-3 rounded bg-gradient-button px-1.5">
                                                IF
                                            </span>
                                            <span>{item.name}</span>
                                        </li>
                                    );
                                })}
                                <div className="my-2">
                                    <hr className="border-intg-bg-4" />
                                </div>
                                <li className="flex cursor-pointer items-center space-x-2 px-3 py-2">
                                    <span>
                                        <SettingsIcon />
                                    </span>
                                    <span>Project Settings</span>
                                </li>
                                <Dialog>
                                    <DialogTrigger className="w-full">
                                        <li className="bg-intg-bg-10 flex cursor-pointer items-center space-x-2 rounded p-3">
                                            <span>
                                                <CirclePlusIcon />
                                            </span>
                                            <span>New Project</span>
                                        </li>
                                    </DialogTrigger>
                                    <DialogContent
                                        title="Create new survey"
                                        description="Pick a method that suits you best"
                                    >
                                        <div className="mt-6 w-[34rem]">
                                            <TextInput
                                                label="Project Name"
                                                placeholder="Project name"
                                            />
                                            <div className="my-6">
                                                <hr className="border-intg-bg-4" />
                                            </div>
                                            <div className="w-full">
                                                <Button
                                                    text="Create Project"
                                                    className="w-full px-8 py-4"
                                                />
                                            </div>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            </ul>
                            <Popover.Close />
                            <Popover.Arrow />
                        </Popover.Content>
                    </Popover.Portal>
                </Popover.Root>
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
                {bottomNav.map((item) => {
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
                        Add your card to prevent interruption after trial
                    </p>
                    <Button text="Join now" className="py-[6px]" />
                </div>
            </div>
            <div className="my-4">
                <hr className="border-intg-bg-4" />
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
    );
};
