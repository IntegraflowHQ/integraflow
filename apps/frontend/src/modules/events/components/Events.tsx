import { useEventsQuery } from "@/generated/graphql";
import { useProject } from "@/modules/projects/hooks/useProject";
import { Dialog, DialogContent, DialogTrigger, Header } from "@/ui";
import { QuestionIcon } from "@/ui/icons";
import PeopleIconLg from "@/ui/icons/PeopleIconLg";
import { Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from "@tremor/react";
import { format } from "date-fns";

export const Events = () => {
    const { eventDefinitions } = useProject();
    const { data: events, loading } = useEventsQuery();
    console.log(events);

    return (
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
                <TableBody className="border-b border-intg-bg-4">
                    {events?.events?.edges.length ? (
                        events.events.edges.map((event) => {
                            return (
                                <Dialog key={event.node.id}>
                                    <DialogTrigger>
                                        <TableRow className="cursor-pointer border-l border-r border-intg-bg-4 text-center font-light transition-all duration-300 ease-in">
                                            <TableCell>{event.node.event}</TableCell>
                                            <TableCell>
                                                {format(new Date(event.node.createdAt ?? ""), "MMM dd, yyyy")}
                                            </TableCell>
                                            <TableCell>
                                                {format(new Date(event.node.timestamp ?? ""), "MMM dd, yyyy")}
                                            </TableCell>
                                        </TableRow>
                                    </DialogTrigger>
                                    <DialogContent className="p-6">
                                        <div className="mt-4 flex w-96 flex-col gap-[21px] rounded bg-intg-bg-15 p-3.5">
                                            <Header
                                                title="User details"
                                                variant="3"
                                                className="[&>*]:text-intg-text-11"
                                            />

                                            <div className="grid grid-cols-[max-content,1fr] gap-x-3.5 gap-y-2 -tracking-[0.41px]">
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
                            );
                        })
                    ) : (
                        <div className="mt-48 flex h-full w-full justify-center">
                            <div className=" flex flex-col gap-2">
                                <PeopleIconLg />
                                <p className="text-2xl font-semibold">No events yet</p>
                                <p className="text-sm">We couldn't find any user</p>
                            </div>
                        </div>
                    )}
                </TableBody>
            </Table>
        </div>
    );
};
