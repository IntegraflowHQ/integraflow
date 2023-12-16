import { Dialog, DialogContent, DialogTrigger } from "@/ui";
import {
    Badge,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeaderCell,
    TableRow,
} from "@tremor/react";
import { format } from "date-fns";
import { Archive, PencilLine, Radio } from "lucide-react";
import SurveyCreate from "./SurveyCreate";
import CreateSurveyButton from "./partials/CreateSurveyButton";

interface SurveyListData {
    id: string;
    name: string;
    responses: number;
    createdAt: string;
    creatorEmail: string;
    creatorFullName: string;
    status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
}

const headers = [
    { id: crypto.randomUUID(), title: "Name" },
    { id: crypto.randomUUID(), title: "Status" },
    { id: crypto.randomUUID(), title: "Creator" },
    { id: crypto.randomUUID(), title: "Created" },
    { id: crypto.randomUUID(), title: "Response" },
];

const surveyListData: SurveyListData[] = [
    {
        id: crypto.randomUUID(),
        name: "Product Feedback",
        status: "DRAFT",
        responses: 0,
        createdAt: "2021-09-30",
        creatorEmail: "kman@oni.com",
        creatorFullName: "Kolapo Oni",
    },
    {
        id: crypto.randomUUID(),
        name: "Replit Transformers",
        status: "ARCHIVED",
        responses: 0,
        createdAt: "2021-09-30",
        creatorEmail: "helsing@outlook.com",
        creatorFullName: "Van Helsing",
    },
    {
        id: crypto.randomUUID(),
        name: "Customer Satisfaction Survey",
        status: "DRAFT",
        responses: 0,
        createdAt: "2021-09-30",
        creatorEmail: "customer@survey.com",
        creatorFullName: "Customer Service Team",
    },
    {
        id: crypto.randomUUID(),
        name: "Marketing Campaign Feedback",
        status: "PUBLISHED",
        responses: 235,
        createdAt: "2021-09-30",
        creatorEmail: "marketing@company.com",
        creatorFullName: "Marketing Team",
    },
    {
        id: crypto.randomUUID(),
        name: "Employee Engagement Survey",
        status: "ARCHIVED",
        responses: 102,
        createdAt: "2021-09-30",
        creatorEmail: "hr@company.com",
        creatorFullName: "HR Department",
    },
    {
        id: crypto.randomUUID(),
        name: "Product Usage Feedback",
        status: "PUBLISHED",
        responses: 54,
        createdAt: "2021-09-30",
        creatorEmail: "product@feedback.com",
        creatorFullName: "Product Management Team",
    },
];

export const SurveyList = () => {
    return (
        <div className="h-full w-full px-6 py-4 text-white">
            <div className="flex justify-between">
                <p className="py-2 text-xl font-normal">Surveys</p>

                <Dialog>
                    <DialogTrigger asChild>
                        <div>
                            <CreateSurveyButton />
                        </div>
                    </DialogTrigger>
                    <DialogContent
                        title="Create new survey"
                        description="Pick a method that suits you best"
                    >
                        <SurveyCreate className="h-[357px] w-[762px] pt-8" />
                    </DialogContent>
                </Dialog>
            </div>

            <div className="mt-8  flex flex-col">
                <Table className="table-auto rounded-md border border-intg-bg-7">
                    <TableHead className="border-b border-intg-bg-7 bg-intg-bg-1 hover:cursor-pointer ">
                        <TableRow>
                            {headers.map(({ title, id }) => {
                                return (
                                    <TableHeaderCell
                                        className="text-md font-normal"
                                        key={id}
                                    >
                                        {title}
                                    </TableHeaderCell>
                                );
                            })}
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {surveyListData.map((survey) => {
                            return (
                                <TableRow
                                    key={survey.id}
                                    className="border-intg-bg-7 text-center transition-all duration-300 ease-in hover:cursor-pointer hover:bg-intg-bg-1"
                                >
                                    <TableCell>{survey.name}</TableCell>
                                    <TableCell>
                                        <Badge
                                            className={`${
                                                survey.status === "PUBLISHED"
                                                    ? "border border-green-700 bg-green-300/[.05] text-green-800"
                                                    : survey.status === "DRAFT"
                                                    ? "border border-blue-700 bg-blue-300/[.05] text-blue-800"
                                                    : "border border-yellow-700 bg-yellow-300/[.05] text-yellow-800"
                                            } rounded-2xl`}
                                            icon={
                                                survey.status === "DRAFT"
                                                    ? PencilLine
                                                    : survey.status ===
                                                      "ARCHIVED"
                                                    ? Archive
                                                    : Radio
                                            }
                                        >
                                            <span className="text-[12px]">
                                                {survey.status}
                                            </span>
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        {survey.creatorFullName}
                                        <br />
                                        <span className="text-sm text-intg-text-4">
                                            {survey.creatorEmail}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        {format(
                                            new Date(survey.createdAt),
                                            "MMM dd, yyyy",
                                        )}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {survey.responses}
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};
