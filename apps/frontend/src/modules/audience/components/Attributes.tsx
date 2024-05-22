import { useProject } from "@/modules/projects/hooks/useProject";
import { Properties } from "@/types";
import PeopleIconLg from "@/ui/icons/PeopleIconLg";
import { Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from "@tremor/react";
import { useAudience } from "../hooks/useAudience";

export const Attributes = () => {
    const { persons } = useAudience();

    const { propertyDefinitions } = useProject();
    const parsedPersonProperties = persons?.edges[0] && (JSON.parse(persons?.edges[0].node.attributes) as Properties);

    return (
        <>
            <Table className="scrollbar-hide mt-4 table-auto rounded-t-lg text-intg-text">
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
                    {propertyDefinitions.map((p) => {
                        const propertyValue = parsedPersonProperties ? parsedPersonProperties[p.name] : "N/A";

                        return (
                            <TableRow key={p.name} className="border border-intg-bg-4">
                                <TableCell>{p.name}</TableCell>
                                <TableCell>{p.propertyType}</TableCell>
                                <TableCell>{propertyValue ?? "N/A"}</TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
            {!persons?.edges.length ? (
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
        </>
    );
};
