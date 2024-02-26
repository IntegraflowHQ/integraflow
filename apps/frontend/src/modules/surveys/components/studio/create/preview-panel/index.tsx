import { Header } from "@/ui";
import EmptySurvey from "assets/images/surveys/empty.png";

export const Preview = () => {
    // const iframe = createRef<HTMLIFrameElement>();

    return (
        <div className="flex h-full flex-col items-center justify-center rounded-xl bg-intg-bg-9">
            {/* Empty state */}
            <div className="space-y-8">
                <img src={EmptySurvey} alt="" />
                <Header
                    title="Nothing to see here yet."
                    description="Add your first question first!"
                    className="text-center"
                />
            </div>
            {/* <div className="h-full w-full border">
                <IframeWrapper ref={iframe} />
            </div> */}
        </div>
    );
};
