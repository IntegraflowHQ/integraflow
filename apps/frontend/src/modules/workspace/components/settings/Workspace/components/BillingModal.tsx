import { billingDetails } from "@/modules/workspace/utils";
import { Dialog, DialogContent } from "@/ui";
import { Flame } from "@/ui/icons/Flame";

type Props = {
    open: boolean;
    setOpenBillingModal: React.Dispatch<React.SetStateAction<boolean>>;
};

export const BillingModal = ({ open, setOpenBillingModal }: Props) => {
    return (
        <Dialog open={open} onOpenChange={(value) => setOpenBillingModal(value)}>
            <DialogContent alignHeader="left">
                <h3>Plans</h3>
                <div className="space-y-4 text-sm">
                    <div className="flex gap-44">
                        <p className="w-[451px]">
                            Your are currently on the free plan , if you would like to speak with our sales team,
                            Contact us
                        </p>
                        <div className="flex bg-intg-bg-14">
                            <button className="px-4 py-2">Monthly</button>
                            <button className="px-4 py-2 ">Yearly</button>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        {billingDetails.map((item) => {
                            return (
                                <div className="space-y-6 rounded-xl bg-intg-bg-14 p-6">
                                    <div className="space-y-2">
                                        <p>{item.type}</p>
                                        <p className="flex items-center gap-2">
                                            <span className="text-3xl font-semibold">${item.price}</span>
                                            <span className="text-intg-text">Per user/month</span>
                                        </p>
                                        <p className="text-intg-text">{item.text}</p>
                                    </div>

                                    <button className="w-full rounded-[4px] border py-2 text-center text-white">
                                        {item.cta}
                                    </button>
                                    <div>
                                        {item.features.map((i) => (
                                            <>
                                                <hr className=" border-[1px] border-intg-bg-4" />
                                                <p className="flex space-x-3 py-4">
                                                    <span>
                                                        <Flame />
                                                    </span>
                                                    <span>{i}</span>
                                                </p>
                                            </>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
