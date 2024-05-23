import { PersonCountableEdge } from "@/generated/graphql";
import { Properties } from "@/types";
import { Dialog, DialogContent, Spinner } from "@/ui";
import PeopleIconLg from "@/ui/icons/PeopleIconLg";
import { cn } from "@/utils";
import {
    Icon,
    Table,
    TableBody,
    TableCell,
    TableFoot,
    TableFooterCell,
    TableHead,
    TableHeaderCell,
    TableRow,
} from "@tremor/react";
import { format } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Fragment, useState } from "react";
import { useAudience } from "../hooks/useAudience";

export const People = () => {
    const [page, setPage] = useState<number>(1);

    const { persons, isFetchingMore, getMorePersons, loadingPersons, itemsOnPage } = useAudience();
    console.log(persons);

    const personsStartIndex = (page - 1) * itemsOnPage + 1;
    const personsEndIndex = Math.min(page * itemsOnPage, persons?.totalCount ?? 0);

    const [selectedPerson, setSelectedPerson] = useState<PersonCountableEdge | null>(null);

    const parsedPersonProperties = selectedPerson && (JSON.parse(selectedPerson?.node.attributes) as Properties);

    const handleGetMorePersons = (direction: string) => {
        if (direction === "forward") {
            setPage((prevPage) => prevPage + 1);
        } else {
            setPage((prevPage) => prevPage - 1);
        }

        getMorePersons(direction);
    };

    return (
        <>
            <Dialog
                open={selectedPerson !== null}
                onOpenChange={(open) => {
                    if (!open) {
                        setSelectedPerson(null);
                    }
                }}
            >
                <DialogContent className="p-6">
                    {0 ? (
                        <Spinner />
                    ) : (
                        <>
                            {Object.entries(parsedPersonProperties ?? {}).length < 1 ? (
                                <div className="p-4">No attributes for this user</div>
                            ) : (
                                <div className="space-y-6 p-3">
                                    <h3>User Properties</h3>
                                    <div className="grid min-w-80 grid-cols-[max-content,1fr] gap-x-20 gap-y-2 -tracking-[0.41px]">
                                        {Object.entries(parsedPersonProperties ?? {}).map(([key, val]) => (
                                            <Fragment key={key}>
                                                <strong className="text-intg-text-13 w-max self-center rounded bg-intg-bg-22 px-1.5 py-1 text-xs font-normal capitalize leading-[18px]">
                                                    {key}
                                                </strong>

                                                <span className="self-center text-sm font-normal text-intg-text-2">
                                                    {val.toString()}
                                                </span>
                                            </Fragment>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </DialogContent>
            </Dialog>

            <Table
                className={cn(
                    persons?.edges.length ? "border" : "",
                    "scrollbar-hide table-auto rounded-t-lg border-intg-bg-4 text-intg-text",
                )}
            >
                <TableHead className="w-full bg-intg-bg-9 font-light hover:cursor-pointer">
                    <TableHeaderCell className="w-1/2">User</TableHeaderCell>

                    <TableHeaderCell className="text-md font-normal">First Seen</TableHeaderCell>
                </TableHead>
                {persons?.edges.length ? (
                    <TableBody>
                        {persons?.edges.map((person) => {
                            const parsedPerson = JSON.parse(person?.node.attributes) as Properties;
                            const {
                                name,
                                id,
                                first_name: firstName,
                                last_name: lastName,
                                email,
                                user_id: userId,
                            } = parsedPerson;

                            return (
                                <TableRow
                                    key={person.node.id}
                                    className="cursor-pointer border border-intg-bg-4 text-center font-light transition-all duration-300 ease-in"
                                    onClick={() => {
                                        setSelectedPerson(person as PersonCountableEdge);
                                    }}
                                >
                                    <TableCell>
                                        {name || firstName || lastName || email || userId || id || person.node.id}
                                    </TableCell>
                                    <TableCell>
                                        {format(new Date(person.node.createdAt ?? ""), "MMM dd, yyyy")}
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                ) : null}

                {persons?.edges.length ? (
                    <TableFoot className="table-footer-group h-[50px] border-t border-intg-bg-4">
                        <TableFooterCell className="table-cell px-4 py-4">
                            <div className="flex gap-10">
                                <button
                                    disabled={!persons?.pageInfo?.hasPreviousPage || isFetchingMore}
                                    onClick={() => handleGetMorePersons("backward")}
                                    className={`${
                                        !persons?.pageInfo?.hasPreviousPage || isFetchingMore
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
                                    disabled={!persons?.pageInfo?.hasNextPage || isFetchingMore}
                                    onClick={() => handleGetMorePersons("forward")}
                                    className={`${
                                        !persons?.pageInfo?.hasNextPage || isFetchingMore
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
                        </TableFooterCell>

                        <TableFooterCell className="table-cell whitespace-nowrap px-4 py-4 text-sm font-normal text-intg-text-4">
                            <div className="flex gap-10">
                                <span>Rows per page: {itemsOnPage}</span>
                                <span>
                                    {personsStartIndex} - {personsEndIndex} of {persons?.totalCount} Surveys
                                </span>
                            </div>
                        </TableFooterCell>
                    </TableFoot>
                ) : null}
            </Table>

            {!loadingPersons && !persons?.edges.length ? (
                <div className="mt-40 flex h-full w-full text-intg-text">
                    <div className=" m-auto flex-col text-center">
                        <div className=" flex justify-center">
                            <PeopleIconLg />
                        </div>
                        <p className="text-2xl font-semibold">No events yet</p>
                        <p className="text-sm">We couldn't find any events</p>
                    </div>
                </div>
            ) : null}
            {loadingPersons && !isFetchingMore ? (
                <div className="mt-40 flex h-full w-full text-intg-text">
                    <div className=" m-auto flex-col text-center">
                        <Spinner />
                    </div>
                </div>
            ) : null}
        </>
    );
};
