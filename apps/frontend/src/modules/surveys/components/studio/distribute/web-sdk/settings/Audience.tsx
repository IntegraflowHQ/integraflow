import useChannels from "@/modules/surveys/hooks/useChannels";
import useStudioState from "@/modules/surveys/hooks/useStudioState";
import {
    EventFilter,
    TriggerConditionInput,
    WebChannelAccordionProps,
} from "@/types";
import { Audience as AudienceIcon, Info } from "@/ui/icons";
import { FilterOperator } from "@integraflow/web/src/types";
import { useState } from "react";
import FilterDetails from "./FilterDetails";
import FilterOperators from "./FilterOperators";
import PropertySelect from "./PropertySelect";

export default function Audience({ channel }: WebChannelAccordionProps) {
    const { addingAudienceProperty, updateStudio } = useStudioState();
    const { personProperties } = useChannels();
    const [filterInput, setFilterInput] = useState<EventFilter | null>(null);
    const [conditionInput, setConditionInput] = useState<
        TriggerConditionInput | undefined
    >();

    return (
        <div className="px-4 pb-6 text-intg-text">
            <div className="space-y-[26px] rounded-lg bg-intg-bg-9 p-6">
                <header className="flex items-center gap-2">
                    <h3 className="text-base font-medium text-white">
                        Audience
                    </h3>
                    <Info />
                </header>

                <div className="flex flex-wrap items-center gap-4 ">
                    <div className="inline-flex items-center gap-2 rounded-[4px] bg-intg-bg-19 p-2">
                        <AudienceIcon />
                        <span>User</span>
                    </div>

                    {channel?.conditions?.filters?.map((filter, index) => (
                        <FilterDetails
                            key={index}
                            filter={{ ...filter, property: filter.attribute }}
                            onRemoveFilter={() => {
                                // onRemoveFilter(index);
                            }}
                        />
                    ))}

                    {conditionInput && (
                        <FilterOperators
                            conditionDetails={conditionInput}
                            defaultOpen={true}
                            onEnter={() => {
                                if (filterInput) {
                                    // onAddFilter(filterInput);
                                }
                                console.log("ENTER");
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
                            className="underline"
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
