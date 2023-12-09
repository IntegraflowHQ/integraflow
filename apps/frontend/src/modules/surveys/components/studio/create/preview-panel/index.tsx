import { Header } from "@/ui";
import EmptySurvey from "assets/images/surveys/empty.png";

export const Preview = () => {
    return (
        <div className="fixed right-14 mb-4 flex h-full min-w-[580px] flex-1 flex-col items-center justify-center rounded-xl bg-intg-bg-9">
            {/* Empty state */}
            <div className="space-y-8">
                <img src={EmptySurvey} alt="" />
                <Header
                    title="Nothing to see here yet."
                    description="Add your first question first!"
                    className="text-center"
                />
            </div>
        </div>
    );
};
