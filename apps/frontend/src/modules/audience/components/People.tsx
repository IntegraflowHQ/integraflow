import { Attribute } from "@/components/Attribute";
import { PersonCountableEdge } from "@/generated/graphql";
import { Properties } from "@/types";
import { Dialog, DialogContent, Header, Pagination, Spinner } from "@/ui";
import PeopleIconLg from "@/ui/icons/PeopleIconLg";
import { cn, isoTimestampRegex } from "@/utils";
import { Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from "@tremor/react";
import { format } from "date-fns";
import { useState } from "react";
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
                <DialogContent className="min-h-[15rem] min-w-[25rem] max-w-xl p-6">
                    <div className="mt-4 space-y-6 rounded bg-intg-bg-15 px-6 py-[14px]">
                        <Header variant="3" title="User details" />
                        {Object.entries(parsedPersonProperties ?? {}).length < 1 ? (
                            <div className="flex h-[10rem] items-center justify-center">
                                <p className="-mt-8">No attributes for this user</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <div className="grid min-w-80 gap-x-20 gap-y-2 -tracking-[0.41px]">
                                    {Object.entries(parsedPersonProperties ?? {}).map(([key, val]) => {
                                        return (
                                            <Attribute
                                                name={key}
                                                value={
                                                    isoTimestampRegex.test(val as string)
                                                        ? format(new Date((val as string) ?? ""), "MMM dd, yyyy, HH:mm")
                                                        : val
                                                }
                                                key={key}
                                                wrapText
                                            />
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>

            <Table
                className={cn(
                    persons?.edges.length ? "border" : "",
                    loadingPersons || isFetchingMore ? "opacity-70" : "",
                    "scrollbar-hide table-auto rounded-t-lg border-intg-bg-4 text-white",
                )}
            >
                <TableHead className="border-b border-intg-bg-4 bg-intg-bg-8 font-light text-intg-text">
                    <TableRow>
                        <TableHeaderCell className="text-md w-1/2 font-normal">User</TableHeaderCell>
                        <TableHeaderCell className="text-md font-normal">First Seen</TableHeaderCell>
                    </TableRow>
                </TableHead>

                {persons?.edges.length ? (
                    <TableBody className="relative">
                        {loadingPersons || isFetchingMore ? (
                            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                                <Spinner size="md" removeLogo />
                            </div>
                        ) : null}
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
                <div className="mt-40 flex flex-col items-center justify-center text-center">
                    <PeopleIconLg />
                    <Header title="No persons yet" description="We couldn't find any person." variant="2" />
                </div>
            ) : null}

            {(loadingPersons || isFetchingMore) && !persons?.edges.length && (
                <div className="mt-40 flex flex-col items-center justify-center text-center">
                    <Spinner />
                </div>
            )}
        </>
    );
};
