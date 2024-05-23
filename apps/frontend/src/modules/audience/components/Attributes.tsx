import { Properties } from "@/types";
import { Spinner } from "@/ui";
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
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { useAudience } from "../hooks/useAudience";

export const Attributes = () => {
    const {
        persons,
        itemsOnPage,
        propertyDefinitions,
        isFetchingMore,
        loadingPropertyDefinitions,
        getMorePropertyDefinitions,
    } = useAudience();

    const [page, setPage] = useState<number>(1);
    const attributesStartIndex = (page - 1) * itemsOnPage + 1;
    const attributesEndIndex = Math.min(page * itemsOnPage, propertyDefinitions?.totalCount ?? 0);

    const parsedPersonProperties = persons?.edges[0] && (JSON.parse(persons?.edges[0].node.attributes) as Properties);

    const handleGetMorePropertyDefinitions = (direction: string) => {
        if (direction === "forward") {
            setPage((prevPage) => prevPage + 1);
        } else {
            setPage((prevPage) => prevPage - 1);
        }

        getMorePropertyDefinitions(direction);
    };

    return (
        <>
            <Table
                className={cn(
                    propertyDefinitions?.edges.length ? "border" : "",
                    "scrollbar-hide mt-4 table-auto rounded-t-lg  border-intg-bg-4 text-intg-text",
                )}
            >
                <TableHead className="bg-intg-bg-9 font-light hover:cursor-pointer">
                    <TableRow>
                        <TableHeaderCell className="w-1/2">Property Name</TableHeaderCell>
                        <TableHeaderCell className="text-md flex items-center space-x-1 font-normal">
                            Type
                        </TableHeaderCell>
                        <TableHeaderCell className="text-md font-normal">Example</TableHeaderCell>
                    </TableRow>
                </TableHead>
                <TableBody className="border border-intg-bg-4">
                    {propertyDefinitions &&
                        propertyDefinitions.edges.map((p) => {
                            const propertyValue = parsedPersonProperties ? parsedPersonProperties[p.node.name] : "N/A";

                            return (
                                <TableRow key={p.node.name} className="border border-intg-bg-4">
                                    <TableCell>{p.node.name}</TableCell>
                                    <TableCell>{p.node.propertyType}</TableCell>
                                    <TableCell>{propertyValue ?? "N/A"}</TableCell>
                                </TableRow>
                            );
                        })}
                </TableBody>
                {!propertyDefinitions?.edges.length ? null : (
                    <TableFoot className="table-footer-group h-[50px] border-t border-intg-bg-4">
                        <TableFooterCell className="table-cell px-4 py-4">
                            <div className="flex gap-10">
                                <button
                                    disabled={!propertyDefinitions?.pageInfo?.hasPreviousPage || isFetchingMore}
                                    onClick={() => handleGetMorePropertyDefinitions("backward")}
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
                                    disabled={!propertyDefinitions?.pageInfo?.hasNextPage || isFetchingMore}
                                    onClick={() => handleGetMorePropertyDefinitions("forward")}
                                    className={`${
                                        !propertyDefinitions?.pageInfo?.hasNextPage || isFetchingMore
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
                                    {attributesStartIndex} - {attributesEndIndex} of {propertyDefinitions?.totalCount}
                                    Attributes
                                </span>
                            </div>
                        </TableFooterCell>
                    </TableFoot>
                )}
            </Table>
            {!propertyDefinitions?.edges.length && !loadingPropertyDefinitions ? (
                <div className="mt-40 flex h-full w-full text-intg-text">
                    <div className=" m-auto flex-col text-center">
                        <div className=" flex justify-center">
                            <PeopleIconLg />
                        </div>
                        <p className="text-2xl font-semibold">No attributes yet</p>
                        <p className="text-sm">We couldn't find any attributes</p>
                    </div>
                </div>
            ) : null}
            {loadingPropertyDefinitions && !isFetchingMore ? (
                <div className="mt-40 flex h-full w-full text-intg-text">
                    <div className=" m-auto flex-col text-center">
                        <Spinner />
                    </div>
                </div>
            ) : null}
        </>
    );
};
