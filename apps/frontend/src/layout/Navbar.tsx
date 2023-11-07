import {
    CircleIcon,
    CirclePlusIcon,
    CursorIcon,
    DocumentIcon,
    HomeIcon,
    PeopleIcon,
    QuestionIcon,
    SpeakerIcon,
} from "@/assets/images";
import { ChevronDown } from "lucide-react";
import Discord from "../assets/images/navbar/Discord.png";
import Frame from "../assets/images/navbar/Frame.png";

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
            className="w-[240px] border-r border-intg-bg-4 bg-intg-black p-6 pb-[31px]"
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
                <button className="bg-intg-bg-9 flex items-center justify-between space-x-2 rounded border border-intg-bg-4 p-3 text-sm text-intg-text-4">
                    <span>
                        <DocumentIcon />
                    </span>
                    <span>Create new survey</span>
                </button>
                <button className="bg-intg-bg-8 flex  w-[177px]  items-center space-x-2 rounded px-3 py-2 text-sm text-intg-text-4">
                    <span>
                        <CircleIcon />
                    </span>
                    <span>Get started</span>
                </button>
            </div>

            <hr className="border-intg-bg-4" />

            <ul className="mb-24 mt-4 space-y-2 text-sm text-intg-text-4">
                {navItems.map((item) => {
                    return (
                        <li className="flex items-center space-x-2 px-3 py-2">
                            <span>{item.icon}</span>
                            <span>{item.title}</span>
                        </li>
                    );
                })}
            </ul>
            <hr className="border-intg-bg-4" />
            <ul className="mb-[72px] mt-4 space-y-2 text-sm text-intg-text-4">
                {bottomNav.map((item) => {
                    return (
                        <li className="flex items-center space-x-2 px-3 py-2">
                            <span>{item.icon}</span>
                            <span>{item.title}</span>
                        </li>
                    );
                })}
            </ul>
            <div className="bg-intg-bg-9 mb-[54px] flex w-full space-x-2 rounded-lg px-2 py-4">
                <div className="h-8 w-8">
                    <img src={Discord} alt="Discord" />
                </div>
                <div className="space-y-[2px]">
                    <p className="flex">
                        <span className="text-sm text-white">
                            Join our Discord Community
                        </span>
                    </p>
                    <p className="text-sm text-intg-text">
                        Add your card to prevent interruption after trial
                    </p>
                    {/* <Button text="Join now" /> */}
                </div>
            </div>
            <hr className="border-intg-bg-4" />
            <div className="mt-[18px] flex items-center text-intg-text">
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
