import { AudienceFilter, EventFilter } from "@/types";
import { SelectInput } from "@/ui";
import { LogicOperator } from "@integraflow/web/src/types";
import { Fragment } from "react";
import FilterDetails from "./FilterDetails";

type AudienceFilterProps = {
    variant: "audience";
    operator: LogicOperator;
    filters: AudienceFilter[];
    onRemoveFilter: (index: number) => void;
    onOperatorChange: (operator: LogicOperator) => void;
};

type EventFilterProps = {
    variant: "event";
    operator: LogicOperator;
    filters: EventFilter[];
    onRemoveFilter: (index: number) => void;
    onOperatorChange: (operator: LogicOperator) => void;
};

type Props = AudienceFilterProps | EventFilterProps;

export default function Filters({
    variant,
    filters,
    operator,
    onOperatorChange,
    onRemoveFilter,
}: Props) {
    return (
        <>
            {filters?.map((filter, index) => (
                <Fragment key={index}>
                    {index > 0 ? (
                        <div className="inline-block w-[75px]">
                            <SelectInput
                                className="rounded-lg bg-intg-bg-19 py-[9px]"
                                value={operator ?? LogicOperator.AND}
                                options={[
                                    {
                                        label: "",
                                        value: "empty",
                                    },
                                    {
                                        label: LogicOperator.AND,
                                        value: LogicOperator.AND,
                                    },
                                    {
                                        label: LogicOperator.OR,
                                        value: LogicOperator.OR,
                                    },
                                ]}
                                onChange={(e) => {
                                    onOperatorChange(
                                        e.target.value as LogicOperator,
                                    );
                                }}
                                name="operator"
                            />
                        </div>
                    ) : null}

                    <FilterDetails
                        filter={
                            variant === "audience"
                                ? {
                                      ...filter,
                                      property: (filter as AudienceFilter)
                                          .attribute,
                                  }
                                : (filter as EventFilter)
                        }
                        onRemoveFilter={() => onRemoveFilter(index)}
                        rounded={
                            index === 0
                                ? "left"
                                : index === filters.length - 1
                                ? "right"
                                : undefined
                        }
                    />
                </Fragment>
            ))}
        </>
    );
}
