import { Attribute } from "@/components/Attribute";
import { EventDefinitionCountableEdge, useEventsLazyQuery } from "@/generated/graphql";
import { Properties } from "@/types";
import { ContainerWithTooltip, Dialog, DialogContent, DialogTrigger, Header, Pagination, Spinner } from "@/ui";
import { QuestionIcon } from "@/ui/icons";
import { CursorIconLg } from "@/ui/icons/CursorIconLg";
import { cn, isoTimestampRegex } from "@/utils";
import { Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from "@tremor/react";
import { format } from "date-fns";
import { useState } from "react";
import { useEvents } from "../hooks/useEvents";

export const EventsIndex = () => {
    const [selectedEvent, setSelectedEvent] = useState<EventDefinitionCountableEdge | null>(null);

    const {
        eventDefinitions,
        getPropertiesWithDefinitions,
        isFetchingMore,
        propertiesWithDefinitions,
        loadingProperties,
        loadingEventDefinitions,
        getMoreEventDefinitions,
    } = useEvents();

    const [getEvents, { data: singleEvent, loading: eventLoading }] = useEventsLazyQuery({
        fetchPolicy: "cache-and-network",
    });

    const event: Properties | null =
        singleEvent?.events?.edges.length && singleEvent?.events?.edges[0].node?.properties
            ? (JSON.parse(singleEvent?.events?.edges[0].node.properties) as Properties)
            : null;

    const handleEventDetails = async (event: EventDefinitionCountableEdge) => {
        getPropertiesWithDefinitions(event.node.name);
        await getEvents({
            variables: {
                first: 1,
                filter: {
                    event: event.node.name,
                },
            },
        });
    };

    return (
        <section className="px-6 py-4 text-white">
            <Header title="Events" description="The events that you have received." />
            <div className="mt-4 h-full w-full">
                <div>
                    <Table
                        className={cn(
                            eventDefinitions?.edges.length ? "border" : "",
                            loadingEventDefinitions || isFetchingMore ? "opacity-70" : "",
                            "scrollbar-hide bg-red relative table-auto rounded-t-lg border-intg-bg-4",
                        )}
                    >
                        <TableHead className="border-b border-intg-bg-4 bg-intg-bg-8 font-light text-intg-text">
                            <TableRow>
                                <TableHeaderCell className="text-md font-normal">Event Name</TableHeaderCell>
                                <TableHeaderCell className="text-md flex items-center space-x-1 font-normal">
                                    <span>Count</span>
                                    <ContainerWithTooltip text="This is the number of times an event has been done.">
                                        <QuestionIcon />
                                    </ContainerWithTooltip>
                                </TableHeaderCell>
                                <TableHeaderCell className="text-md font-normal">Last Seen</TableHeaderCell>
                            </TableRow>
                        </TableHead>

                        {eventDefinitions?.edges.length ? (
                            <TableBody className="relative">
                                {loadingEventDefinitions || isFetchingMore ? (
                                    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                                        <Spinner size="md" removeLogo />
                                    </div>
                                ) : null}

                                {(eventDefinitions?.edges || []).map((event) => {
                                    return (
                                        <TableRow
                                            key={event.node.id}
                                            className="border-intg-bg-4 text-center font-light transition-all duration-300 ease-in hover:cursor-pointer hover:bg-intg-bg-8"
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
                        ) : null}
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
                    <DialogContent title="Event properties" className="min-h-[15rem] min-w-[25rem] space-y-4 p-6">
                        {eventLoading || loadingProperties ? (
                            <div className="flex h-[15rem] items-center justify-center">
                                <Spinner removeLogo size="md" />
                            </div>
                        ) : (
                            <div className="grid min-w-80  gap-x-20 gap-y-2  -tracking-[0.41px]">
                                {propertiesWithDefinitions?.map((item) => {
                                    let propertyValue = event ? event[item.property] : "N/A";

                                    return (
                                        <Attribute
                                            name={item.property}
                                            value={
                                                isoTimestampRegex.test(propertyValue as string)
                                                    ? format(
                                                          new Date((propertyValue as string) ?? ""),
                                                          "MMM dd, yyyy, HH:mm",
                                                      )
                                                    : propertyValue
                                            }
                                            type={item.propertyType}
                                            key={item.property}
                                        />
                                    );
                                })}
                            </div>
                        )}
                    </DialogContent>
                </Dialog>

                {!eventDefinitions?.edges.length && !loadingEventDefinitions ? (
                    <div className="mt-40 flex flex-col items-center justify-center text-center">
                        <CursorIconLg />
                        <Header title="No events yet" description="We couldn't find any event." variant="2" />
                    </div>
                ) : null}

                {(loadingEventDefinitions || isFetchingMore) && !eventDefinitions?.edges.length && (
                    <div className="mt-40 flex flex-col items-center justify-center text-center">
                        <Spinner />
                    </div>
                )}
            </div>
        </section>
    );
};
