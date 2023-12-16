import { Dialog, DialogContent, DialogTrigger, Header, Info } from "@/ui";
import { Document } from "@/ui/icons";
import { useSurveyList } from "../hooks/useSurveyList";
import SurveyCreate from "./SurveyCreate";
import CreateSurveyButton from "./partials/CreateSurveyButton";

export default function SurveyHome() {
    const { surveyList, loading, error } = useSurveyList();

    console.log(surveyList);

    return (
        <main className="flex h-full w-full flex-col items-center justify-center">
            {error && <Info message={error.message} />}

            {loading ? (
                <p>Loading...</p>
            ) : (
                <>
                    {surveyList ? (
                        <p className="text-2xl font-bold text-white">
                            Holla Surveys!
                        </p>
                    ) : (
                        <>
                            <div className="flex max-w-[386px] flex-col items-center gap-[7px]">
                                <Document size="62" color="#AFAAC7" />

                                <div className="flex flex-col items-center gap-6">
                                    <Header
                                        title="Create your first survey"
                                        description="Integraflow enables you to understand your customers
                            To get started, we'll need to integrate your SDK
                            product."
                                        className="text-center"
                                    />

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
                            </div>
                        </>
                    )}
                </>
            )}
        </main>
    );
}
