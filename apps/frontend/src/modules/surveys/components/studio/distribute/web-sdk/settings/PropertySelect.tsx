import { PropertyDefinition } from "@/generated/graphql";
import * as Popover from "@radix-ui/react-popover";
import { useState } from "react";

type Props = {
    open: boolean;
    options: (PropertyDefinition | undefined)[];
    onClose: () => void;
    onSelect: (selected: PropertyDefinition) => void;
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
        <Popover.Root
            open={open}
            onOpenChange={(value) => {
                if (value === false) {
                    onClose();
                }
            }}
        >
            <Popover.Trigger asChild>{children}</Popover.Trigger>

            <Popover.Portal>
                <Popover.Content className="flex flex-col gap-2 rounded-lg border border-intg-bg-10 bg-intg-bg-9 px-2 py-3 text-intg-text">
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-intg-bg-9"
                    />
                    <div className="flex max-h-[250px] flex-col overflow-y-auto">
                        {filteredOptions.map((option, index) => {
                            if (!option) return null;

                            return (
                                <button
                                    key={index}
                                    className="w-[188px] rounded-lg p-2 text-left hover:bg-intg-bg-15 data-[state=active]:bg-intg-bg-15"
                                    onClick={() => {
                                        onSelect(option);
                                    }}
                                >
                                    {option.name}
                                </button>
                            );
                        })}
                    </div>
                </Popover.Content>
            </Popover.Portal>
        </Popover.Root>
    );
}
