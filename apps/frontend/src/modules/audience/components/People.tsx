import { PersonCountableEdge } from "@/generated/graphql";
import { Properties } from "@/types";
import { Dialog, DialogContent, Pagination, Spinner } from "@/ui";
import PeopleIconLg from "@/ui/icons/PeopleIconLg";
import { cn } from "@/utils";
import { Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from "@tremor/react";
import { format } from "date-fns";
import { Fragment, useState } from "react";
import { useAudience } from "../hooks/useAudience";

export const People = () => {
    const { persons, isFetchingMore, getMorePersons, loadingPersons } = useAudience();
    const [selectedPerson, setSelectedPerson] = useState<PersonCountableEdge | null>(null);

    const parsedPersonProperties = selectedPerson && (JSON.parse(selectedPerson?.node.attributes) as Properties);

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
                                                <strong className="w-max self-center rounded bg-intg-bg-22 px-1.5 py-1 text-xs font-normal capitalize leading-[18px] text-intg-text-13">
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
                                    className="cursor-pointer  border-intg-bg-4 text-center font-light transition-all duration-300 ease-in"
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
            </Table>
            {persons?.edges.length ? (
                <Pagination
                    hasNextPage={persons?.pageInfo.hasNextPage as boolean}
                    hasPrevPage={persons?.pageInfo.hasPreviousPage as boolean}
                    itemName="users"
                    nextPageFn={() => getMorePersons("forward")}
                    prevPageFn={() => getMorePersons("backward")}
                    totalCount={persons?.totalCount as number}
                    className="border border-t-0 border-intg-bg-4 p-4"
                />
            ) : null}

            {!loadingPersons && !persons?.edges.length ? (
                <div className="mt-40 flex h-full w-full text-intg-text">
                    <div className=" m-auto flex-col text-center">
                        <div className=" flex justify-center">
                            <PeopleIconLg />
                        </div>
                        <p className="text-2xl font-semibold">No persons yet</p>
                        <p className="text-sm">We couldn't find any persons</p>
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
