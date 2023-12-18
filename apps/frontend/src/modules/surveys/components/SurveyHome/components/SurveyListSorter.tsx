import * as Select from "@radix-ui/react-select";
import { ChevronDown } from "lucide-react";

// next year
export const SurveyListSorter = () => {
    return (
        <Select.Root>
            <Select.Trigger
                aria-label="sort surveys"
                className="inline-flex gap-[10px] border border-intg-bg-7 bg-intg-bg-8"
            >
                <Select.Value placeholder="Sort by" />
                <Select.Icon>
                    <ChevronDown size="20" color="#AFAAC7" />
                </Select.Icon>
            </Select.Trigger>

            <Select.Portal>
                <Select.Content className="border-intg-7 h-fit rounded-sm border bg-intg-bg-8 px-3 py-2">
                    <Select.Viewport>
                        <Select.Group>
                            <Select.Label>Field</Select.Label>
                            <Select.Item value="name">Name</Select.Item>
                        </Select.Group>
                    </Select.Viewport>
                </Select.Content>
            </Select.Portal>
        </Select.Root>
    );
};
