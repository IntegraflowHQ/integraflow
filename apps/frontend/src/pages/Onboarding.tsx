import { useSession } from "@/modules/users/hooks/useSession";
import { Button } from "@/ui";

const Onboarding = () => {
    const { viewer, createSession } = useSession();
    return (
        <div>
            <p>Onboarding</p>
            <Button
                text="Delete viewer orgs"
                onClick={() => {
                    createSession({
                        ...viewer,
                        organizations: {
                            ...viewer?.organizations,
                            edges: [],
                        },
                        organization: undefined,
                    });
                }}
            />
        </div>
    );
};

export default Onboarding;
