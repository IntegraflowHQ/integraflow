import Discord from "assets/images/Discord.png";
import { Button } from "..";

export const JoinDiscord = () => {
    return (
        <div className="my-5 flex w-full space-x-2 rounded-lg bg-intg-bg-9 px-2 py-4">
            <div className="h-8 w-8">
                <img src={Discord} alt="Discord" />
            </div>
            <div className="space-y-[4px]">
                <p className="flex">
                    <span className="text-sm text-white">
                        Join our Discord Community
                    </span>
                </p>
                <p className="text-xs text-intg-text">
                    Add your card to prevent interruption after trial
                </p>
                <Button text="Join now" className="py-[6px]" />
            </div>
        </div>
    );
};
