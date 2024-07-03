import { useWorkspace } from "@/modules/workspace/hooks/useWorkspace";
import { Header } from "@/ui";
import * as Progress from "@radix-ui/react-progress";
import { BillingCategoriesEnum, planDetails } from "../../../utils";

type BillingValues = {
    count: number;
    limit: number;
};

type ParsedBilling = {
    events: BillingValues;
    persons: BillingValues;
    responses: BillingValues;
};

export const Billing = () => {
    const { workspace } = useWorkspace();

    const parsedBilling = JSON.parse(workspace?.billingUsage) as ParsedBilling;

    const getBillingValues = (category: BillingCategoriesEnum): BillingValues => {
        switch (category) {
            case BillingCategoriesEnum.EVENTS:
                return parsedBilling.events;
            case BillingCategoriesEnum.PERSONS:
                return parsedBilling.persons;
            case BillingCategoriesEnum.RESPONSES:
                return parsedBilling.responses;
            default:
                return { count: 0, limit: 0 };
        }
    };

    return (
        <div className="w-[675px] pt-10 text-intg-text-4">
            <Header title="Manage Billing" description="Manage your billing information and invoices." variant="3" />
            <hr className="my-6 border-[1px] border-intg-bg-4" />

            <>
                <Header title="Current plan" variant="3" />
                <div className="space-y-6">
                    <div className="flex justify-between">
                        <p className="justify-end self-end text-sm">
                            You are currently on a <span className="text-white">free plan</span>.
                        </p>
                    </div>
                    <div className="space-y-6">
                        {planDetails.map(({ icon: Icon, ...plan }) => {
                            const { count, limit } = getBillingValues(plan.category);
                            const percentage = (count / limit) * 100;

                            return (
                                <div className="space-y-6 rounded-lg bg-intg-bg-9 p-4 text-sm" key={plan.title}>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex items-center gap-2">
                                            <Icon size={16} />
                                            <p className="font-semibold">{plan.title}</p>
                                        </div>
                                        <p className="text-sm">{plan.description}</p>
                                    </div>
                                    <div>
                                        <Progress.Root
                                            className="relative h-[8px] w-full overflow-hidden rounded-sm border-intg-bg-23 bg-intg-bg-23"
                                            style={{
                                                // Fix overflow clipping in Safari
                                                // https://gist.github.com/domske/b66047671c780a238b51c51ffde8d3a0
                                                transform: "translateZ(0)",
                                            }}
                                            value={percentage}
                                        >
                                            <Progress.Indicator
                                                className="ease-[cubic-bezier(0.65, 0, 0.35, 1)] h-full bg-intg-bg-13 transition-transform duration-[660ms]"
                                                style={{ transform: `translateX(${percentage}%)` }}
                                            />
                                        </Progress.Root>
                                        <div className="flex justify-between">
                                            <div className="h-5 border border-intg-bg-23"></div>
                                            <div className="h-5 border border-intg-bg-23"></div>
                                        </div>

                                        <div className="flex justify-between">
                                            <div className="flex gap-3">
                                                <div>
                                                    <p>Current</p>
                                                    <p>{count}</p>
                                                </div>
                                                {count === limit ? (
                                                    <p className="self-end rounded bg-intg-bg-20 px-2 py-1 text-xs text-intg-text-9">
                                                        Free trial reached
                                                    </p>
                                                ) : null}
                                            </div>
                                            <div>
                                                <p>Free tier limit</p>
                                                <p>{limit}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </>
        </div>
    );
};
