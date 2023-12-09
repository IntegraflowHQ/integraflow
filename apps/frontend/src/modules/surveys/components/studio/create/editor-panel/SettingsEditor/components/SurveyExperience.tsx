import * as Switch from "@radix-ui/react-switch";

const SwitchToggle = () => {
    return (
        <>
            <label htmlFor="toggle item" />
            <Switch.Root
                id="toggle item"
                className="border-intg-bg-16 -mt-1 h-8 w-10 rounded-l-2xl rounded-r-2xl border-2"
            >
                <Switch.Thumb className="h-12 w-12 border border-white bg-intg-bg-2" />
            </Switch.Root>
        </>
    );
};

export const SurveyExperience = () => {
    return (
        <div className="w-full flex-col py-4">
            <div className="bg-intg-bg-15 flex h-14 justify-between rounded-md px-6 py-4">
                <p className="text-center text-sm font-normal text-intg-text-2">
                    Progress bar
                </p>
                <SwitchToggle />
            </div>
        </div>
    );
};
