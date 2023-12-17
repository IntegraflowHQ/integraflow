import { useAuthToken } from "@/modules/auth/hooks/useAuthToken";
import { useEvents } from "@/modules/surveys/hooks/useEvents";
import useWorkspace from "@/modules/workspace/hooks/useWorkspace";
import { Info, Search } from "@/ui/icons";
import { SearchSelect, SearchSelectItem } from "@tremor/react";
import { Zap } from "lucide-react";
import { useState } from "react";

const EventIcon = () => <Zap className="text-intg-text" fill="#AFAAC7" />;

export default function Triggers() {
    const { eventDefinitions, eventProperties, propertyDefinitions } =
        useEvents();
    const { token } = useAuthToken();
    const { workspace } = useWorkspace();
    const [isAddingEvent, setIsAddingEvent] = useState(false);
    const [selectedEvents, setSelectedEvents] = useState<string[]>([]);

    const handleAddEvent = (event: string) => {
        setSelectedEvents((prev) => [...prev, event]);
        setIsAddingEvent(false);
    };

    console.log("token: ", token);
    console.log("projectId: ", workspace?.project.id);
    console.log("eventDefinitions: ", eventDefinitions);
    console.log("eventProperties: ", eventProperties);
    console.log("propertyDefinitions: ", propertyDefinitions);

    return (
        <div className="space-y-2 p-4">
            <div className="rounded-lg bg-intg-bg-9 p-6">
                <div className="space-y-2">
                    <header className="flex items-center gap-2">
                        <h3 className="text-white">When to send</h3>
                        <Info />
                    </header>

                    <div className="flex flex-wrap items-center gap-2">
                        {selectedEvents.map((event) => (
                            <div
                                key={event}
                                className="flex items-center gap-2 rounded-lg bg-intg-bg-9 p-2"
                            >
                                <EventIcon />
                                <span className="text-intg-text">{event}</span>
                            </div>
                        ))}
                        {isAddingEvent && (
                            <SearchSelect
                                className="scrollbar-hide w-[268px] rounded-lg border-2 border-[#28213B] bg-intg-bg-9 text-intg-text-1"
                                placeholder="Search events..."
                                icon={Search}
                                onValueChange={handleAddEvent}
                            >
                                {eventDefinitions.map((event) => (
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
                            Add event or date rule
                        </button>
                    </div>
                </div>
            </div>

            <div className="rounded-lg bg-intg-bg-9 p-6">
                <div className="space-y-2">
                    <header className="flex items-center gap-2">
                        <h3 className="text-white">Where to send</h3>
                        <Info />
                    </header>
                    <button className="text-intg-text underline">
                        Add page rule
                    </button>
                </div>
            </div>
        </div>
    );
}
