import { Header, Pagination, Spinner } from "@/ui";
import PeopleIconLg from "@/ui/icons/PeopleIconLg";
import { cn } from "@/utils";
import { Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from "@tremor/react";
import { useAudience } from "../hooks/useAudience";

export const Attributes = () => {
    const { propertyDefinitions, isFetchingMore, loadingPropertyDefinitions, getMorePropertyDefinitions } =
        useAudience();

    return (
        <>
            <Table
                className={cn(
                    propertyDefinitions?.edges.length ? "border" : "",
                    loadingPropertyDefinitions || isFetchingMore ? "opacity-70" : "",
                    "scrollbar-hide table-auto rounded-t-lg border-intg-bg-4 text-white",
                )}
            >
                <TableHead className="border-b border-intg-bg-4 bg-intg-bg-8 font-light text-intg-text">
                    <TableRow>
                        <TableHeaderCell className="text-md w-1/2 font-normal">Property Name</TableHeaderCell>
                        <TableHeaderCell className="text-md  font-normal">Type</TableHeaderCell>
                    </TableRow>
                </TableHead>
                <TableBody className="relative">
                    {loadingPropertyDefinitions || isFetchingMore ? (
                        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                            <Spinner size="md" removeLogo />
                        </div>
                    ) : null}
                    {propertyDefinitions &&
                        propertyDefinitions.edges.map((p) => {
                            return (
                                <TableRow key={p.node.name} className=" border-intg-bg-4">
                                    <TableCell>{p.node.name}</TableCell>
                                    <TableCell>{p.node.propertyType}</TableCell>
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

            {(loadingPropertyDefinitions || isFetchingMore) && !propertyDefinitions?.edges.length && (
                <div className="mt-40 flex flex-col items-center justify-center text-center">
                    <Spinner />
                </div>
            )}
        </>
    );
};
