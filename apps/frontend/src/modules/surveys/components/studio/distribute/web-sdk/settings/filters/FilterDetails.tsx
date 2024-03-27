import { useProject } from "@/modules/projects/hooks/useProject";
import { EventFilter } from "@/types";
import { X } from "@/ui/icons";
import { getFilterLabel } from "@/utils";
import { FilterValue } from "@integraflow/web/src/types";
import { format } from "date-fns";

type Props = {
    filter: EventFilter;
    onRemoveFilter: () => void;
};

export default function FilterDetails({ filter, onRemoveFilter }: Props) {
    const { getPropertyDefinition } = useProject();
    const definition = getPropertyDefinition(filter.property);

    const formatIfDate = (value: FilterValue) => {
        if (definition && definition.propertyType === "Datetime") {
            try {
                const parsedValue = format(new Date(value as string), "PPP");
                return parsedValue;
            } catch (_) {
                return value;
            }
        }
        return value;
    };

    return (
        <div
            className={
                "bg-intg-bg-19 inline-flex w-max items-center gap-2 rounded-lg p-2 text-intg-text"
            }
        >
            <span>
                {filter.property}{" "}
                {getFilterLabel(filter.operator)?.toLowerCase()}{" "}
                {formatIfDate(filter.value)}
            </span>
            <button onClick={onRemoveFilter}>
                <X />
            </button>
        </div>
    );
}
