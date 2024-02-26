import { Survey, SurveyStatusEnum } from "@/generated/graphql";
import { useSurvey } from "@/modules/surveys/hooks/useSurvey";
import { ROUTES } from "@/routes";
import { Dialog, DialogContent, DialogTrigger } from "@/ui";
import * as Popover from "@radix-ui/react-popover";
import { Icon, Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from "@tremor/react";
import { format, formatDistanceToNow, parseISO } from "date-fns";
import {
    Archive,
    ChevronLeft,
    ChevronRight,
    ClipboardCheck,
    Edit,
    MoreHorizontal,
    PauseCircle,
    Radio,
    Trash2,
} from "lucide-react";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import SurveyCreate from "../../SurveyCreate";
import CreateSurveyButton from "../../partials/CreateSurveyButton";
import { StatusBadge } from "./StatusBadge";

const headers = [
    { id: crypto.randomUUID(), title: "Name" },
    { id: crypto.randomUUID(), title: "Creator" },
    { id: crypto.randomUUID(), title: "Status" },
    { id: crypto.randomUUID(), title: "Date Created" },
    { id: crypto.randomUUID(), title: "Responses" },
    { id: crypto.randomUUID(), title: "" },
];

export const SurveyList = () => {
    const navigate = useNavigate();
    const { orgSlug, projectSlug } = useParams();
    const { updateSurvey, deleteSurvey, loading, getMoreSurveys, surveyList, surveysOnPage } = useSurvey();

    const [page, setPage] = React.useState<number>(1);
    const [selectedSurveyName, setSelectedSurveyName] = React.useState<string>("");

    const handleGetMoreSurveys = (direction: string) => {
        if (direction === "forward") {
            setPage((prevPage) => prevPage + 1);
        } else {
            setPage((prevPage) => prevPage - 1);
        }

        getMoreSurveys(direction);
    };

    const handleGetSurvey = (slug: string) => {
        navigate(
            ROUTES.STUDIO.replace(":orgSlug", orgSlug!)
                .replace(":projectSlug", projectSlug!)
                .replace(":surveySlug", slug),
        );
    };

    const getSurveyNameOnSelect = (id: string, e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();

        const findSurvey = surveyList?.edges?.find((survey) => survey.id === id);
        const surveyName = findSurvey?.name;
        setSelectedSurveyName(surveyName ?? "");
    };

    const handleSurveyDelete = (event: React.MouseEvent<HTMLButtonElement>, survey: Survey) => {
        event.stopPropagation();
        event.preventDefault();

        deleteSurvey(survey);
    };

    const surveyStartIndex = (page - 1) * surveysOnPage + 1;
    const surveyEndIndex = Math.min(page * surveysOnPage, surveyList?.totalCount ?? 0);

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
                    <DialogContent title="Create new survey" description="Pick a method that suits you best">
                        <SurveyCreate className="h-[357px] w-[762px] pt-8" />
                    </DialogContent>
                </Dialog>
            </div>

            <div className="mt-8  flex flex-col">
                <Table className="scrollbar-hide table-auto rounded-md border border-intg-bg-4">
                    <TableHead className="border-b border-intg-bg-4 bg-intg-bg-8 font-light hover:cursor-pointer">
                        <TableRow>
                            {headers.map(({ title, id }) => {
                                return (
                                    <TableHeaderCell className="text-md font-normal" key={id}>
                                        {title}
                                    </TableHeaderCell>
                                );
                            })}
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {surveyList?.edges?.map((survey) => {
                            return (
                                <TableRow
                                    key={survey.id}
                                    className="border-intg-bg-4 text-center font-light transition-all duration-300 ease-in hover:cursor-pointer hover:bg-intg-bg-8"
                                >
                                    <TableCell onClick={() => handleGetSurvey(survey?.slug ?? "")}>
                                        {survey.name}
                                    </TableCell>
                                    <TableCell>
                                        {!survey?.creator?.firstName
                                            ? "Unknown User"
                                            : `${survey?.creator.firstName} ${survey?.creator.lastName}`}
                                        <br />
                                        <span className="text-[12px] text-intg-text-4">{survey?.creator?.email}</span>
                                    </TableCell>
                                    <TableCell>
                                        <StatusBadge survey={survey} />
                                    </TableCell>
                                    <TableCell>
                                        <span className="first-letter:capitalize">
                                            {formatDistanceToNow(parseISO(survey.createdAt ?? ""), {
                                                addSuffix: true,
                                            })}
                                        </span>
                                        <br />
                                        <span className="text-[12px] text-intg-text-4">
                                            {format(new Date(survey.createdAt ?? ""), "MMM dd, yyyy")}
                                        </span>
                                    </TableCell>
                                    <TableCell className="px-12">0</TableCell>
                                    <TableCell className="text-center">
                                        <Popover.Root>
                                            <Popover.Trigger asChild>
                                                <button className="w-fit rounded-md px-1 py-1 transition-all duration-300 ease-in hover:cursor-pointer hover:bg-intg-bg-1 data-[state=a]:bg-intg-bg-1">
                                                    <MoreHorizontal color="#AFAAC7" />
                                                </button>
                                            </Popover.Trigger>

                                            <Popover.Portal>
                                                <Popover.Content
                                                    align="end"
                                                    alignOffset={5}
                                                    className="w-[140px] rounded-md border border-intg-bg-4 bg-intg-bg-8 px-3 py-4 uppercase"
                                                >
                                                    <div
                                                        onClick={() => handleGetSurvey(survey?.slug ?? "")}
                                                        className="flex gap-[6px] rounded-md py-[7px] text-sm font-normal text-intg-text-4 transition-all duration-300 ease-in hover:cursor-pointer hover:bg-intg-bg-1 hover:pl-[8px]"
                                                    >
                                                        <Edit size="18" color="#AFAAC7" />
                                                        Edit
                                                    </div>
                                                    {survey.status === SurveyStatusEnum.Draft && (
                                                        <div
                                                            onClick={() =>
                                                                updateSurvey(survey, {
                                                                    status: SurveyStatusEnum.Active,
                                                                })
                                                            }
                                                            className="flex gap-[6px] rounded-md py-[7px] text-sm font-normal text-intg-text-4 transition-all duration-300 ease-in hover:cursor-pointer hover:bg-intg-bg-1 hover:pl-[8px]"
                                                        >
                                                            <Radio size="18" color="#AFAAC7" />
                                                            Publish
                                                        </div>
                                                    )}
                                                    {survey.status === SurveyStatusEnum.Active && (
                                                        <>
                                                            <div
                                                                onClick={() =>
                                                                    updateSurvey(survey, {
                                                                        status: SurveyStatusEnum.Paused,
                                                                    })
                                                                }
                                                                className="flex gap-[6px] rounded-md py-[7px] text-sm font-normal text-intg-text-4 transition-all duration-300 ease-in hover:cursor-pointer hover:bg-intg-bg-1 hover:pl-[8px]"
                                                            >
                                                                <PauseCircle size="18" color="#AFAAC7" />
                                                                Pause
                                                            </div>
                                                            <div
                                                                onClick={() =>
                                                                    updateSurvey(survey, {
                                                                        status: SurveyStatusEnum.Completed,
                                                                    })
                                                                }
                                                                className="flex gap-[6px] rounded-md py-[7px] text-sm font-normal text-intg-text-4 transition-all duration-300 ease-in hover:cursor-pointer hover:bg-intg-bg-1 hover:pl-[8px]"
                                                            >
                                                                <ClipboardCheck size="18" color="#AFAAC7" />
                                                                Complete
                                                            </div>
                                                        </>
                                                    )}
                                                    {survey.status !== SurveyStatusEnum.Archived && (
                                                        <div
                                                            onClick={() =>
                                                                updateSurvey(survey, {
                                                                    status: SurveyStatusEnum.Archived,
                                                                })
                                                            }
                                                            className="flex gap-[6px] rounded-md py-[7px] text-sm font-normal text-intg-text-4 transition-all duration-300 ease-in hover:cursor-pointer hover:bg-intg-bg-1 hover:pl-[8px]"
                                                        >
                                                            <span>
                                                                <Archive size="18" color="#AFAAC7" />
                                                            </span>
                                                            Archive
                                                        </div>
                                                    )}
                                                    {survey.status === SurveyStatusEnum.Archived && (
                                                        <div
                                                            onClick={() =>
                                                                updateSurvey(survey, { status: SurveyStatusEnum.Draft })
                                                            }
                                                            className="flex gap-[6px] rounded-md py-[7px] text-sm font-normal text-intg-text-4 transition-all duration-300 ease-in hover:cursor-pointer hover:bg-intg-bg-1 hover:pl-[8px]"
                                                        >
                                                            <Radio size="18" color="#AFAAC7" />
                                                            Restore
                                                        </div>
                                                    )}
                                                    <Dialog>
                                                        <DialogTrigger asChild>
                                                            <div
                                                                onClick={(event) =>
                                                                    getSurveyNameOnSelect(survey?.id ?? "", event)
                                                                }
                                                                className="flex gap-[6px] rounded-md py-[7px] text-sm font-normal text-intg-text-4 transition-all duration-300 ease-in hover:cursor-pointer hover:bg-intg-bg-1 hover:pl-[8px]"
                                                            >
                                                                <Trash2 size="18" color="#AFAAC7" />
                                                                Delete
                                                            </div>
                                                        </DialogTrigger>

                                                        <DialogContent
                                                            alignHeader="left"
                                                            title={`Delete ${selectedSurveyName}`}
                                                            description="Are you sure you want to delete this survey?"
                                                        >
                                                            <button
                                                                disabled={loading}
                                                                onClick={(e) => handleSurveyDelete(e, survey as Survey)}
                                                                className={`${
                                                                    loading ? "opacity-50" : ""
                                                                } mt-[30px] w-full rounded-md bg-red-600 py-3 text-center transition-all duration-300 ease-in hover:cursor-pointer`}
                                                            >
                                                                {loading ? "Deleting..." : "Delete"}
                                                            </button>
                                                        </DialogContent>
                                                    </Dialog>
                                                </Popover.Content>
                                            </Popover.Portal>
                                        </Popover.Root>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>

                    <tfoot className="table-footer-group h-[50px] border-t border-intg-bg-4">
                        <tr className="">
                            <td className="table-cell px-4 py-4">
                                <button
                                    disabled={!surveyList?.pageInfo?.hasPreviousPage}
                                    onClick={() => handleGetMoreSurveys("backward")}
                                    className={`${
                                        !surveyList?.pageInfo?.hasPreviousPage ? "cursor-not-allowed opacity-50" : ""
                                    } hover:bg-intg-bg-8} rounded-md border border-intg-bg-4 transition-all duration-300 ease-in`}
                                >
                                    <Icon
                                        size="md"
                                        icon={ChevronLeft}
                                        className="font-normal text-intg-text-4 hover:cursor-pointer"
                                    />
                                </button>
                            </td>
                            <td className="table-cell">
                                <button
                                    disabled={!surveyList?.pageInfo?.hasNextPage}
                                    onClick={() => handleGetMoreSurveys("forward")}
                                    className={`${
                                        !surveyList?.pageInfo?.hasNextPage ? "cursor-not-allowed opacity-50" : ""
                                    } rounded-md border border-intg-bg-4  transition-all duration-300 ease-in hover:bg-intg-bg-8`}
                                >
                                    <Icon
                                        size="md"
                                        icon={ChevronRight}
                                        className="font-normal text-intg-text-4 hover:cursor-pointer"
                                    />
                                </button>
                            </td>

                            <td className="table-cell" />

                            <td className="table-cell whitespace-nowrap px-4 py-4 text-sm font-normal text-intg-text-4">
                                Rows per page: {surveysOnPage}
                            </td>

                            <td className="table-cell whitespace-nowrap px-4 py-4 text-sm font-normal text-intg-text-4">
                                {surveyStartIndex} - {surveyEndIndex} of {surveyList?.totalCount} Surveys
                            </td>
                        </tr>
                    </tfoot>
                </Table>
            </div>
        </div>
    );
};
