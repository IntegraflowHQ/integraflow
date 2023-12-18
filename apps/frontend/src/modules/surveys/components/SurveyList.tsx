import { SurveyStatusEnum } from "@/generated/graphql";
import { ROUTES } from "@/routes";
import { Dialog, DialogContent, DialogTrigger } from "@/ui";
import {
    Badge,
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
import { format, formatDistanceToNow, parseISO } from "date-fns";
import {
    Archive,
    CheckCircle,
    ChevronLeft,
    ChevronRight,
    PauseCircle,
    PencilLine,
    Radio,
    RefreshCcw,
} from "lucide-react";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSurveyList } from "../hooks/useSurveyList";
import SurveyCreate from "./SurveyCreate";
import CreateSurveyButton from "./partials/CreateSurveyButton";

interface SurveyListData {
    surveys: {
        id: string;
        slug: string;
        name: string;
        createdAt: string;
        creator: {
            email: string;
            fullName: string;
        };
        status: SurveyStatusEnum;
    }[];
}

const headers = [
    { id: crypto.randomUUID(), title: "Name" },
    { id: crypto.randomUUID(), title: "Status" },
    { id: crypto.randomUUID(), title: "Creator" },
    { id: crypto.randomUUID(), title: "Date Created" },
    { id: crypto.randomUUID(), title: "Responses" },
];

