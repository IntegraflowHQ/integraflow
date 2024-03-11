import { settingsCardInfo } from "../utils";

const SettingsHome = () => {
    return (
        <div className="pb-[72px]">
            <div className="pl-[72px] pt-[80px] text-intg-text">
                <h3 className="text-xl font-semibold">Settings</h3>
                <p>Manage your worksapce settings</p>
            </div>
            <div className="py-6">
                <hr className="border border-intg-bg-4" />
            </div>
            <div className="grid grid-cols-1 gap-6 px-[72px] text-intg-text md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
                {settingsCardInfo.map((card, index) => {
                    return (
                        <div key={index} className="rounded-xl bg-intg-bg-9 p-6">
                            <img src={card.icon} alt="icon" className="h-auto" />
                            <div className="my-4">
                                <p className="text-lg font-medium text-white">{card.title}</p>
                                <p className="text-sm">{card.details}</p>
                            </div>
                            <button className="bg-gradient-button bg-clip-text text-sm text-transparent">
                                <span>Link to profile</span>
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default SettingsHome;
