import { useProjectCreateMutation } from "@/generated/graphql";
import { useSession } from "@/modules/users/hooks/useSession";
import { Button } from "@/ui";

const Onboarding = () => {
    const { viewer, createSession } = useSession();
    const [mutate, { loading }] = useProjectCreateMutation();
    return (
        <div>
            <p>Onboarding</p>
            <Button
                text="Create project"
                onClick={() => {
                    mutate({
                        variables: {
                            input: {
                                name: "Test 1",
                            },
                        },
                        context: {
                            headers: {
                                ["Project"]: viewer?.project?.id,
                            },
                        },
                    });
                }}
            />
        </div>
    );
};

export default Onboarding;
