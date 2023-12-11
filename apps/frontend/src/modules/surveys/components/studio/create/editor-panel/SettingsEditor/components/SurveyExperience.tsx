import { SwitchToggle, ToggleProps } from "@/ui/ToggleSwitch";
import { PositionIcon } from "@/ui/icons";
interface SurveyProps extends ToggleProps {
    id: string;
    name: string;
}

const SURVEY_EXPERIENCE_OPTIONS: SurveyProps[] = [
    {
        id: crypto.randomUUID(),
        name: "Progress bar",
        variant: "soft",
    },
    {
        id: crypto.randomUUID(),
        name: "Remove Integraflow branding",
        variant: "soft",
    },
    {
        id: crypto.randomUUID(),
        name: "Start minimized on mobile",
        variant: "soft",
    },
    {
        id: crypto.randomUUID(),
        name: "Close button",
        variant: "solid",
    },
    {
        id: crypto.randomUUID(),
        name: "Minimize button",
        variant: "solid",
    },
    {
        id: crypto.randomUUID(),
        name: "Background overlay",
        variant: "detailed",
    },
];

const SURVEY_POSITION_OPTIONS = [
    "Lower left corner",
    "Center",
    "Upper right corner",
    "Upper left corner",
];

const SURVEY_POSITION = SURVEY_POSITION_OPTIONS.map((name) => ({
    name: name,
    id: `${name.toLocaleLowerCase().split(" ").join("-")}`,
}));

export const SurveyExperience = () => {
    return (
        <div className="w-full flex-col py-3">
            {SURVEY_EXPERIENCE_OPTIONS.slice(0, 5).map(
                ({ id, name, variant }) => {
                    return (
                        <div
                            key={id}
                            className="my-2 flex h-14 justify-between rounded-md bg-intg-bg-15 px-6 py-4"
                        >
                            <p className="text-center text-sm font-normal text-intg-text-2">
                                {name}
                            </p>
                            <SwitchToggle label={name} variant={variant} />
                        </div>
                    );
                },
            )}

            <hr className="border-1 my-6 border-intg-bg-14" />

            <div>
                <div
                    key={SURVEY_EXPERIENCE_OPTIONS[5].id}
                    className="my-2 flex h-14 justify-between rounded-md bg-intg-bg-15 px-2 py-4"
                >
                    <p className="text-center text-sm font-normal text-intg-text-2">
                        {SURVEY_EXPERIENCE_OPTIONS[5].name}
                    </p>
                    <SwitchToggle
                        label={SURVEY_EXPERIENCE_OPTIONS[5].name}
                        variant={SURVEY_EXPERIENCE_OPTIONS[5].variant}
                    />
                </div>
            </div>

            <div className="py-2 text-intg-text-2">
                <p className="py-2 text-sm font-normal">Survey position</p>

                <div className="flex cursor-pointer justify-between gap-2 rounded-md bg-intg-bg-15 px-2 py-2">
                    {SURVEY_POSITION?.map(({ id, name }) => {
                        return (
                            <div
                                key={id}
                                className="whitespace-nowrap rounded-md bg-intg-bg-18 px-3 py-3"
                            >
                                <div className="flex justify-center">
                                    <PositionIcon />
                                </div>
                                <p className="mt-2 text-[12px] font-normal first-letter:capitalize">
                                    {name}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
