import { Properties } from "@/types";
import { Header, Pagination, Spinner } from "@/ui";
import PeopleIconLg from "@/ui/icons/PeopleIconLg";
import { cn } from "@/utils";
import { Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from "@tremor/react";
import { useAudience } from "../hooks/useAudience";

export const Attributes = () => {
    const { persons, propertyDefinitions, isFetchingMore, loadingPropertyDefinitions, getMorePropertyDefinitions } =
        useAudience();

    const parsedPersonProperties = persons?.edges[0] && (JSON.parse(persons?.edges[0].node.attributes) as Properties);

    return (
        <>
            <Table
                className={cn(
                    propertyDefinitions?.edges.length ? "border" : "",
                    "scrollbar-hide mt-4 table-auto rounded-t-lg  border-intg-bg-4 text-white",
                )}
            >
                <TableHead className="bg-intg-bg-9 font-light text-intg-text">
                    <TableRow>
                        <TableHeaderCell className="w-1/2">Property Name</TableHeaderCell>
                        <TableHeaderCell className="text-md flex items-center space-x-1 font-normal">
                            Type
                        </TableHeaderCell>
                        <TableHeaderCell className="text-md font-normal">Example</TableHeaderCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {propertyDefinitions &&
                        propertyDefinitions.edges.map((p) => {
                            const propertyValue = parsedPersonProperties ? parsedPersonProperties[p.node.name] : "N/A";

                            return (
                                <TableRow key={p.node.name} className=" border-intg-bg-4">
                                    <TableCell>{p.node.name}</TableCell>
                                    <TableCell>{p.node.propertyType}</TableCell>
                                    <TableCell>{propertyValue ?? "N/A"}</TableCell>
                                </TableRow>
                            );
                        })}
                </TableBody>
            </Table>

            {!propertyDefinitions?.edges.length ? null : (
                <Pagination
                    hasNextPage={propertyDefinitions?.pageInfo.hasNextPage as boolean}
                    hasPrevPage={propertyDefinitions?.pageInfo.hasPreviousPage as boolean}
                    itemName="attributes"
                    nextPageFn={() => getMorePropertyDefinitions("forward")}
                    prevPageFn={() => getMorePropertyDefinitions("backward")}
                    totalCount={propertyDefinitions?.totalCount as number}
                    className="border border-t-0 border-intg-bg-4 p-4"
                />
            )}

            {!propertyDefinitions?.edges.length && !loadingPropertyDefinitions ? (
                <div className="mt-40 flex flex-col items-center justify-center text-center">
                    <PeopleIconLg />
                    <Header title="No attributes yet" description="We couldn't find any attribute." variant="2" />
                </div>
            ) : null}

            {loadingPropertyDefinitions && !isFetchingMore ? (
                <div className="mt-40 flex h-full w-full justify-center">
                    <Spinner />
                </div>
            ) : null}
        </>
    );
};
