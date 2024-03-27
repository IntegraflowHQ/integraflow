import { ROUTES } from "@/routes";
import { ArrowLongLeft } from "@/ui/icons/ArrowLongLeft";
import { useNavigate, useParams } from "react-router-dom";
import { settingsCardInfo } from "../../utils";
import { SettingsScreen } from "./SettingsScreen";

const SettingsHome = () => {
    const navigate = useNavigate();
    const { orgSlug, projectSlug } = useParams();

    return (
        <SettingsScreen title="Settings" showGotoPrevious={false} label="Manage your workspace settings">
            <div className="grid grid-cols-1 gap-6 px-[72px] text-intg-text md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
                {settingsCardInfo.map((card, index) => {
                    return (
                        <div key={index} className="rounded-xl bg-intg-bg-9 p-6">
                            {typeof card.icon === "string" ? (
                                <img src={card.icon} alt="icon" className="h-auto" />
                            ) : (
                                <card.icon />
                            )}

                            <div className="my-4">
                                <p className="text-lg font-medium capitalize text-white">{card.title}</p>
                                <p className="text-sm">{card.details}</p>
                            </div>
                            <button className="flex items-center bg-gradient-button bg-clip-text text-sm text-transparent hover:bg-gradient-button-hover">
                                <span
                                    className="capitalize"
                                    onClick={() =>
                                        navigate(
                                            `${ROUTES.WORKSPACE_SETTINGS}/${card.title}`
                                                .replace(":orgSlug", orgSlug!)
                                                .replace(":projectSlug", projectSlug!),
                                        )
                                    }
                                >
                                    {card.link}
                                </span>
                                <span>
                                    <ArrowLongLeft />
                                </span>
                            </button>
                        </div>
                    );
                })}
            </div>
        </SettingsScreen>
    );
};

export default SettingsHome;
