import { ThemeCard } from "./ThemeCard";

const PALETTE = ["#FF4A4A", "#FF9551", "#6FEDD6", "#B9FFF8"];
const THEMES = [
  {
    palette: ["#CCA8E9", "#C3BEF0", "#CADEFC", "#DEFCF9"],
    themeName: "Outer space",
  },
  {
    palette: ["#748DA6", "#9CB4CC", "#D3CEDF", "#F2D7D9"],
    themeName: "Tropical tone",
  },
  {
    palette: ["#EEF2E6", "#D6CDA4", "#3D8361", "#1C6758"],
    themeName: "Battle cat",
  },
  {
    palette: ["#BFACE0", "#BFACE0", "#A084CA", "#645CAA"],
    themeName: "Impressionist blue",
  },
  {
    palette: ["#7A4495", "#B270A2", "#FF8FB1", "#FCE2DB"],
    themeName: "Vanilla pudding",
  },
  {
    palette: ["#FFEEAF", "#E1FFEE", "#A5F1E9", "#7FBCD2"],
    themeName: "Azure blue",
  },
  {
    palette: ["#54BAB9", "#9ED2C6", "#E9DAC1", "#F7ECDE"],
    themeName: "Tint of rose",
  },
];

export const DesignEditorContent = () => {
  return (
    <div>
      <p className="py-4 font-light uppercase">Selected Theme</p>

      <div className="flex w-full gap-5 rounded-md bg-intg-bg-13 px-3 py-2">
        {/* color palete -- theme */}
        <div className="flex py-2">
          {PALETTE.map((color, index) => {
            return (
              <div
                className={`h-8 w-8 rounded-full border-2 ${
                  index !== 0 ? "-ml-3" : ""
                }`}
                key={index}
                style={{ backgroundColor: `${color}` }}
              />
            );
          })}
        </div>

        <div>
          <p className="font-normal leading-6">Your branded dark theme</p>
          <p className="font-normal text-intg-text-4">Fetched theme</p>
        </div>
      </div>

      {/* all themes */}
      <div className="h-full py-6">
        <p className="py-2 font-light capitalize">all themes</p>

        <button className="my-4 h-12 w-full rounded-md border border-intg-bg-2 bg-intg-bg-10">
          New theme
        </button>

        <div className="flex-col">
          {THEMES?.map((theme, index: React.Key | number | number) => {
            return <ThemeCard themeData={theme} key={index} />;
          })}
        </div>
      </div>
    </div>
  );
};
