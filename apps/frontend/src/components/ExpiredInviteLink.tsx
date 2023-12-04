import { Button, Header, Screen } from "@/ui";

export const ExpiredInviteLink = () => {
    return (
        <Screen>
            <div className="flex h-[calc(100%-5rem)] w-full items-center justify-between">
                <div className="m-auto space-y-6 rounded-md bg-intg-bg-4 p-6 text-center text-intg-text md:w-1/2 lg:w-1/3">
                    <Header
                        title="Invitation not found"
                        description=" If you think this is a mistake or if you have trouble
                        logging into the workspace, please contact the workspace
                        admins or Integraflow support."
                    />
                    <a className="block w-full" href="/">
                        <Button>Go back</Button>
                    </a>
                </div>
            </div>
        </Screen>
    );
};