export const SurveyList = () => {
    const navigate = useNavigate();
    const { orgSlug, projectSlug } = useParams();
    const [page, setPage] = React.useState<number>(1);

    const {
        getMoreSurveys,
        surveyList,
        totalSurveys,
        surveysOnPage,
        pageInfo,
    } = useSurveyList();
    // const [nameFilter, setNameFilter] = React.useState<string>("");
    const [currentSurveys, setCurrentSurveys] = React.useState<
        SurveyListData["surveys"]
    >(surveyList || []);

    React.useEffect(() => {
        setCurrentSurveys(surveyList ?? []);
    }, [surveyList]);

    const handleGetMoreSurveys = (direction: string) => {
        if (direction === "forward") {
            setPage((prevPage) => prevPage + 1);
        } else {
            setPage((prevPage) => prevPage - 1);
        }

        getMoreSurveys(direction);
        setCurrentSurveys(surveyList || []);
    };

    const handleGetSurvey = (slug: string) => {
        navigate(
            ROUTES.STUDIO.replace(":orgSlug", orgSlug!)
                .replace(":projectSlug", projectSlug!)
                .replace(":surveySlug", slug),
        );
    };

    const surveyStartIndex = (page - 1) * surveysOnPage + 1;
    const surveyEndIndex = Math.min(
        page * surveysOnPage,
        totalSurveys as number,
    );

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

            <div className="mb-4 mt-8 flex justify-between">
                <input
                    type="text"
                    placeholder="Filter surveys by name"
                    // onChange={(e) => setNameFilter(e.target.value)}
                    className="h-[40px] w-[300px] text-ellipsis rounded-md border border-intg-bg-7 bg-transparent px-4 outline-none placeholder:text-intg-text-4"
                />
            </div>

            <div className="mt-8  flex flex-col">
                <Table className="scrollbar-hide table-auto rounded-md border border-intg-bg-7 ">
                    <TableHead className="border-b border-intg-bg-7 bg-intg-bg-8 font-light hover:cursor-pointer">
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
                        {currentSurveys?.map((survey) => {
                            return (
                                <TableRow
                                    key={survey.id}
                                    onClick={() => handleGetSurvey(survey.slug)}
                                    className="border-intg-bg-7 text-center font-light transition-all duration-300 ease-in hover:cursor-pointer hover:bg-intg-bg-8"
                                >
                                    <TableCell>{survey.name}</TableCell>
                                    <TableCell>
                                        <Badge
                                            className={`${
                                                survey.status ===
                                                SurveyStatusEnum.Active
                                                    ? "border border-green-700 bg-teal-300/[.05] text-teal-800"
                                                    : survey.status ===
                                                      SurveyStatusEnum.Draft
                                                    ? "border border-blue-700 bg-blue-300/[.05] text-blue-800"
                                                    : survey.status ===
                                                      SurveyStatusEnum.InProgress
                                                    ? "border border-teal-700 bg-teal-300/[.05] text-teal-700"
                                                    : survey.status ===
                                                      SurveyStatusEnum.Paused
                                                    ? "border border-gray-700 bg-gray-300/[.05] text-gray-800"
                                                    : survey.status ===
                                                      SurveyStatusEnum.Completed
                                                    ? "border border-purple-700 bg-purple-300/[0.5] text-purple-800"
                                                    : "border border-yellow-700 bg-yellow-300/[.05] text-yellow-800"
                                            } rounded-2xl`}
                                            icon={
                                                survey.status ===
                                                SurveyStatusEnum.Active
                                                    ? Radio
                                                    : survey.status ===
                                                      SurveyStatusEnum.Draft
                                                    ? PencilLine
                                                    : survey.status ===
                                                      SurveyStatusEnum.Completed
                                                    ? CheckCircle
                                                    : survey.status ===
                                                      SurveyStatusEnum.InProgress
                                                    ? RefreshCcw
                                                    : survey.status ===
                                                      SurveyStatusEnum.Paused
                                                    ? PauseCircle
                                                    : Archive
                                            }
                                        >
                                            <span className="text-[12px]">
                                                {survey.status}
                                            </span>
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        {survey?.creator?.fullName}
                                        <br />
                                        <span className="text-[12px] text-intg-text-4">
                                            {survey?.creator.email}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <span className="first-letter:capitalize">
                                            {formatDistanceToNow(
                                                parseISO(survey.createdAt),
                                                {
                                                    addSuffix: true,
                                                },
                                            )}
                                        </span>
                                        <br />
                                        <span className="text-[12px] text-intg-text-4">
                                            {format(
                                                new Date(survey.createdAt),
                                                "MMM dd, yyyy",
                                            )}
                                        </span>
                                    </TableCell>
                                    <TableCell>0</TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>

                    <TableFoot className="h-[50px] border-t border-intg-bg-7">
                        <TableFooterCell className="flex justify-between">
                            <button
                                disabled={!pageInfo?.hasPreviousPage}
                                onClick={() => handleGetMoreSurveys("backward")}
                                className={`${
                                    !pageInfo?.hasPreviousPage
                                        ? "cursor-not-allowed opacity-50"
                                        : ""
                                } hover:bg-intg-bg-8} rounded-md border border-intg-bg-7 transition-all duration-300 ease-in`}
                            >
                                <Icon
                                    size="md"
                                    icon={ChevronLeft}
                                    className="font-light text-intg-text-4 hover:cursor-pointer"
                                />
                            </button>
                            <button
                                disabled={!pageInfo?.hasNextPage}
                                onClick={() => handleGetMoreSurveys("forward")}
                                className={`${
                                    !pageInfo?.hasNextPage
                                        ? "cursor-not-allowed opacity-50"
                                        : ""
                                } rounded-md border border-intg-bg-7  transition-all duration-300 ease-in hover:bg-intg-bg-8`}
                            >
                                <Icon
                                    size="md"
                                    icon={ChevronRight}
                                    className="font-light text-intg-text-4 hover:cursor-pointer"
                                />
                            </button>
                        </TableFooterCell>
                        <TableFooterCell />
                        <TableFooterCell />
                        <TableFooterCell>
                            <span className="text-sm font-light text-intg-text-4">
                                Rows per page: {surveysOnPage}
                            </span>
                        </TableFooterCell>
                        <TableFooterCell>
                            <span className="text-sm font-light text-intg-text-4">
                                {surveyStartIndex} - {surveyEndIndex} of{" "}
                                {totalSurveys} Surveys
                            </span>
                        </TableFooterCell>
                    </TableFoot>
                </Table>
            </div>
        </div>
    );
};
