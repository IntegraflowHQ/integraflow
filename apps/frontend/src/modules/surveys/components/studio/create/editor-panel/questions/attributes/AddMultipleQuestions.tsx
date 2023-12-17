import { Button, Dialog, DialogContent, DialogTrigger } from "@/ui";
import { FormField, QuestionOption } from "@integraflow/web/src/types";
import type { DialogProps } from "@radix-ui/react-dialog";
import { useState } from "react";
import TextButton from "./Buttons/TextButton";

interface Props extends DialogProps {
    getValue?: (values: {
        id: number;
        label: string;
        orderNumber: number;
    }) => void;
    question?: QuestionOption[] | FormField[];
}

export const AddMultipleQuestions = ({ getValue, question }: Props) => {
    const [inputValue, setInputValue] = useState("");
    const [openModal, setOpenModal] = useState(false);

    const handleInputChange = (
        event: React.ChangeEvent<HTMLTextAreaElement>,
    ) => {
        setInputValue(event.target.value);
    };

    return (
        <Dialog onOpenChange={(value) => setOpenModal(value)} open={openModal}>
            <DialogTrigger>
                <TextButton text={"Add multiple at once"} />
            </DialogTrigger>
            <DialogContent title="Add multiple at once">
                <div className="min-w-[770px] space-y-6">
                    <textarea
                        className="h-[299px] w-full resize-none bg-[#2B2045] p-4 text-intg-text-1"
                        value={
                            inputValue ||
                            question?.map((value) => value.label).join("\n")
                        }
                        onChange={handleInputChange}
                    ></textarea>
                    <div className="ml-auto flex w-[45%] gap-2">
                        <Button
                            text="Cancel"
                            variant="secondary"
                            onClick={() => setOpenModal(!open)}
                        />
                        <Button
                            text="Update"
                            onClick={() => {
                                setOpenModal(!openModal);
                                [...inputValue.split("\n")].map(
                                    (value, index) => {
                                        getValue &&
                                            getValue({
                                                id: index + 1,
                                                label: value,
                                                orderNumber: index + 1,
                                            });
                                    },
                                );
                            }}
                        />
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
