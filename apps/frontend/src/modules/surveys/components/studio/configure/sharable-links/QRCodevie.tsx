import QRCode from "qrcode.react";
import React from "react";

const backgroundTextStyles: React.CSSProperties = {
    backgroundImage: "linear-gradient(27deg, #B7A6E8 8.33%, #6941C6 91.67%)",
    color: "transparent",
    backgroundClip: "text",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    fontSize: "16px",
    fontWeight: 400,
    lineHeight: "24px",
    textAlign: "center",
    cursor: "pointer",
    padding: "12px",
};

export default function QRCodeView({ url }: { url: string }) {
    return (
        <div className="flex w-[778px] flex-col items-center gap-8 pt-8">
            <div className="rounded-[18.584px] bg-intg-bg-15 p-10">
                <QRCode
                    value={url}
                    className="bg-transparent"
                    size={397}
                    strokeWidth={1}
                    bgColor="#00000000"
                    fgColor="#FFFFFF"
                />
            </div>
            <div className="flex items-center justify-center gap-3">
                <button style={backgroundTextStyles}>Download PNG</button>
                <button style={backgroundTextStyles}>Download PDF</button>
            </div>
        </div>
    );
}
