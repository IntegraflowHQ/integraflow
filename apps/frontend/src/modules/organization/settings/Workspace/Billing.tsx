import { Button } from "@/ui";

export const Billing = () => {
    return (
        <div className="text-intg-text-4">
            <div>
                <h3>Manage Billing</h3>
                <p>
                    Manage your billing information and invoice. for question about billing Contact
                    Integraflow@gmail.com or Github
                </p>
            </div>
            <hr className="my-6 border-[1px] border-intg-bg-4" />

            <div>
                <h3>Current plan</h3>
                <div>
                    <p>You are currently on a free plan with ( Number of users)</p>
                    <Button text="View plans & upgrade" size="sm" />
                </div>
            </div>
        </div>
    );
};
