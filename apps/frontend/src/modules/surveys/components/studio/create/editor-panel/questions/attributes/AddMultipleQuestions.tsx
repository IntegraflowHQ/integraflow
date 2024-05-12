import { useQuestion } from "@/modules/surveys/hooks/useQuestion";
import { Button, Dialog, DialogContent, DialogTrigger } from "@/ui";
import { generateUniqueId } from "@/utils";
import { FormField, QuestionOption } from "@/types";
import type { DialogProps } from "@radix-ui/react-dialog";
import { useEffect, useState } from "react";
import TextButton from "./Buttons/TextButton";

interface Props extends DialogProps {
    questionOptions?: QuestionOption[] | FormField[];
}

export const AddMultipleQuestions = ({ questionOptions }: Props) => {
    const [inputValue, setInputValue] = useState(
        questionOptions ? [...questionOptions.map((option) => option.label)].join("\n") : "",
    );

    const [openModal, setOpenModal] = useState(false);

    const { updateQuestion } = useQuestion();

    useEffect(() => {
        setInputValue(
            questionOptions ? [...questionOptions.map((option: QuestionOption) => option.label)].join("\n") : "",
        );
    }, [openModal]);

    return (
        <Dialog onOpenChange={(value) => setOpenModal(value)} open={openModal}>
            <DialogTrigger>
                <TextButton text={"Add multiple at once"} />
            </DialogTrigger>
            <DialogContent title="Add multiple at once">
                <div className="min-w-[770px] space-y-6">
                    <textarea
                        className="h-[299px] w-full resize-none bg-[#2B2045] p-4 text-intg-text-1"
                        value={inputValue}
                        onChange={(e) => {
                            setInputValue(e.target.value);
                        }}
                    ></textarea>
                    <div className="ml-auto flex w-[45%] gap-2">
                        <Button text="Cancel" variant="secondary" onClick={() => setOpenModal(!open)} />
                        <Button
                            text="Update"
                            onClick={() => {
                                setOpenModal(!openModal);
                                updateQuestion({
                                    options: inputValue.split("\n").map((option, index) => ({
                                        id: generateUniqueId(),
                                        orderNumber: index,
                                        label: option,
                                    })),
                                });
                            }}
                        />
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
