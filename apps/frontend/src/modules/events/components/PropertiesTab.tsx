import { QuestionIcon } from "@/ui/icons";
import { Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from "@tremor/react";

const headers = [
    { id: crypto.randomUUID(), title: "Event Name" },
    { id: crypto.randomUUID(), title: "Count" },
    { id: crypto.randomUUID(), title: "Last Seen" },
];

export const PropertiesTab = () => {
    return (
        <div className="text-intg-text">
            <div className="text-intg-text">
                <Table className="scrollbar-hide table-auto rounded-t-lg bg-intg-bg-9">
                    <TableHead className=" font-light hover:cursor-pointer ">
                        <TableRow>
                            {headers.map(({ title, id }) => {
                                return (
                                    <TableHeaderCell className="text-md font-normal" key={id}>
                                        {title === "Count" ? (
                                            <p className="flex items-center space-x-1">
                                                <span>Count</span>
                                                <span>
                                                    <QuestionIcon />
                                                </span>
                                            </p>
                                        ) : (
                                            title
                                        )}
                                    </TableHeaderCell>
                                );
                            })}
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        <TableRow className="border-intg-bg-4 text-center font-light transition-all duration-300 ease-in">
                            <TableCell>hello</TableCell>
                            <TableCell>hello</TableCell>
                            <TableCell>hello</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};
