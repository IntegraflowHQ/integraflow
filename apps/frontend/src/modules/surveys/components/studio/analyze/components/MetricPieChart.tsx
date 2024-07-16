import { ContainerWithTooltip } from "@/ui";
import { Info } from "@/ui/icons";
import { DonutChart } from "@tremor/react";
import { Legend, LegendProps } from "./Legend";

type Props = {
    title: string;
    description: string;
    average: string;
    data: LegendProps["data"];
    showPlaceHolder: boolean;
};
export function MetricPieChart({ title, description, data, average, showPlaceHolder }: Props) {
    return (
        <div className="h-[280px] max-w-[419px] rounded-lg bg-intg-bg-15 p-4">
            <header className="flex items-center gap-2 pb-4">
                <h2 className="text-base font-medium text-intg-text">{title}</h2>
                <ContainerWithTooltip text={description}>
                    <Info />
                </ContainerWithTooltip>
            </header>

            <div className="flex gap-[30px]">
                <div className="relative flex-1">
                    <DonutChart
                        data={
                            showPlaceHolder
                                ? [{ name: title, value: 1 }]
                                : data.map(({ name, value }) => ({ name, value }))
                        }
                        showLabel={false}
                        showTooltip={false}
                        colors={showPlaceHolder ? ["#EB5A6D"] : data.map((item) => item.color)}
                        className="h-[186px] w-[186px]"
                        showAnimation
                    />
                    <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center">
                        <strong className="text-3xl font-medium text-white">{average}</strong>
                        <span className="text-xs text-intg-text">Avg score</span>
                    </div>
                </div>

                <Legend data={data} />
            </div>
        </div>
    );
}
