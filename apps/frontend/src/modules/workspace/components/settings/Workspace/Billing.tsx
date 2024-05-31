import { useAuth } from "@/modules/auth/hooks/useAuth";
import { useWorkspace } from "@/modules/workspace/hooks/useWorkspace";
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
    const { organizations } = useAuth();
    const { workspace } = useWorkspace();

    const currentWorkspace = organizations.find((org) => {
        return workspace?.id === org?.id;
    });

    const parsedBilling = JSON.parse(currentWorkspace?.billingUsage) as ParsedBilling;

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
            <div className="w-[515px]">
                <h3 className="font-semibold">Manage Billing</h3>
                <p className="text-sm">
                    Manage your billing information and invoices. For questions about billing, contact
                    Integraflow@gmail.com or visit Github.
                </p>
            </div>
            <hr className="my-6 border-[1px] border-intg-bg-4" />

            <>
                <h3 className="font-semibold">Current plan</h3>
                <div className="space-y-6">
                    <div className="flex justify-between">
                        <p className="justify-end self-end text-sm">You are currently on a free plan.</p>
                    </div>
                    <div className="space-y-6">
                        {planDetails.map(({ icon: Icon, ...plan }) => {
                            const { count, limit } = getBillingValues(plan.category);

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
                                            value={count}
                                        >
                                            <Progress.Indicator
                                                className="ease-[cubic-bezier(0.65, 0, 0.35, 1)] h-full w-full bg-intg-bg-13 transition-transform duration-[660ms]"
                                                style={{ transform: `translateX(-${100 - count}%)` }}
                                            />
                                        </Progress.Root>
                                        <div className="flex justify-between">
                                            <div className="h-5 border border-intg-bg-23"></div>
                                            <div className="h-5 border border-intg-bg-23"></div>
                                        </div>

                                        <div className="flex justify-between">
                                            <div>
                                                <p>Current</p>
                                                <p>{count}</p>
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
