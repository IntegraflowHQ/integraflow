export const ProgressRadial = ({ value }: { value: number }) => {
    return (
        <div
            style={{
                width: "16px",
                height: "16px",
                borderRadius: "50%",
                background: `radial-gradient(closest-side, #272138 69%, transparent 70% 100%), conic-gradient(#8590C8 ${value}%, #C2CAF2 0)`,
            }}
        >
            <progress
                value={value}
                max="100"
                className="hidden"
            >{`${value}%`}</progress>
        </div>
    );
};
