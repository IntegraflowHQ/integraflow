import { PropertyDefinition } from "@/generated/graphql";
import { TextInput } from "@/ui";
import { Popover, PopoverContent, PopoverTrigger } from "@/ui/Popover";
import { Search } from "@/ui/icons";
import { useState } from "react";

type Props = {
    open: boolean;
    options: (Omit<PropertyDefinition, "project"> | undefined)[];
    onClose: () => void;
    onSelect: (selected: Omit<PropertyDefinition, "project">) => void;
    children: React.ReactNode;
};

export default function PropertySelect({
    open,
    options,
    onClose,
    onSelect,
    children,
}: Props) {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredOptions = options.filter(
        (option) =>
            option?.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    return (
        <Popover
            open={open}
            onOpenChange={(value) => {
                if (value === false) {
                    onClose();
                }
                setSearchTerm("");
            }}
        >
            <PopoverTrigger asChild>{children}</PopoverTrigger>

            <PopoverContent className="flex flex-col gap-2 rounded-lg border border-intg-bg-10 bg-intg-bg-9 px-2 py-3 text-intg-text">
                <TextInput
                    icon={Search}
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />

                <div className="flex max-h-[250px] flex-col overflow-y-auto">
                    {filteredOptions.map((option, index) => {
                        if (!option) return null;

                        return (
                            <button
                                key={index}
                                className="rounded-lg p-2 text-left hover:bg-intg-bg-15 data-[state=active]:bg-intg-bg-15"
                                onClick={() => {
                                    onSelect(option);
                                }}
                            >
                                {option.name}
                            </button>
                        );
                    })}

                    {!filteredOptions.length && (
                        <span className="text-center text-intg-text">
                            No results
                        </span>
                    )}
                </div>
            </PopoverContent>
        </Popover>
    );
}
