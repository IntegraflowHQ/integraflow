import { Button } from "@/ui";
import { Document } from "@/ui/icons";

export default function CreateSurveyButton() {
    return (
        <Button
            icon={<Document />}
            text="Create new survey"
            className="w-max px-[12px] py-[12px] text-base font-normal"
        />
    );
}
