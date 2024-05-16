import {
    EventDefinitionCountableEdge,
    useEventDefinitionsQuery,
    useEventsQuery,
    usePropertiesWithDefinitionsLazyQuery,
} from "@/generated/graphql";
import { useProject } from "@/modules/projects/hooks/useProject";
import { Dialog, DialogContent, DialogTrigger, Header, TextInput } from "@/ui";
import { QuestionIcon, Search } from "@/ui/icons";
import PeopleIconLg from "@/ui/icons/PeopleIconLg";
import { Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from "@tremor/react";
import { format } from "date-fns";
import { useState } from "react";

export const EventsIndex = () => {
    const [searchValue, setSearchValue] = useState("");

    const [selectedEvent, setSelectedEvent] = useState<EventDefinitionCountableEdge | null>(null);

    const { data } = useEventDefinitionsQuery();
    const { data: events } = useEventsQuery();
    const { eventDefinitions } = useProject();

    const [getPropertiesWithDefinitions] = usePropertiesWithDefinitionsLazyQuery();

    const filteredEvents = data?.eventDefinitions?.edges.filter((event) =>
        event.node.name.toLowerCase().includes(searchValue.toLowerCase()),
    );

    const handlePropertiesWithEventDefinitions = async (event) => {
        const response = await getPropertiesWithDefinitions({
            variables: { event: event.node.name },
        });
        console.log(response.data);
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
                                                handlePropertiesWithEventDefinitions(event);
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
                            <div className="mt-4 flex w-96 flex-col gap-[21px] rounded bg-intg-bg-15 p-3.5">
                                <Header title="User details" variant="3" className="[&>*]:text-intg-text-11" />

                                <div className="grid grid-cols-[max-content,1fr] gap-x-3.5 gap-y-2 -tracking-[0.41px]">
                                    <strong className="bg-intg-bg-22 text-intg-text-13 w-max rounded px-1.5 py-1 text-xs font-normal capitalize leading-[18px]">
                                        Name
                                    </strong>

                                    <span className="self-center text-sm font-normal text-intg-text-2">
                                        {selectedEvent?.node.name}
                                    </span>
                                    <strong className="bg-intg-bg-22 text-intg-text-13 w-max rounded px-1.5 py-1 text-xs font-normal capitalize leading-[18px]">
                                        Email
                                    </strong>

                                    <span className="self-center text-sm font-normal text-intg-text-2">
                                        fols@gmail.com
                                    </span>
                                    <strong className="bg-intg-bg-22 text-intg-text-13 w-max rounded px-1.5 py-1 text-xs font-normal capitalize leading-[18px]">
                                        Email
                                    </strong>

                                    <span className="self-center text-sm font-normal text-intg-text-2">
                                        fols@gmail.com
                                    </span>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>{" "}
            </div>
        </section>
    );
};
