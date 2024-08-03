import { Survey, SurveyStatusEnum } from "@/generated/graphql";
import { useOnboarding } from "@/modules/onboarding/hooks/useOnboarding";
import { useSurvey } from "@/modules/surveys/hooks/useSurvey";
import { ROUTES } from "@/routes";
import { Dialog, DialogContent, DialogTrigger, Pagination, Spinner } from "@/ui";
import { cn } from "@/utils";
import * as Popover from "@radix-ui/react-popover";
import { Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from "@tremor/react";
import { format, formatDistanceToNow, parseISO } from "date-fns";
import { Archive, ClipboardCheck, Edit, MoreHorizontal, PauseCircle, Radio, Trash2 } from "lucide-react";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
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

    const { createSurvey, updateSurvey, deleteSurvey, loading, getMoreSurveys, surveyList, isFetchingMore } =
        useSurvey();

    const [selectedSurveyName, setSelectedSurveyName] = React.useState<string>("");

    const { steps: onboardingSteps, markAsCompleted } = useOnboarding();
    const surveyPublishIndex = onboardingSteps.findIndex((s) => s.key === "publish");

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

    return (
        <div className="h-full w-full px-6 py-4 text-white">
            <div className="flex justify-between">
                <p className="py-2 text-xl font-normal">Surveys</p>
                <CreateSurveyButton onClick={() => createSurvey()} />
            </div>

            <div className=" mt-8 flex flex-col pb-10">
                <Table
                    className={cn(
                        loading ? "opacity-70" : "",
                        "scrollbar-hide relative table-auto rounded-t-md border border-intg-bg-4",
                    )}
                >
                    <TableHead className="border-b border-intg-bg-4 bg-intg-bg-8 font-light text-intg-text">
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

                    <TableBody className="relative">
                        {loading || isFetchingMore ? (
                            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                                <Spinner size="md" removeLogo className="h-3 w-3" />
                            </div>
                        ) : null}
                        {surveyList?.edges?.map((survey) => {
                            const surveyStats = JSON.parse(survey?.stats ?? '{"response_count": "0"}');
                            return (
                                <TableRow
                                    key={survey.id}
                                    className="border-intg-bg-4 text-center font-light transition-all duration-300 ease-in hover:bg-intg-bg-8"
                                >
                                    <TableCell
                                        className="cursor-pointer"
                                        onClick={() => handleGetSurvey(survey?.slug ?? "")}
                                    >
                                        {survey.name}
                                    </TableCell>
                                    <TableCell
                                        className="cursor-pointer"
                                        onClick={() => handleGetSurvey(survey?.slug ?? "")}
                                    >
                                        {!survey.creator.firstName ? (
                                            <span>{survey?.creator?.email}</span>
                                        ) : (
                                            <>
                                                {`${survey?.creator.firstName} ${survey?.creator.lastName}`}
                                                <br />
                                                <span className="text-[12px] text-intg-text-4">
                                                    {survey?.creator?.email}
                                                </span>
                                            </>
                                        )}
                                    </TableCell>
                                    <TableCell
                                        className="cursor-pointer"
                                        onClick={() => handleGetSurvey(survey?.slug ?? "")}
                                    >
                                        <StatusBadge survey={survey} />
                                    </TableCell>
                                    <TableCell
                                        className="cursor-pointer"
                                        onClick={() => handleGetSurvey(survey?.slug ?? "")}
                                    >
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
                                    <TableCell
                                        className="cursor-pointer px-12"
                                        onClick={() => handleGetSurvey(survey?.slug ?? "")}
                                    >
                                        {surveyStats.response_count}
                                    </TableCell>
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
                                                            onClick={() => {
                                                                updateSurvey(survey, {
                                                                    status: SurveyStatusEnum.Active,
                                                                });

                                                                if (surveyPublishIndex === -1) {
                                                                    return;
                                                                }
                                                                markAsCompleted(surveyPublishIndex);
                                                            }}
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
                                                            className="w-[500px]"
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
                </Table>
                <Pagination
                    hasNextPage={surveyList?.pageInfo?.hasNextPage ?? false}
                    hasPrevPage={surveyList?.pageInfo?.hasPreviousPage ?? false}
                    nextPageFn={() => getMoreSurveys("forward")}
                    prevPageFn={() => getMoreSurveys("backward")}
                    totalCount={surveyList?.totalCount ?? 0}
                    itemName={(surveyList.totalCount ?? 0) > 1 ? "Surveys" : "Survey"}
                    className="rounded-b-md border-x border-b border-intg-bg-4 p-4"
                />
            </div>
        </div>
    );
};
