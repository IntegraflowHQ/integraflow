import {
    Button,
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
    Header,
} from "@/ui";
import { PlusCircle } from "@/ui/icons";
import EmptySurvey from "assets/images/surveys/empty.png";
import AddQuestion from "./AddQuestion";

export default function UpdateQuestion() {
    return (
        <div className="flex flex-1 gap-[38px] pb-8 pl-5 pr-12 pt-6">
            <div className="w-[471px] pt-2">
                <div className="flex gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button className="flex items-center gap-2 px-[12px] py-[12px]">
                                <PlusCircle />
                                <span className="w-max text-base font-normal">
                                    Add you first question
                                </span>
                            </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent>
                            <AddQuestion />
                        </DropdownMenuContent>
                    </DropdownMenu>
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
    );
}
