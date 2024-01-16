import useChannels from "@/modules/surveys/hooks/useChannels";
import useStudioState from "@/modules/surveys/hooks/useStudioState";
import {
    EventFilter,
    TriggerConditionInput,
    WebChannelAccordionProps,
} from "@/types";
import { Info } from "@/ui/icons";
import { FilterOperator, LogicOperator } from "@integraflow/web/src/types";
import { useState } from "react";
import FilterDetails from "./filters/FilterDetails";
import FilterOperators from "./filters/FilterOperators";
import Filters from "./filters/Filters";
import PropertySelect from "./filters/PropertySelect";

export default function Audience({ channel }: WebChannelAccordionProps) {
    const { addingAudienceProperty, updateStudio } = useStudioState();
    const { personProperties, updateChannel } = useChannels();
    const [filterInput, setFilterInput] = useState<EventFilter | null>(null);
    const [conditionInput, setConditionInput] = useState<
        TriggerConditionInput | undefined
    >();

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
        if (!channel.id) return;
        if (
            !channel.conditions ||
            !channel.conditions.filters ||
            !channel.conditions.operator
        ) {
            const conditions = {
                operator: LogicOperator.AND,
                filters: [{ ...filter, attribute: filter.property }],
            };
            updateChannel(channel, {
                conditions: JSON.stringify(conditions),
            });
        } else {
            const conditions = {
                ...channel.conditions,
                filters: [
                    ...channel?.conditions?.filters,
                    { ...filter, attribute: filter.property },
                ],
            };
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
                <header className="inline-flex items-center gap-2">
                    <h3 className="text-base font-medium text-white">
                        Audience
                    </h3>
                    <Info />
                </header>

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
                                <FilterDetails
                                    filter={filterInput}
                                    onRemoveFilter={() => setFilterInput(null)}
                                />
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
                            className="p-2 underline"
                            onClick={() =>
                                updateStudio({ addingAudienceProperty: true })
                            }
                        >
                            add audience rule
                        </button>
                    </PropertySelect>
                </div>
            </div>
        </div>
    );
}
