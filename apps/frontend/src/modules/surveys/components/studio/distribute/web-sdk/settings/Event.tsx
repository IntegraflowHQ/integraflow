import { PropertyDefinition } from "@/generated/graphql";
import { useStudioStore } from "@/modules/surveys/states/studio";
import { EventFilter, TriggerCondition, TriggerConditionInput, FilterOperator, LogicOperator } from "@/types";
import { PlusCircle, X } from "@/ui/icons";
import { Ampersand, Zap } from "lucide-react";
import { useState } from "react";
import FilterDetails from "./filters/FilterDetails";
import FilterOperators from "./filters/FilterOperators";
import Filters from "./filters/Filters";
import PropertySelect from "./filters/PropertySelect";

export default function Event({
    condition,
    properties,
    onRemove,
    onAddFilter,
    onOperatorChange,
    onRemoveFilter,
}: {
    condition: TriggerCondition;
    properties: PropertyDefinition[];
    onRemove: () => void;
    onAddFilter: (data: EventFilter) => void;
    onOperatorChange: (operator: LogicOperator) => void;
    onRemoveFilter: (index: number) => void;
}) {
    const { currentEvent, updateStudio } = useStudioStore((state) => state);
    const [filterInput, setFilterInput] = useState<EventFilter | null>(null);
    const [conditionInput, setConditionInput] = useState<TriggerConditionInput | undefined>();

    return (
        <div className="flex w-max max-w-full flex-wrap items-center gap-1 rounded-lg bg-intg-bg-15 py-[9px] pl-[6px] pr-6">
            <div className="flex flex-wrap gap-2 rounded bg-intg-bg-19 p-2">
                <Zap className="text-intg-text" fill="#AFAAC7" />
                <span className="text-intg-text">{condition.event}</span>
                <button onClick={onRemove}>
                    <X />
                </button>
            </div>

            {condition.filters?.length ? (
                <div className="rounded bg-intg-bg-19 p-[10px]">
                    <Ampersand className="text-intg-text" size={20} />
                </div>
            ) : null}

            <Filters
                variant="event"
                filters={condition.filters ?? ([] as EventFilter[])}
                onOperatorChange={onOperatorChange}
                onRemoveFilter={onRemoveFilter}
                operator={condition.operator}
            />

            {conditionInput && (
                <FilterOperators
                    conditionDetails={conditionInput}
                    onEnter={() => {
                        if (filterInput) {
                            onAddFilter(filterInput);
                        }
                        updateStudio({ currentEvent: "" });
                        setFilterInput(null);
                        setConditionInput(undefined);
                    }}
                    onInput={setFilterInput}
                >
                    {filterInput ? (
                        <FilterDetails filter={filterInput} onRemoveFilter={() => setFilterInput(null)} />
                    ) : null}
                </FilterOperators>
            )}

            <PropertySelect
                options={properties}
                open={currentEvent === condition.event}
                onClose={() => {
                    updateStudio({ currentEvent: "" });
                }}
                onSelect={(selected) => {
                    setConditionInput({
                        property: selected.name,
                        type: selected.propertyType,
                    });
                    setFilterInput({
                        property: selected.name,
                        operator: FilterOperator.HAS_ANY_VALUE,
                        value: true,
                    });
                }}
            >
                <button className="mx-1" onClick={() => updateStudio({ currentEvent: condition.event })}>
                    <PlusCircle color={"#AFAAC7"} />
                </button>
            </PropertySelect>
        </div>
    );
}
