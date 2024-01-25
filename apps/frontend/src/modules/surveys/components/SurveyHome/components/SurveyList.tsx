import { SurveyStatusEnum } from "@/generated/graphql";
import { useSurvey } from "@/modules/surveys/hooks/useSurvey";
import { ROUTES } from "@/routes";
import { Dialog, DialogContent, DialogTrigger } from "@/ui";
import * as Popover from "@radix-ui/react-popover";
import {
    Icon,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeaderCell,
    TableRow,
} from "@tremor/react";
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
    { id: crypto.randomUUID(), title: "Creator" },
    { id: crypto.randomUUID(), title: "Status" },
    { id: crypto.randomUUID(), title: "Date Created" },
    { id: crypto.randomUUID(), title: "Responses" },
    { id: crypto.randomUUID(), title: "" },
];

export const SurveyList = () => {
    const navigate = useNavigate();
    const { orgSlug, projectSlug } = useParams();
    const {
        updateSurvey,
        deleteSurvey,
        loading,
        error,
        getMoreSurveys,
        surveyList: surveys,
        surveysOnPage,
    } = useSurvey();

    const surveyList = surveys?.edges;
    const pageInfo = surveys?.pageInfo;
    const totalSurveys = surveys?.totalCount ?? 0;

    console.log(totalSurveys);

    const [selectedSurveyId, setSelectedSurveyId] = React.useState<string>("");
    const [page, setPage] = React.useState<number>(1);
    const [selectedSurveyName, setSelectedSurveyName] =
        React.useState<string>("");

    // const [nameFilter, setNameFilter] = React.useState<string>("");
    const [currentSurveys, setCurrentSurveys] = React.useState<
        SurveyListData["surveys"]
    >(surveyList ?? []);

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
        setCurrentSurveys(surveyList ?? []);
    };

    const handleGetSurvey = (slug: string) => {
        navigate(
            ROUTES.STUDIO.replace(":orgSlug", orgSlug!)
                .replace(":projectSlug", projectSlug!)
                .replace(":surveySlug", slug),
        );
    };

    const getSurveyNameOnSelect = (
        id: string,
        e: React.MouseEvent<HTMLDivElement>,
    ) => {
        e.stopPropagation();

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const findSurvey = surveyList?.find((survey) => survey.id === id);
        const surveyName = findSurvey?.node?.name;
        setSelectedSurveyName(surveyName ?? "");
    };

    const getSurveyIdOnPopoverTrigger = (
        event: React.MouseEvent,
        id: string,
    ) => {
        event.stopPropagation();

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const findSurvey = surveyList?.find((survey) => survey.id === id);
        const surveyId = findSurvey?.node.id;

        setSelectedSurveyId(surveyId ?? "");
    };

    const handleSurveyDelete = (
        id: string,
        event: React.MouseEvent<HTMLButtonElement>,
    ) => {
        event.stopPropagation();
        event.preventDefault();

        try {
            deleteSurvey(id);
            toast.success("Survey deleted successfully");
        } catch (err) {
            toast.error(error?.message ?? "");
        }
    };

    const setSurveyStatus = (status: SurveyStatusEnum) => {
        if (selectedSurveyId) {
            try {
                updateSurvey(selectedSurveyId, { status });
                toast.success("Survey status updated successfully");
            } catch (err) {
                toast.error(error?.message ?? "");
            }
        }
    };

    const surveyStartIndex = (page - 1) * surveysOnPage + 1;
    const surveyEndIndex = Math.min(page * surveysOnPage, totalSurveys);

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
                                    className="border-intg-bg-7 text-center font-light transition-all duration-300 ease-in hover:cursor-pointer hover:bg-intg-bg-8"
                                >
                                    <TableCell>{survey.name}</TableCell>
                                    <TableCell>
                                        {survey?.creator?.fullName}
                                        <br />
                                        <span className="text-[12px] text-intg-text-4">
                                            {survey?.creator.email}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <StatusBadge survey={survey} />
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
                                    <TableCell className="px-12">0</TableCell>
                                    <TableCell className="text-center">
                                        <Popover.Root>
                                            <Popover.Trigger asChild>
                                                <button
                                                    onClick={(e) =>
                                                        getSurveyIdOnPopoverTrigger(
                                                            e,
                                                            survey.id,
                                                        )
                                                    }
                                                    className="w-fit rounded-md px-1 py-1 transition-all duration-300 ease-in hover:cursor-pointer hover:bg-intg-bg-1 data-[state=a]:bg-intg-bg-1"
                                                >
                                                    <MoreHorizontal color="#AFAAC7" />
                                                </button>
                                            </Popover.Trigger>

                                            <Popover.Portal>
                                                <Popover.Content
                                                    align="end"
                                                    alignOffset={5}
                                                    className="w-[140px] rounded-md border border-intg-bg-7 bg-intg-bg-8 px-3 py-4 uppercase"
                                                >
                                                    <Dialog>
                                                        <DialogTrigger asChild>
                                                            <div
                                                                onClick={(
                                                                    event,
                                                                ) =>
                                                                    getSurveyNameOnSelect(
                                                                        survey.id,
                                                                        event,
                                                                    )
                                                                }
                                                                className="flex gap-[6px] rounded-md py-[7px] text-sm font-normal text-intg-text-4 transition-all duration-300 ease-in hover:cursor-pointer hover:bg-intg-bg-1 hover:pl-[8px]"
                                                            >
                                                                <Trash2
                                                                    size="18"
                                                                    color="#AFAAC7"
                                                                />
                                                                Delete
                                                            </div>
                                                        </DialogTrigger>

                                                        <DialogContent
                                                            alignHeader="left"
                                                            title={`Delete ${selectedSurveyName}`}
                                                            description="Are you sure you want to delete this survey?"
                                                        >
                                                            <button
                                                                disabled={
                                                                    loading
                                                                }
                                                                onClick={(e) =>
                                                                    handleSurveyDelete(
                                                                        survey.id,
                                                                        e,
                                                                    )
                                                                }
                                                                className={`${
                                                                    loading
                                                                        ? "opacity-50"
                                                                        : ""
                                                                } mt-[30px] w-full rounded-md bg-red-600 py-3 text-center transition-all duration-300 ease-in hover:cursor-pointer`}
                                                            >
                                                                {loading
                                                                    ? "Deleting..."
                                                                    : "Delete"}
                                                            </button>
                                                        </DialogContent>
                                                    </Dialog>
                                                    <div
                                                        onClick={() =>
                                                            setSurveyStatus(
                                                                SurveyStatusEnum.Archived,
                                                            )
                                                        }
                                                        className="flex gap-[6px] rounded-md py-[7px] text-sm font-normal text-intg-text-4 transition-all duration-300 ease-in hover:cursor-pointer hover:bg-intg-bg-1 hover:pl-[8px]"
                                                    >
                                                        <span>
                                                            <Archive
                                                                size="18"
                                                                color="#AFAAC7"
                                                            />
                                                        </span>
                                                        Archive
                                                    </div>
                                                    <div
                                                        onClick={() =>
                                                            handleGetSurvey(
                                                                survey.slug,
                                                            )
                                                        }
                                                        className="flex gap-[6px] rounded-md py-[7px] text-sm font-normal text-intg-text-4 transition-all duration-300 ease-in hover:cursor-pointer hover:bg-intg-bg-1 hover:pl-[8px]"
                                                    >
                                                        <Edit
                                                            size="18"
                                                            color="#AFAAC7"
                                                        />
                                                        Edit
                                                    </div>
                                                    <div
                                                        onClick={() =>
                                                            setSurveyStatus(
                                                                SurveyStatusEnum.Paused,
                                                            )
                                                        }
                                                        className="flex gap-[6px] rounded-md py-[7px] text-sm font-normal text-intg-text-4 transition-all duration-300 ease-in hover:cursor-pointer hover:bg-intg-bg-1 hover:pl-[8px]"
                                                    >
                                                        <PauseCircle
                                                            size="18"
                                                            color="#AFAAC7"
                                                        />
                                                        pause
                                                    </div>
                                                    <div
                                                        onClick={() =>
                                                            setSurveyStatus(
                                                                SurveyStatusEnum.Active,
                                                            )
                                                        }
                                                        className="flex gap-[6px] rounded-md py-[7px] text-sm font-normal text-intg-text-4 transition-all duration-300 ease-in hover:cursor-pointer hover:bg-intg-bg-1 hover:pl-[8px]"
                                                    >
                                                        <Radio
                                                            size="18"
                                                            color="#AFAAC7"
                                                        />
                                                        Publish
                                                    </div>
                                                    <div
                                                        onClick={() =>
                                                            setSurveyStatus(
                                                                SurveyStatusEnum.Completed,
                                                            )
                                                        }
                                                        className="flex gap-[6px] rounded-md py-[7px] text-sm font-normal text-intg-text-4 transition-all duration-300 ease-in hover:cursor-pointer hover:bg-intg-bg-1 hover:pl-[8px]"
                                                    >
                                                        <ClipboardCheck
                                                            size="18"
                                                            color="#AFAAC7"
                                                        />
                                                        Complete
                                                    </div>
                                                </Popover.Content>
                                            </Popover.Portal>
                                        </Popover.Root>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>

                    <tfoot className="table-footer-group h-[50px] border-t border-intg-bg-7">
                        <tr className="">
                            <td className="table-cell px-4 py-4">
                                <button
                                    disabled={!pageInfo?.hasPreviousPage}
                                    onClick={() =>
                                        handleGetMoreSurveys("backward")
                                    }
                                    className={`${
                                        !pageInfo?.hasPreviousPage
                                            ? "cursor-not-allowed opacity-50"
                                            : ""
                                    } hover:bg-intg-bg-8} rounded-md border border-intg-bg-7 transition-all duration-300 ease-in`}
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
                                    disabled={!pageInfo?.hasNextPage}
                                    onClick={() =>
                                        handleGetMoreSurveys("forward")
                                    }
                                    className={`${
                                        !pageInfo?.hasNextPage
                                            ? "cursor-not-allowed opacity-50"
                                            : ""
                                    } rounded-md border border-intg-bg-7  transition-all duration-300 ease-in hover:bg-intg-bg-8`}
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
                                {surveyStartIndex} - {surveyEndIndex} of{" "}
                                {totalSurveys} Surveys
                            </td>
                        </tr>
                    </tfoot>
                </Table>
            </div>
        </div>
    );
};
