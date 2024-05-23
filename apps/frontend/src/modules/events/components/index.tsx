import {
    EventDefinitionCountableEdge,
    EventPropertyWithDefinition,
    EventsQuery,
    useEventDefinitionsQuery,
    useEventsLazyQuery,
    usePropertiesWithDefinitionsLazyQuery,
} from "@/generated/graphql";
import { Dialog, DialogContent, DialogTrigger, Header, Spinner, TextInput } from "@/ui";
import { QuestionIcon, Search } from "@/ui/icons";
import PeopleIconLg from "@/ui/icons/PeopleIconLg";
import { Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from "@tremor/react";
import { format } from "date-fns";
import { useState } from "react";

export const EventsIndex = () => {
    const [searchValue, setSearchValue] = useState("");
    const [selectedEvent, setSelectedEvent] = useState<EventDefinitionCountableEdge | null>(null);
    const [propertiesWithDefinitions, setPropertiesWithDefinitions] = useState<EventPropertyWithDefinition[] | null>();
    const [events, setEvents] = useState<EventsQuery | null>(null);

    const { data } = useEventDefinitionsQuery();

    const [getEvents] = useEventsLazyQuery();
    const [getPropertiesWithDefinitions, { loading }] = usePropertiesWithDefinitionsLazyQuery();

    const filteredEvents = data?.eventDefinitions?.edges.filter((event) =>
        event.node.name.toLowerCase().includes(searchValue.toLowerCase()),
    );
    const parsedEventsProperties =
        events?.events?.edges[0].node.properties && JSON.parse(events?.events?.edges[0].node.properties);

    const handleEventDetails = async (event: EventDefinitionCountableEdge) => {
        const propertiesWithDefinitionsResponse = await getPropertiesWithDefinitions({
            variables: { event: event.node.name },
        });
        const eventsResponse = await getEvents({
            variables: {
                first: 1,
                filters: {
                    event: event.node.name,
                },
            },
        });

        setPropertiesWithDefinitions(
            propertiesWithDefinitionsResponse.data?.propertiesWithDefinitions as EventPropertyWithDefinition[],
        );
        setEvents(eventsResponse.data as EventsQuery);
    };

    return (
        <section className="px-[72px] pb-20 pt-20">
            <Header title="Events" description="The events that you have sent" />
            <div className="mt-4 h-full w-full space-y-12">
                <div className="flex justify-between">
                    <h3 className="font-semibold text-intg-text"></h3>

                    <div className="basis-[30%]">
                        <TextInput
                            placeholder="Search by name or email"
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            icon={Search}
                            className="w-full"
                        />
                    </div>
                </div>
                <div className="text-intg-text">
                    <Table className="scrollbar-hide table-auto rounded-t-lg">
                        <TableHead className="bg-intg-bg-9 font-light hover:cursor-pointer">
                            <TableHeaderCell className="w-1/2">Event Name</TableHeaderCell>
                            <TableHeaderCell className="text-md flex items-center space-x-1 font-normal">
                                <span>Count</span>
                                <span>
                                    <QuestionIcon />
                                </span>
                            </TableHeaderCell>
                            <TableHeaderCell className="text-md font-normal">Last Seen</TableHeaderCell>
                        </TableHead>
                        <TableBody className="border-intg-bg-4">
                            {filteredEvents?.length ? (
                                filteredEvents.map((event) => {
                                    return (
                                        <TableRow
                                            key={event.node.id}
                                            className="cursor-pointer border-l border-r border-intg-bg-4 text-center font-light transition-all duration-300 ease-in"
                                            onClick={() => {
                                                setSelectedEvent(event as EventDefinitionCountableEdge);
                                                handleEventDetails(event as EventDefinitionCountableEdge);
                                            }}
                                        >
                                            <TableCell>{event.node.name}</TableCell>
                                            <TableCell>
                                                {format(new Date(event.node.createdAt ?? ""), "MMM dd, yyyy")}
                                            </TableCell>
                                            <TableCell>
                                                {format(new Date(event.node.lastSeenAt ?? ""), "MMM dd, yyyy")}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            ) : (
                                <div className="ml-48 mt-40 flex w-full">
                                    <div className=" m-auto flex flex-col">
                                        <PeopleIconLg />
                                        <p className="text-2xl font-semibold">No events yet</p>
                                        <p className="text-sm">We couldn't find any events</p>
                                    </div>
                                </div>
                            )}
                        </TableBody>
                    </Table>
                    <Dialog
                        open={selectedEvent !== null}
                        onOpenChange={(open) => {
                            if (!open) {
                                setSelectedEvent(null);
                            }
                        }}
                    >
                        <DialogTrigger />
                        <DialogContent className="p-6">
                            {loading ? (
                                <Spinner />
                            ) : (
                                <Table className="scrollbar-hide mt-4 table-auto rounded-t-lg">
                                    <TableHead className="bg-intg-bg-9 font-light hover:cursor-pointer">
                                        <TableHeaderCell className="w-1/2">Property Name</TableHeaderCell>
                                        <TableHeaderCell className="text-md flex items-center space-x-1 font-normal">
                                            Type
                                        </TableHeaderCell>
                                        <TableHeaderCell className="text-md font-normal">Example</TableHeaderCell>
                                    </TableHead>
                                    <TableBody className="border-b border-t border-intg-bg-4">
                                        {propertiesWithDefinitions?.map((item) => {
                                            return (
                                                <TableRow className="border border-intg-bg-4">
                                                    <TableCell>{item.event}</TableCell>
                                                    <TableCell>{item.propertyType}</TableCell>
                                                    <TableCell>{events?.events?.edges[0].node.event}</TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            )}
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </section>
    );
};
