import { Header } from "@/ui";
import { cn } from "@/utils";
import { TemplateProps } from "@/utils/survey";

export default function Template({
    title,
    description,
    image,
    right = false,
}: TemplateProps) {
    return (
        <div className="flex flex-col gap-4 rounded-[9.455px] border border-intg-bg-9 bg-intg-bg-9 p-[18.91px] transition-all ease-out hover:border-intg-bg-2">
            <Header
                variant="3"
                title={title}
                description={description}
                className="w-[314px]"
            />
            <div
                className={cn(
                    "flex h-[196px] items-end justify-center rounded-[9.455px] bg-intg-bg-14",
                    right ? "flex-col" : "",
                )}
            >
                <img src={image} alt={title} />
            </div>
        </div>
    );
}
