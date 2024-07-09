import { EventDefinitionCountableEdge, useEventsLazyQuery } from "@/generated/graphql";
import { Properties } from "@/types";
import { ContainerWithTooltip, Dialog, DialogContent, DialogTrigger, Header, Pagination, Spinner } from "@/ui";
import { QuestionIcon } from "@/ui/icons";
import { CursorIconLg } from "@/ui/icons/CursorIconLg";
import { cn } from "@/utils";
import { Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from "@tremor/react";
import { format } from "date-fns";
import { useState } from "react";
import { useEvents } from "../hooks/useEvents";

export const EventsIndex = () => {
    const [selectedEvent, setSelectedEvent] = useState<EventDefinitionCountableEdge | null>(null);

    const {
        events,
        eventDefinitions,
        getPropertiesWithDefinitions,
        isFetchingMore,
        propertiesWithDefinitions,
        loadingProperties,
        loadingEventDefinitions,
        getMoreEventDefinitions,
    } = useEvents();

    const [getEvents, { data: singleEvent, loading: eventLoading }] = useEventsLazyQuery();

    const event: Properties | null =
        singleEvent?.events?.edges.length && singleEvent?.events?.edges[0].node?.properties
            ? (JSON.parse(singleEvent?.events?.edges[0].node.properties) as Properties)
            : null;

    const handleEventDetails = async (event: EventDefinitionCountableEdge) => {
        getPropertiesWithDefinitions(event.node.name);
        await getEvents({
            variables: {
                first: 1,
                filters: {
                    event: event.node.name,
                },
            },
        });
    };

    return (
        <section className="px-[72px] pb-20 pt-20 text-white">
            <Header title="Events" description="The events that you have received." />
            <div className="mt-4 h-full w-full">
                <div>
                    <Table
                        className={cn(
                            eventDefinitions?.edges.length ? "border" : "",
                            "scrollbar-hide bg-red table-auto rounded-t-lg border-intg-bg-4",
                        )}
                    >
                        <TableHead className="bg-intg-bg-9 font-light text-intg-text">
                            <TableRow>
                                <TableHeaderCell className="w-1/2">Event Name</TableHeaderCell>
                                <TableHeaderCell className="text-md flex items-center space-x-1 font-normal">
                                    <span>Count</span>
                                    <ContainerWithTooltip text="This is the number of times an event has been done.">
                                        <QuestionIcon />
                                    </ContainerWithTooltip>
                                </TableHeaderCell>
                                <TableHeaderCell className="text-md font-normal">Last Seen</TableHeaderCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {(eventDefinitions?.edges || []).map((event) => {
                                return (
                                    <TableRow
                                        key={event.node.id}
                                        className="cursor-pointer  border-intg-bg-4 text-center font-light transition-all duration-300 ease-in"
                                        onClick={() => {
                                            setSelectedEvent(event as EventDefinitionCountableEdge);
                                            handleEventDetails(event as EventDefinitionCountableEdge);
                                        }}
                                    >
                                        <TableCell>{event.node.name}</TableCell>
                                        <TableCell>{event.node.volume}</TableCell>
                                        <TableCell>
                                            {format(new Date(event.node.lastSeenAt ?? ""), "MMM dd, yyyy")}
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>

                    {!eventDefinitions?.edges.length ? null : (
                        <Pagination
                            hasNextPage={eventDefinitions.pageInfo.hasNextPage}
                            hasPrevPage={eventDefinitions.pageInfo.hasPreviousPage}
                            itemName="events"
                            nextPageFn={() => getMoreEventDefinitions("forward")}
                            prevPageFn={() => getMoreEventDefinitions("backward")}
                            totalCount={eventDefinitions?.totalCount as number}
                            key={"events"}
                            className="border border-t-0 border-intg-bg-4 p-4"
                        />
                    )}
                </div>

                <Dialog
                    open={selectedEvent !== null}
                    onOpenChange={(open) => {
                        if (!open) {
                            setSelectedEvent(null);
                        }
                    }}
                >
                    <DialogTrigger />
                    <DialogContent className={cn(eventLoading || loadingProperties ? "min-w-96" : "", "p-6")}>
                        {eventLoading || loadingProperties ? (
                            <div className="flex justify-center">
                                <Spinner />
                            </div>
                        ) : (
                            <Table className="scrollbar-hide mt-4 table-auto rounded-t-lg border border-intg-bg-4">
                                <TableHead className="bg-intg-bg-9 font-light hover:cursor-pointer">
                                    <TableRow>
                                        <TableHeaderCell className="w-1/2">Property Name</TableHeaderCell>
                                        <TableHeaderCell className="text-md flex items-center space-x-1 font-normal">
                                            Type
                                        </TableHeaderCell>
                                        <TableHeaderCell className="text-md font-normal">Example</TableHeaderCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody className="border-t border-intg-bg-4">
                                    {propertiesWithDefinitions?.map((item, index) => {
                                        const propertyValue = event ? event[item.property] : "N/A";

                                        return (
                                            <TableRow className="border-intg-bg-4" key={index}>
                                                <TableCell>{item.property}</TableCell>
                                                <TableCell>{item.propertyType}</TableCell>
                                                <TableCell>{propertyValue}</TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        )}
                    </DialogContent>
                </Dialog>

                {!events?.edges.length && !loadingEventDefinitions ? (
                    <div className="mt-40 flex flex-col items-center justify-center text-center">
                        <CursorIconLg />
                        <Header title="No events yet" description="We couldn't find any event." variant="2" />
                    </div>
                ) : null}

                {loadingEventDefinitions && !isFetchingMore ? (
                    <div className="mt-40 flex h-full w-full justify-center">
                        <Spinner />
                    </div>
                ) : null}
            </div>
        </section>
    );
};
