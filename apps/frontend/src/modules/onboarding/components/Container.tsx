import { WorkspaceInvite } from "@/modules/workspace/components/invite/WorkspaceInvite";
import { Header } from "@/ui";
import { MoveLeft } from "lucide-react";
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

export default function Container({ title, description, children, onSkip, onBack }: OnboardingScreenProps) {
    const [isAddingTeamMember, setIsAddingTeamMember] = useState(false);
    return (
        <div className="max-w-[660px] rounded-xl bg-intg-bg-9 p-12">
            {onSkip || onBack ? (
                <div className="grid grid-cols-2 pb-4">
                    {onBack && (
                        <button className="flex items-center gap-2 justify-self-start text-white" onClick={onBack}>
                            <MoveLeft />
                            Back
                        </button>
                    )}

                    {onSkip && (
                        <button className="col-start-2 justify-self-end" onClick={onSkip} style={backgroundTextStyles}>
                            Skip
                        </button>
                    )}
                </div>
            ) : null}

            <Header title={title} description={description} className="max-w-[479px]" />

            <div className="w-full pb-12">{children}</div>

            <p
                style={backgroundTextStyles}
                onClick={() => {
                    setIsAddingTeamMember(true);
                }}
            >
                Invite a team member to help with this step
            </p>
            <WorkspaceInvite open={isAddingTeamMember} onOpenChange={(value) => setIsAddingTeamMember(value)} />
        </div>
    );
}
