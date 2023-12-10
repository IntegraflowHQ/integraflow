import {
    EditorTextInput,
    EditorTextProps,
} from "../../components/EditorTextInput";
import { CommentButton } from "./Buttons/CommentButton";
import MinimizeButton from "./Buttons/MinimizeButton";
import { MoreButton } from "./Buttons/MoreButton";

interface Props extends EditorTextProps {}

const SelectOptionBlock = ({ ...props }: Props) => {
    return (
        <div className="flex items-center gap-2">
            <MoreButton />
            <EditorTextInput
                {...props}
                // inputCount={props.inputCount}
                placeholder="Answer 1"
            />
            <div className="flex">
                <CommentButton />
                <MinimizeButton />
            </div>
        </div>
    );
};

export default SelectOptionBlock;
