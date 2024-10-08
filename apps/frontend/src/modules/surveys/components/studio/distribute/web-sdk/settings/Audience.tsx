import { useProject } from "@/modules/projects/hooks/useProject";
import useChannels from "@/modules/surveys/hooks/useChannels";
import { useStudioStore } from "@/modules/surveys/states/studio";
import { EventFilter, FilterOperator, LogicOperator, TriggerConditionInput, WebChannelAccordionProps } from "@/types";
import { Header } from "@/ui";
import { cn } from "@/utils";
import { useState } from "react";
import FilterDetails from "./filters/FilterDetails";
import FilterOperators from "./filters/FilterOperators";
import Filters from "./filters/Filters";
import PropertySelect from "./filters/PropertySelect";

export default function Audience({ channel }: WebChannelAccordionProps) {
    const { addingAudienceProperty, updateStudio } = useStudioStore((state) => state);
    const { createChannel, updateChannel } = useChannels();
    const { personProperties } = useProject();
    const [filterInput, setFilterInput] = useState<EventFilter | null>(null);
    const [conditionInput, setConditionInput] = useState<TriggerConditionInput | undefined>();

    const handleOperatorChange = (operator: LogicOperator) => {
        const conditions = {
            ...channel.conditions,
            operator,
        };
        updateChannel(channel, {
            conditions: JSON.stringify(conditions),
        });
    };

    const handleAddFilter = (filter: EventFilter) => {
        const conditions = {
            ...channel.conditions,
            filters: [...channel.conditions.filters, { ...filter, attribute: filter.property }],
        };

        if (!channel.id) {
            createChannel({
                ...channel,
                id: crypto.randomUUID(),
                conditions: conditions,
            });
        } else {
            updateChannel(channel, {
                conditions: JSON.stringify(conditions),
            });
        }
    };

    const handleRemoveFilter = (index: number) => {
        const filters = [...channel.conditions.filters];
        filters.splice(index, 1);
        const conditions = {
            ...channel.conditions,
            filters,
        };
        updateChannel(channel, {
            conditions: JSON.stringify(conditions),
        });
    };

    return (
        <div className="px-4 pb-6 text-intg-text">
            <div className="flex flex-col gap-[26px] rounded-lg bg-intg-bg-9 p-6">
                <Header variant="3" font="medium" title="Audience" />

                <div className="inline-flex flex-wrap gap-1 [&>*]:mb-4">
                    <Filters
                        variant="audience"
                        filters={channel.conditions.filters}
                        onOperatorChange={handleOperatorChange}
                        onRemoveFilter={handleRemoveFilter}
                        operator={channel.conditions.operator}
                    />

                    {conditionInput && (
                        <FilterOperators
                            conditionDetails={conditionInput}
                            onEnter={() => {
                                if (filterInput) {
                                    handleAddFilter(filterInput);
                                }
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
                        options={personProperties}
                        open={addingAudienceProperty}
                        onClose={() => {
                            updateStudio({ addingAudienceProperty: false });
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
                        <button
                            className={cn("py-2 underline", channel.conditions.filters.length ? "px-2" : "")}
                            onClick={() => updateStudio({ addingAudienceProperty: true })}
                        >
                            add audience rule
                        </button>
                    </PropertySelect>
                </div>
            </div>
        </div>
    );
}
