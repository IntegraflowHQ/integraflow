import { Button, Header } from "@/ui";
import CalcomIcon from "assets/icons/integrations/calcom.png";
import CalendlyIcon from "assets/icons/integrations/calendly.png";
import GithubIcon from "assets/icons/integrations/github.png";
import IntercomIcon from "assets/icons/integrations/intercom.png";
import MailchimpIcon from "assets/icons/integrations/mailchimp.png";
import MixpanelIcon from "assets/icons/integrations/mixpanel.png";
import NotionIcon from "assets/icons/integrations/notion.png";
import SlackIcon from "assets/icons/integrations/slack.png";
import Container, { SwitchProps } from "./Container";

const integrations = [
    {
        name: "Slack",
        icon: SlackIcon,
        description:
            "Send survey answers to a selected Slack channel in real time",
        available: true,
    },
    {
        name: "Mixpanel",
        icon: MixpanelIcon,
        description:
            "Send survey answers to a selected Slack channel in real time",
        available: false,
    },
    {
        name: "Notion",
        icon: NotionIcon,
        description:
            "Send survey answers to a selected Slack channel in real time",
        available: false,
    },
    {
        name: "Intercom",
        icon: IntercomIcon,
        description:
            "Send survey answers to a selected Slack channel in real time",
        available: true,
    },
    {
        name: "Calendly",
        icon: CalendlyIcon,
        description:
            "Send survey answers to a selected Slack channel in real time",
        available: true,
    },
    {
        name: "Github",
        icon: GithubIcon,
        description:
            "Send survey answers to a selected Slack channel in real time",
        available: true,
    },
    {
        name: "Mailchimp",
        icon: MailchimpIcon,
        description:
            "Send survey answers to a selected Slack channel in real time",
        available: true,
    },
    {
        name: "Calcom",
        icon: CalcomIcon,
        description:
            "Send survey answers to a selected Slack channel in real time",
        available: false,
    },
];

export default function ConnectIntegration({
    onComplete,
    ...props
}: SwitchProps) {
    return (
        <Container
            title="Install your first integration"
            description="Send an identify call wherever a user signs up or logs into your product. Read the docs for more details."
            {...props}
        >
            <div className="flex w-full flex-col gap-8 pt-8">
                <div className="grid grid-cols-2 gap-2">
                    {integrations.map((integration) => (
                        <div
                            key={integration.name}
                            className="flex gap-2 rounded-lg bg-intg-bg-14 p-2"
                        >
                            <img
                                src={integration.icon}
                                alt={integration.name}
                                className="h-[16px] w-[16px]"
                            />
                            <div className="flex flex-col gap-3">
                                <Header
                                    variant="4"
                                    title={integration.name}
                                    description={integration.description}
                                    className="[&>h4]:font-medium"
                                />
                                <button className="w-max rounded bg-intg-bg-13 px-2 py-[2px] text-xs leading-[18px] text-intg-text">
                                    {integration.available
                                        ? "Install"
                                        : "Request"}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                <Button text="Continue" onClick={onComplete} />
            </div>
        </Container>
    );
}
