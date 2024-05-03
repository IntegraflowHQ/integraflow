import { useProject } from "@/modules/projects/hooks/useProject";
import { Dialog, DialogContent, DialogTrigger } from "@/ui";
import { QuestionIcon } from "@/ui/icons";
import PeopleIconLg from "@/ui/icons/PeopleIconLg";
import { Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from "@tremor/react";
import { format } from "date-fns";

export const EventsTab = () => {
    const { eventDefinitions } = useProject();
    console.log(eventDefinitions);

    return (
        <div className="text-intg-text">
            <Table className="scrollbar-hide table-auto rounded-t-lg">
                <TableHead className=" bg-intg-bg-9 font-light hover:cursor-pointer">
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
                    {eventDefinitions.length ? (
                        eventDefinitions.map((event) => {
                            return (
                                <>
                                    <Dialog>
                                        <DialogTrigger>
                                            <TableRow className="cursor-pointer border-l border-r border-intg-bg-4 text-center font-light transition-all duration-300 ease-in">
                                                <TableCell>{event.name}</TableCell>
                                                <TableCell>
                                                    {format(new Date(event.lastSeenAt ?? ""), "MMM dd, yyyy")}
                                                </TableCell>
                                                <TableCell>
                                                    {format(new Date(event.lastSeenAt ?? ""), "MMM dd, yyyy")}
                                                </TableCell>
                                            </TableRow>
                                        </DialogTrigger>
                                        <DialogContent>
                                            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nesciunt ex ipsa,
                                            beatae non recusandae voluptates nisi nihil esse exercitationem iste
                                            cupiditate dolore delectus, quae, amet quo provident magnam quibusdam
                                            praesentium.
                                        </DialogContent>
                                    </Dialog>
                                </>
                            );
                        })
                    ) : (
                        <div className="mt-48 flex h-full w-full justify-center">
                            <div className=" flex flex-col gap-2">
                                <PeopleIconLg />
                                <p className="text-2xl font-semibold">No users yet</p>
                                <p className="text-sm">We couldn't find any user</p>
                            </div>
                        </div>
                    )}
                </TableBody>
            </Table>
        </div>
    );
};
