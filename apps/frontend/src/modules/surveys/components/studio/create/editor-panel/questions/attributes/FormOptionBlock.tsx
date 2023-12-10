import { SelectInput } from "@/ui";
import { formOptions } from "@/utils/survey";
import { EditorTextInput } from "../../components/EditorTextInput";
import MinimizeButton from "./Buttons/MinimizeButton";
import { MoreButton } from "./Buttons/MoreButton";
import { StarBtn } from "./Buttons/StarBtn";

type Props = {
    getValue?: () => void;
};

export const FormOptionBlock = ({ getValue }: Props) => {
    return (
        <div className="flex items-center justify-between">
            <MoreButton />
            <div className="grid flex-1 grid-cols-2 gap-2">
                <SelectInput
                    options={formOptions}
                    defaultValue={formOptions[0].label}
                    onChange={() => {}}
                />
                <EditorTextInput showCharacterCount={false} />
            </div>
            <MinimizeButton />
            <StarBtn />
        </div>
    );
};
