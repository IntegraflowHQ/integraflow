import { PROPERTY_FIELDS } from "@/constants";
import { EventFilter, TriggerConditionInput } from "@/types";
import { DatePicker } from "@/ui";
import { CheckComplete, CheckPending } from "@/ui/icons";
import { cn } from "@/utils";
import { FilterOperator } from "@integraflow/web/src/types";
import * as Popover from "@radix-ui/react-popover";
import { useEffect, useState } from "react";

const booleanOperators = [
    FilterOperator.HAS_ANY_VALUE,
    FilterOperator.IS_UNKNOWN,
    FilterOperator.IS_TRUE,
    FilterOperator.IS_FALSE,
];

export default function FilterOperators({
    conditionDetails,
    onEnter,
    onInput,
    children,
}: {
    conditionDetails?: TriggerConditionInput;
    onEnter?: () => void;
    onInput?: (data: EventFilter) => void;
    children?: React.ReactNode;
}) {
    const [focused, setFocused] = useState(FilterOperator.HAS_ANY_VALUE);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Enter") {
                onEnter?.();
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [onEnter]);

    return (
        <Popover.Root
            open={true}
            onOpenChange={(value) => {
                if (conditionDetails && value === false) {
                    onEnter?.();
                }
            }}
        >
            <Popover.Anchor>{children}</Popover.Anchor>
            <Popover.Portal>
                <Popover.Content
                    className="min-w-[188px] rounded-lg border border-intg-bg-15 bg-intg-bg-9 p-2"
                    sideOffset={8}
                    onFocusOutside={() => onEnter?.()}
                >
                    {conditionDetails && (
                        <div>
                            {PROPERTY_FIELDS[conditionDetails?.type].map((field, index) => (
                                <div key={index}>
                                    <button
                                        key={field.operator}
                                        className="flex w-full items-center gap-2 rounded p-2 text-intg-text hover:bg-intg-bg-15"
                                        onClick={() => {
                                            setFocused(field.operator);
                                            if (booleanOperators.includes(field.operator)) {
                                                onInput?.({
                                                    property: conditionDetails.property,
                                                    operator: field.operator,
                                                    value: true,
                                                });
                                            }
                                        }}
                                    >
                                        {focused === field.operator ? <CheckComplete /> : <CheckPending />}
                                        <span>{field.label}</span>
                                    </button>

                                    {!booleanOperators.includes(field.operator) ? (
                                        <div
                                            className={cn(
                                                focused === field.operator ? "h-max p-2" : "h-0 overflow-hidden",
                                            )}
                                        >
                                            {["Numeric", "String"].includes(conditionDetails.type) ? (
                                                <input
                                                    type={conditionDetails.type === "Numeric" ? "number" : "text"}
                                                    autoFocus={focused === field.operator}
                                                    className="w-full rounded-lg border border-intg-text bg-transparent px-2 py-1 text-intg-text"
                                                    placeholder="Enter value"
                                                    onChange={(e) => {
                                                        onInput?.({
                                                            property: conditionDetails.property,
                                                            operator: field.operator,
                                                            value:
                                                                conditionDetails.type === "Numeric"
                                                                    ? Number(e.target.value)
                                                                    : e.target.value,
                                                        });
                                                    }}
                                                />
                                            ) : null}
                                            {conditionDetails.type === "Datetime" ? (
                                                <DatePicker
                                                    onChange={(e) => {
                                                        if (!e.target.value) return;
                                                        onInput?.({
                                                            property: conditionDetails.property,
                                                            operator: field.operator,
                                                            value: e.target.value?.toISOString() ?? "",
                                                        });
                                                    }}
                                                />
                                            ) : null}
                                        </div>
                                    ) : null}
                                </div>
                            ))}
                        </div>
                    )}
                    <Popover.Arrow className="fill-intg-bg-9" />
                </Popover.Content>
            </Popover.Portal>
        </Popover.Root>
    );
}
