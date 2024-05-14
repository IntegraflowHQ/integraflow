import { Header, TextInput } from "@/ui";
import { Search } from "@/ui/icons";
import { useState } from "react";
import { Events } from "./Events";

export const EventsIndex = () => {
    const [searchValue, setSearchValue] = useState("");
    return (
        <section className="px-[72px] pb-20 pt-20">
            <Header title="Events" description="The events that you have sent" />
            <div className="mt-4 h-full w-full space-y-12">
                <div className="flex justify-between">
                    <h3 className="font-semibold text-intg-text"></h3>

                    <div className="basis-[30%]">
                        <TextInput
                            placeholder="Search by name or email"
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            icon={Search}
                            className="w-full"
                        />
                    </div>
                </div>
                <Events />
            </div>
        </section>
    );
};
