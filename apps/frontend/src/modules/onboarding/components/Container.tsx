import { OrganizationInvite } from "@/modules/organizationInvite/components/OrganizationInvite";
import { Header } from "@/ui";
import React, { useState } from "react";

export type SwitchProps = {
    onSkip?: () => void;
    onBack?: () => void;
    onComplete?: () => void;
};

export type OnboardingScreenProps = {
    title: string;
    description?: string;
    children?: React.ReactNode;
} & SwitchProps;

const backgroundTextStyles: React.CSSProperties = {
    backgroundImage: "linear-gradient(27deg, #B7A6E8 8.33%, #6941C6 91.67%)",
    color: "transparent",
    backgroundClip: "text",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    fontSize: "16px",
    fontWeight: 400,
    lineHeight: "24px",
    textAlign: "center",
    cursor: "pointer",
};

export default function Container({
    title,
    description,
    children,
    onSkip,
    onBack,
}: OnboardingScreenProps) {
    const [isAddingTeamMember, setIsAddingTeamMember] = useState(false);
    return (
        <div className="max-w-[660px] rounded-xl bg-intg-bg-9 p-12">
            {onSkip || onBack ? (
                <div className="grid grid-cols-2 pb-4">
                    {onBack && (
                        <button
                            className="flex items-center gap-2 justify-self-start text-white"
                            onClick={onBack}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 20 20"
                                fill="none"
                            >
                                <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M18.0001 9.99995C18.0001 10.1989 17.9211 10.3896 17.7804 10.5303C17.6398 10.6709 17.449 10.7499 17.2501 10.7499H4.6601L6.7601 12.6999C6.90597 12.8352 6.99213 13.0229 6.99963 13.2217C7.00713 13.4204 6.93536 13.6141 6.8001 13.7599C6.66484 13.9058 6.47717 13.992 6.27838 13.9995C6.07959 14.007 5.88597 13.9352 5.7401 13.7999L2.2401 10.5499C2.16437 10.4797 2.10396 10.3946 2.06264 10.3C2.02133 10.2054 2 10.1032 2 9.99995C2 9.89668 2.02133 9.79453 2.06264 9.69988C2.10396 9.60524 2.16437 9.52015 2.2401 9.44994L5.7401 6.19994C5.88597 6.06468 6.07959 5.99291 6.27838 6.00041C6.47717 6.00791 6.66484 6.09408 6.8001 6.23994C6.93536 6.38581 7.00713 6.57944 6.99963 6.77823C6.99213 6.97702 6.90597 7.16469 6.7601 7.29995L4.6601 9.24995H17.2501C17.449 9.24995 17.6398 9.32896 17.7804 9.46962C17.9211 9.61027 18.0001 9.80103 18.0001 9.99995Z"
                                    fill="white"
                                />
                            </svg>
                            Back
                        </button>
                    )}

                    {onSkip && (
                        <button
                            className="col-start-2 justify-self-end"
                            onClick={onSkip}
                            style={backgroundTextStyles}
                        >
                            Skip
                        </button>
                    )}
                </div>
            ) : null}

            <Header
                title={title}
                description={description}
                className="max-w-[479px]"
            />

            <div className="w-full pb-12">{children}</div>

            <p
                style={backgroundTextStyles}
                onClick={() => {
                    setIsAddingTeamMember(true);
                }}
            >
                Invite a team member to help with this step
            </p>
            <OrganizationInvite
                open={isAddingTeamMember}
                onOpenChange={(value) => setIsAddingTeamMember(value)}
            />
        </div>
    );
}
