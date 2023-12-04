import { Button } from "@/ui";
import { ButtonProps } from "@/ui/Button/Button";
import { Document } from "@/ui/icons";

export default function CreateSurveyButton(props: ButtonProps) {
    return (
        <Button
            icon={<Document />}
            text="Create new survey"
            className="w-max px-[12px] py-[12px] text-base font-normal"
            {...props}
        />
    );
}
