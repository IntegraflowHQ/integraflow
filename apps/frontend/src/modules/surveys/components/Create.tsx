import { Button, Header } from "@/ui";
import { HelpCircle, PlusCircle, SettingsIcon } from "@/ui/icons";
import EmptySurvey from "assets/images/surveys/empty.png";
import { Pen } from "lucide-react";

export default function Create() {
    return (
        <div className="flex h-screen pt-[84px]">
            <div className="flex h-full flex-col gap-6 border-r border-intg-bg-4 px-[18px] pt-12">
                <button className="p-2">
                    <HelpCircle />
                </button>
                <button className="p-2">
                    <Pen size={20} color="#AFAAC7" fill="#AFAAC7" />
                </button>
                <button className="p-2">
                    <SettingsIcon />
                </button>
            </div>
            <div className="flex flex-1 gap-[38px] pb-8 pl-5 pr-12 pt-6">
                <div className="w-[471px] pt-2">
                    <div className="flex gap-2">
                        <Button className="flex items-center gap-2 px-[12px] py-[12px]">
                            <PlusCircle />
                            <span className="w-max text-base font-normal">
                                Add you first question
                            </span>
                        </Button>
                        <Button
                            className="flex items-center gap-2 px-[12px] py-[12px]"
                            variant="secondary"
                        >
                            <PlusCircle />
                            <span className="w-max text-base font-normal">
                                Add question from library
                            </span>
                        </Button>
                    </div>
                </div>

                <div className="flex flex-1 flex-col items-center justify-center rounded-xl bg-intg-bg-9">
                    {/* Empty state */}
                    <div className="space-y-8">
                        <img src={EmptySurvey} alt="" />
                        <Header
                            title="Nothing to see here yet."
                            description="Add your first question first!"
                            className="text-center"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
