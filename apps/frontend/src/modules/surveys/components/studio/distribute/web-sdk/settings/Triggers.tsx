import { useProject } from "@/modules/projects/hooks/useProject";
import useChannels from "@/modules/surveys/hooks/useChannels";
import { EventFilter, LogicOperator, TriggerCondition, WebChannelAccordionProps } from "@/types";
import { Header, NumberInput, TextInput } from "@/ui";
import { Popover, PopoverContent, PopoverTrigger } from "@/ui/Popover";
import { Search } from "@/ui/icons";
import { Zap } from "lucide-react";
import { useState } from "react";
import Event from "./Event";

const EventIcon = () => <Zap className="text-intg-text" fill="#AFAAC7" />;

export default function Triggers({ channel }: WebChannelAccordionProps) {
    const { createChannel, updateChannel } = useChannels();
    const { eventDefinitions, getProperties } = useProject();
    const [isAddingEvent, setIsAddingEvent] = useState(false);
    const [eventQ, setEventQ] = useState("");

    const selectedEvents = channel?.triggers?.conditions?.map((condition: TriggerCondition) => condition.event);
    const availableEvents = eventDefinitions.filter((event) => !selectedEvents?.includes(event.name));

    const filteredOptions = availableEvents.filter((option) =>
        option?.name.toLowerCase().includes(eventQ.toLowerCase()),
    );

    const handleAddEvent = (event: string) => {
        if (!channel.id) {
            createChannel({
                ...channel,
                id: crypto.randomUUID(),
                triggers: {
                    conditions: [
                        {
                            event,
                            filters: [],
                            operator: LogicOperator.AND,
                        },
                    ],
                    delay: 0,
                },
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
        if (!channel.id || !channel.triggers || !channel.triggers.conditions) return;

        const conditions = channel?.triggers?.conditions?.filter(
            (condition: TriggerCondition) => condition.event !== event,
        );

        updateChannel(channel, {
            triggers: JSON.stringify({
                ...channel.triggers,
                conditions,
            }),
        });
    };

    const handleAddFilter = (event: string, filter: EventFilter) => {
        if (!channel.id || !channel.triggers || !channel.triggers.conditions) return;

        const conditions = channel?.triggers?.conditions?.map((condition: TriggerCondition) => {
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

    const handleRemoveFilter = (event: string, index: number) => {
        const conditions = channel?.triggers?.conditions?.map((condition: TriggerCondition) => {
            if (condition.event !== event) return condition;
            if (!condition.filters) return condition;

            const filters = [...(condition?.filters ?? [])];
            filters.splice(index, 1);

            return {
                ...condition,
                filters,
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
        const conditions = channel?.triggers?.conditions?.map((condition: TriggerCondition) => {
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
        <div className="px-4 pb-6 text-intg-text">
            <div className="flex flex-col gap-[26px] rounded-lg bg-intg-bg-9 p-6">
                <Header variant="3" font="medium" title="When to send" />

                <div className="space-y-2">
                    {channel?.triggers?.conditions?.map((condition: TriggerCondition, index: number) => (
                        <Event
                            key={index}
                            condition={condition}
                            properties={getProperties(condition.event)}
                            onRemove={() => handleRemoveEvent(condition.event)}
                            onAddFilter={(filter) => handleAddFilter(condition.event, filter)}
                            onOperatorChange={(operator) => handleOperatorChange(condition.event, operator)}
                            onRemoveFilter={(index) => handleRemoveFilter(condition.event, index)}
                        />
                    ))}

                    <Popover
                        open={isAddingEvent}
                        onOpenChange={(value) => {
                            setIsAddingEvent(value);
                            setEventQ("");
                        }}
                    >
                        <PopoverTrigger asChild>
                            <button className="text-intg-text underline">Add event rule</button>
                        </PopoverTrigger>

                        <PopoverContent className="flex flex-col gap-2 rounded-lg border border-intg-bg-10 bg-intg-bg-9 px-2 py-3 text-intg-text">
                            <TextInput
                                placeholder="Search events..."
                                value={eventQ}
                                onChange={(e) => setEventQ(e.target.value)}
                                icon={Search}
                            />
                            <div className="flex max-h-[250px] w-[268px] flex-col overflow-y-auto">
                                {filteredOptions.map((option, index) => {
                                    if (!option) return null;

                                    return (
                                        <button
                                            key={index}
                                            className="flex gap-2 rounded-lg border-2 border-intg-bg-9 p-2 text-intg-text hover:border-[#28213B] "
                                            onClick={() => {
                                                handleAddEvent(option.name);
                                            }}
                                        >
                                            <EventIcon />
                                            <span>{option.name}</span>
                                        </button>
                                    );
                                })}

                                {filteredOptions.length === 0 ? (
                                    <div className="flex h-full flex-col items-center justify-center">
                                        <EventIcon />
                                        <span className="text-intg-text">No events found</span>
                                    </div>
                                ) : null}
                            </div>
                        </PopoverContent>
                    </Popover>
                </div>

                <NumberInput
                    label="Delay"
                    defaultValue={channel.triggers.delay}
                    onChange={(e) => {
                        updateChannel(channel, {
                            triggers: JSON.stringify({
                                ...channel.triggers,
                                delay: e.target.value,
                            }),
                        });
                    }}
                    className="max-w-72"
                />
            </div>
        </div>
    );
}
