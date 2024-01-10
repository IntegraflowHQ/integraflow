import { SurveyChannelTypeEnum } from "@/generated/graphql";
import useChannels from "@/modules/surveys/hooks/useChannels";
import { EventFilter, WebChannelAccordionProps } from "@/types";
import { Info, Search } from "@/ui/icons";
import { LogicOperator } from "@integraflow/web/src/types";
import { SearchSelect, SearchSelectItem } from "@tremor/react";
import { Zap } from "lucide-react";
import { useState } from "react";
import Event from "./Event";

const EventIcon = () => <Zap className="text-intg-text" fill="#AFAAC7" />;

export default function Triggers({ channel }: WebChannelAccordionProps) {
    const { eventDefinitions, getProperties, createChannel, updateChannel } =
        useChannels();
    const [isAddingEvent, setIsAddingEvent] = useState(false);

    const selectedEvents = channel?.triggers?.conditions?.map(
        (condition) => condition.event,
    );
    const availableEvents = eventDefinitions.filter(
        (event) => !selectedEvents?.includes(event.name),
    );

    console.log("channel: ", channel);

    const handleAddEvent = (event: string) => {
        if (!channel.id) {
            createChannel({
                id: crypto.randomUUID(),
                triggers: JSON.stringify({
                    conditions: [
                        {
                            event,
                            filters: [],
                            operator: LogicOperator.AND,
                        },
                    ],
                    delay: 0,
                }),
                type: SurveyChannelTypeEnum.WebSdk,
            });
        } else {
            const conditions = [
                ...(channel.triggers.conditions || []),
                {
                    event,
                    filters: [],
                    operator: LogicOperator.OR,
                },
            ];
            updateChannel(channel, {
                triggers: JSON.stringify({
                    ...channel.triggers,
                    conditions,
                }),
            });
        }

        setIsAddingEvent(false);
    };

    const handleRemoveEvent = (event: string) => {
        if (!channel.id || !channel.triggers || !channel.triggers.conditions)
            return;

        const conditions = channel?.triggers?.conditions?.filter(
            (condition) => condition.event !== event,
        );

        updateChannel(channel, {
            triggers: JSON.stringify({
                ...channel.triggers,
                conditions,
            }),
        });
    };

    const handleAddFilter = (event: string, filter: EventFilter) => {
        if (!channel.id || !channel.triggers || !channel.triggers.conditions)
            return;

        const conditions = channel?.triggers?.conditions?.map((condition) => {
            if (condition.event !== event) return condition;

            return {
                ...condition,
                filters: [...(condition.filters || []), filter],
            };
        });

        updateChannel(channel, {
            triggers: JSON.stringify({
                ...channel.triggers,
                conditions,
            }),
        });
    };

    const handleRemoveFilter = (event: string, filter: EventFilter) => {
        const conditions = channel?.triggers?.conditions?.map((condition) => {
            if (condition.event !== event) return condition;

            return {
                ...condition,
                filters: condition.filters?.filter((f) => {
                    console.log(f, filter);
                    if (f.property !== filter.property) return true;
                    if (f.value !== filter.value) return true;
                    if (f.operator !== filter.operator) return true;
                    return false;
                }),
            };
        });

        updateChannel(channel, {
            triggers: JSON.stringify({
                ...channel.triggers,
                conditions,
            }),
        });
    };

    const handleOperatorChange = (event: string, operator: LogicOperator) => {
        const conditions = channel?.triggers?.conditions?.map((condition) => {
            if (condition.event !== event) return condition;

            return {
                ...condition,
                operator,
            };
        });

        updateChannel(channel, {
            triggers: JSON.stringify({
                ...channel.triggers,
                conditions,
            }),
        });
    };

    return (
        <div className="p-4">
            <div className="rounded-lg bg-intg-bg-9 p-6">
                <div className="space-y-2">
                    <header className="flex items-center gap-2">
                        <h3 className="text-base font-medium text-white">
                            When to send
                        </h3>
                        <Info />
                    </header>

                    <div className="space-y-2">
                        {channel?.triggers?.conditions?.map(
                            (condition, index) => (
                                <Event
                                    key={index}
                                    condition={condition}
                                    properties={getProperties(condition.event)}
                                    onRemove={() =>
                                        handleRemoveEvent(condition.event)
                                    }
                                    onAddFilter={(filter) =>
                                        handleAddFilter(condition.event, filter)
                                    }
                                    onOperatorChange={(operator) =>
                                        handleOperatorChange(
                                            condition.event,
                                            operator,
                                        )
                                    }
                                    onRemoveFilter={(filter) =>
                                        handleRemoveFilter(
                                            condition.event,
                                            filter,
                                        )
                                    }
                                />
                            ),
                        )}
                        {isAddingEvent && (
                            <SearchSelect
                                className="scrollbar-hide w-[268px] rounded-lg border-2 border-[#28213B] bg-intg-bg-9 text-intg-text-1"
                                placeholder="Search events..."
                                icon={Search}
                                onValueChange={handleAddEvent}
                            >
                                {availableEvents.map((event) => (
                                    <SearchSelectItem
                                        key={event.id}
                                        value={event.name}
                                        icon={EventIcon}
                                        className="gap-2 border border-intg-bg-9 text-intg-text hover:border-[#28213B]"
                                    >
                                        {event.name}
                                    </SearchSelectItem>
                                ))}
                            </SearchSelect>
                        )}
                        <button
                            className="text-intg-text underline"
                            onClick={() => setIsAddingEvent(true)}
                        >
                            Add event rule
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
