import { GlobalSpinner, Header } from "@/ui";
import { Document } from "@/ui/icons";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useSurvey } from "../../hooks/useSurvey";
import CreateSurveyButton from "../partials/CreateSurveyButton";
import { SurveyList } from "./components/SurveyList";

export default function SurveyHome() {
    const { surveyList, loading, createSurvey } = useSurvey();

    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        if (!searchParams) {
            return;
        }

        if (searchParams.get("create") === "1" || searchParams.get("create") === "2") {
            createSurvey();
            setSearchParams({});
        }
    }, [searchParams]);

    if (loading) {
        return <GlobalSpinner />;
    }

    return (
        <main className="flex h-full w-full flex-col">
            {surveyList?.edges?.length > 0 ? (
                <SurveyList />
            ) : (
                <div className="flex h-full w-full  justify-center">
                    <div className="flex max-w-[386px] flex-col items-center justify-center  gap-[7px]">
                        <Document size={62} color="#AFAAC7" />

                        <div className="flex flex-col items-center gap-6">
                            <Header
                                title="Create your first survey"
                                description="Integraflow enables you to understand your customers. To get started, click on 'Create new survey'. You may need to integrate our SDK to your website/platform."
                                className="text-center"
                            />
                            <CreateSurveyButton onClick={() => createSurvey()} />
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
