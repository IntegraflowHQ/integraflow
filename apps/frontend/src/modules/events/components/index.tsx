import { EventDefinitionCountableEdge, useEventsLazyQuery } from "@/generated/graphql";
import { Properties } from "@/types";
import { Dialog, DialogContent, DialogTrigger, Header, Spinner } from "@/ui";
import { QuestionIcon } from "@/ui/icons";
import { CursorIconLg } from "@/ui/icons/CursorIconLg";
import { cn } from "@/utils";
import { Icon, Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from "@tremor/react";
import { format } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
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
        eventDefinitionsOnPage,
        getMoreEventDefinitions,
    } = useEvents();

    const [page, setPage] = useState<number>(1);
    const eventsDefinitionsStartIndex = (page - 1) * eventDefinitionsOnPage + 1;
    const eventsDefinitionsEndIndex = Math.min(page * eventDefinitionsOnPage, eventDefinitions?.totalCount ?? 0);

    const [getEvents, { data: singleEvent, loading: eventLoading }] = useEventsLazyQuery();

    const event =
        singleEvent?.events?.edges[0].node.properties &&
        (JSON.parse(singleEvent?.events?.edges[0].node.properties) as Properties);

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

    const handleGetMoreEventsDefinitions = (direction: string) => {
        if (direction === "forward") {
            setPage((prevPage) => prevPage + 1);
        } else {
            setPage((prevPage) => prevPage - 1);
        }

        getMoreEventDefinitions(direction);
    };

    return (
        <section className="px-[72px] pb-20 pt-20">
            <Header title="Events" description="The events that you have sent" />
            <div className="mt-4 h-full w-full">
                <h3 className="font-semibold text-intg-text"></h3>

                <div className="text-intg-text">
                    <Table
                        className={cn(
                            eventDefinitions?.edges.length ? "border" : "",
                            "scrollbar-hide table-auto rounded-t-lg border-intg-bg-4",
                        )}
                    >
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
                                        <TableHeaderCell className="w-1/2">Property Name</TableHeaderCell>
                                        <TableHeaderCell className="text-md flex items-center space-x-1 font-normal">
                                            Type
                                        </TableHeaderCell>
                                        <TableHeaderCell className="text-md font-normal">Example</TableHeaderCell>
                                    </TableHead>
                                    <TableBody className="border-t border-intg-bg-4">
                                        {propertiesWithDefinitions?.map((item) => {
                                            const propertyValue = event ? event[item.property] : "N/A";

                                            return (
                                                <TableRow className="border-intg-bg-4">
                                                    <TableCell>{item.property}</TableCell>
                                                    <TableCell>{item.propertyType}</TableCell>
                                                    <TableCell>{propertyValue ?? "N/A"}</TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            )}
                        </DialogContent>
                    </Dialog>
                </div>

                {!eventDefinitions?.edges.length ? null : (
                    <div className="h-[50px] border border-intg-bg-4">
                        <div className="px-4 py-4">
                            <div className="flex gap-10">
                                <button
                                    disabled={!eventDefinitions?.pageInfo?.hasPreviousPage || isFetchingMore}
                                    onClick={() => handleGetMoreEventsDefinitions("backward")}
                                    className={`${
                                        !eventDefinitions?.pageInfo?.hasPreviousPage
                                            ? "cursor-not-allowed opacity-50"
                                            : ""
                                    } hover:bg-intg-bg-8} rounded-md border border-intg-bg-4 transition-all duration-300 ease-in`}
                                >
                                    <Icon
                                        size="md"
                                        icon={ChevronLeft}
                                        className="font-normal text-intg-text-4 hover:cursor-pointer"
                                    />
                                </button>

                                <button
                                    disabled={!eventDefinitions?.pageInfo?.hasNextPage || isFetchingMore}
                                    onClick={() => handleGetMoreEventsDefinitions("forward")}
                                    className={`${
                                        !eventDefinitions?.pageInfo?.hasNextPage || isFetchingMore
                                            ? "cursor-not-allowed opacity-50"
                                            : ""
                                    } rounded-md border border-intg-bg-4  transition-all duration-300 ease-in hover:bg-intg-bg-8`}
                                >
                                    <Icon
                                        size="md"
                                        icon={ChevronRight}
                                        className="font-normal text-intg-text-4 hover:cursor-pointer"
                                    />
                                </button>
                            </div>
                        </div>
                        <div className="table-cell whitespace-nowrap px-4 py-4 text-sm font-normal text-intg-text-4">
                            <div className="flex gap-10">
                                <span>Rows per page: {eventDefinitionsOnPage}</span>
                                <span>
                                    {eventsDefinitionsStartIndex} - {eventsDefinitionsEndIndex} of
                                    {eventDefinitions?.totalCount} events
                                </span>
                            </div>
                        </div>
                    </div>
                )}
                {!events?.edges.length && !loadingEventDefinitions ? (
                    <div className="mt-40 flex h-full w-full text-intg-text">
                        <div className=" m-auto flex-col text-center">
                            <div className=" flex justify-center">
                                <CursorIconLg />
                            </div>
                            <p className="text-2xl font-semibold">No events yet</p>
                            <p className="text-sm">We couldn't find any events</p>
                        </div>
                    </div>
                ) : null}

                {loadingEventDefinitions && !isFetchingMore ? (
                    <div className="mt-40 flex h-full w-full text-intg-text">
                        <div className=" m-auto flex-col text-center">
                            <Spinner />
                        </div>
                    </div>
                ) : null}
            </div>
        </section>
    );
};
