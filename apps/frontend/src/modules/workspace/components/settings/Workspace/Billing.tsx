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

    return (
        <div className="w-[675px] pt-10 text-intg-text-4">
            <div className="w-[515px]">
                <h3 className="font-semibold">Manage Billing</h3>
                <p className="text-sm">
                    Manage your billing information and invoice. for question about billing Contact
                    Integraflow@gmail.com or Github
                </p>
            </div>
            <hr className="my-6 border-[1px] border-intg-bg-4" />

            <>
                <h3 className="font-semibold">Current plan</h3>
                <div className="space-y-6">
                    <div className="flex justify-between">
                        <p className="justify-end self-end text-sm">You are currently on a free plan with ()</p>
                        {/* billing plans */}
                        {/* <div>
                            <Button text="View plans & upgrade" size="md" onClick={() => setOpenBillingModal(true)} />
                            <BillingModal open={openBillingModal} setOpenBillingModal={setOpenBillingModal} />
                        </div> */}
                    </div>
                    <div className="space-y-6">
                        {planDetails.map(({ icon: Icon, ...plan }) => {
                            const count =
                                plan.category === BillingCategoriesEnum.EVENTS
                                    ? parsedBilling.events.count
                                    : plan.category === BillingCategoriesEnum.PERSONS
                                      ? parsedBilling.persons.count
                                      : plan.category === BillingCategoriesEnum.RESPONSES
                                        ? parsedBilling.responses.count
                                        : 0;

                            const limit =
                                plan.category === BillingCategoriesEnum.EVENTS
                                    ? parsedBilling.events.limit
                                    : plan.category === BillingCategoriesEnum.PERSONS
                                      ? parsedBilling.persons.limit
                                      : plan.category === BillingCategoriesEnum.RESPONSES
                                        ? parsedBilling.responses.limit
                                        : 0;

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
                                            className="bg-intg-bg-23 border-intg-bg-23 relative h-[8px] w-full overflow-hidden rounded-sm"
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
                                            <div className="border-intg-bg-23 h-5 border"></div>
                                            <div className="border-intg-bg-23 h-5 border"></div>
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
