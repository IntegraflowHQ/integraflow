import { TabHeader } from "./TabHeader";
import { BooleanSettings } from "./attributes/SettingsField/BooleanSettings";
import { CTASettings } from "./attributes/SettingsField/CTASettings";
import { ChoiceSettings } from "./attributes/SettingsField/ChoiceSettings";
import { FormSettings } from "./attributes/SettingsField/FormSettings";
import { RangeSettings } from "./attributes/SettingsField/RangeSettings";
import { TextSettings } from "./attributes/SettingsField/TextSettings";

type Props = {
    questionIndex: number;
};

export const SettingsTab = ({ questionIndex }: Props) => {
    return (
        <div className="space-y-3 text-sm">
            <TabHeader questionIndex={questionIndex} />
            <div className="space-y-3">
                <CTASettings />
                <BooleanSettings />
                <RangeSettings />
                <TextSettings />
                <FormSettings />
                <ChoiceSettings />
            </div>
        </div>
    );
};
