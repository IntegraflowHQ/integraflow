import { Button, Dialog, DialogContent, DialogTrigger } from "@/ui";
import type { DialogProps } from "@radix-ui/react-dialog";
import { useState } from "react";
import TextButton from "./Buttons/TextButton";

interface Props extends DialogProps {
    getValue?: (values: string[]) => void;
}

export const AddMultipleQuestions = ({ getValue }: Props) => {
    const [inputValue, setInputValue] = useState("");
    const [open, setOpen] = useState(false);

    const handleInputChange = (
        event: React.ChangeEvent<HTMLTextAreaElement>,
    ) => {
        setInputValue(event.target.value);
        console.log(event.target.value);
    };

    return (
        <Dialog onOpenChange={(value) => setOpen(value)} open={open}>
            <DialogTrigger asChild>
                <TextButton text={"Add multiple at once"} onclick={() => {}} />
            </DialogTrigger>
            <DialogContent title="Add multiple at once">
                <div className="min-w-[770px] space-y-6">
                    <textarea
                        className="h-[299px] w-full resize-none bg-[#2B2045] p-4 text-intg-text-1"
                        value={inputValue}
                        onChange={handleInputChange}
                    ></textarea>
                    <div className="ml-auto flex w-[45%] gap-2">
                        <Button
                            text="Cancel"
                            variant="secondary"
                            onClick={() => setOpen(!open)}
                        />
                        <Button
                            text="Update"
                            onClick={() => {
                                getValue && getValue(inputValue.split("\n"));
                                setOpen(!open);
                            }}
                        />
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
