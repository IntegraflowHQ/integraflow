import { toPng } from "html-to-image";
import jsPDF from "jspdf";
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

export default function QRCodeView({ url, name }: { url: string; name: string }) {
    const id = `pdf-box-${url}`;

    const image = async () => {
        const element = document.getElementById(id);
        if (!element) return null;
        const url = await toPng(element);
        return url;
    };

    const downloadPdf = async () => {
        const img = await image();
        if (!img) return;
        const pdf = new jsPDF("portrait", "pt", "a6");
        const imgProperties = pdf.getImageProperties(img);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width;
        pdf.addImage(img, "PNG", 0, 0, pdfHeight, pdfWidth);
        pdf.save(`${name}.pdf`);
    };

    const downloadPng = async () => {
        const img = await image();
        if (!img) return;
        const link = document.createElement("a");
        link.href = img;
        link.download = `${name}.png`;
        link.click();
    };

    return (
        <div className="3xl:w-[778px] flex w-[600px] flex-col items-center gap-8 pt-8">
            <div className="3xl:p-10 rounded-[18.584px] bg-intg-bg-15 p-5" id={id}>
                <QRCode
                    value={url}
                    className="3xl:size-[397px] size-[250px] bg-transparent"
                    strokeWidth={1}
                    size={397}
                    style={{
                        height: undefined,
                        width: undefined,
                    }}
                    bgColor="#00000000"
                    fgColor="#FFFFFF"
                />
            </div>
            <div className="flex items-center justify-center gap-3">
                <button style={backgroundTextStyles} onClick={downloadPng}>
                    Download PNG
                </button>
                <button style={backgroundTextStyles} onClick={downloadPdf}>
                    Download PDF
                </button>
            </div>
        </div>
    );
}
