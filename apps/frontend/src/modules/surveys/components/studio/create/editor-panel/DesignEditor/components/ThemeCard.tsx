interface cardProps {
  themeData: { palette: string[]; themeName: string };
}

export const ThemeCard = ({ themeData: { themeName, palette } }: cardProps) => {
  return (
    <div className="my-3 mb-2 flex w-full gap-5 rounded-md bg-intg-bg-13 px-3 py-2">
      {/* color palete -- theme */}
      <div className="flex py-2">
        {palette.map((color, index) => {
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
        <p className="font-normal leading-6 ">{themeName}</p>
        <p className="font-normal text-intg-text-4">Fetched theme</p>
      </div>
    </div>
  );
};
