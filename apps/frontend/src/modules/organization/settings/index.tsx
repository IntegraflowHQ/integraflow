import { ROUTES } from "@/routes";
import { useNavigate, useParams } from "react-router-dom";
import { settingsCardInfo } from "../utils";
import { SettingsScreen } from "./SettingsScreen";

const SettingsHome = () => {
    const navigate = useNavigate();
    const { orgSlug, projectSlug } = useParams();

    return (
        <SettingsScreen title="Settings" label="Manage your workspace settings">
            <div className="grid grid-cols-1 gap-6 px-[72px] text-intg-text md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
                {settingsCardInfo.map((card, index) => {
                    return (
                        <div key={index} className="rounded-xl bg-intg-bg-9 p-6">
                            <img src={card.icon} alt="icon" className="h-auto" />
                            <div className="my-4">
                                <p className="text-lg font-medium text-white">{card.title}</p>
                                <p className="text-sm">{card.details}</p>
                            </div>
                            <button className="bg-gradient-button bg-clip-text text-sm text-transparent hover:bg-gradient-button-hover">
                                <span
                                    className="capitalize"
                                    onClick={() =>
                                        navigate(
                                            `${ROUTES.WORKSPACE_SETTINGS_PROFILE}`
                                                .replace(":orgSlug", orgSlug!)
                                                .replace(":projectSlug", projectSlug!),
                                        )
                                    }
                                >
                                    {card.link}
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
