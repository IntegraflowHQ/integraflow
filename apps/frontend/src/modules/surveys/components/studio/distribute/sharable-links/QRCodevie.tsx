import html2canvas from "html2canvas";
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

export default function QRCodeView({
    url,
    name,
}: {
    url: string;
    name: string;
}) {
    const id = `pdf-box-${url}`;

    const image = async () => {
        const element = document.getElementById(id);
        if (!element) return null;
        const canvas = await html2canvas(element);
        return canvas.toDataURL("image/png");
    };

    const downloadPdf = async () => {
        const img = await image();
        if (!img) return;
        const pdf = new jsPDF("portrait", "pt", "a6");
        const imgProperties = pdf.getImageProperties(img);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight =
            (imgProperties.height * pdfWidth) / imgProperties.width;
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
        <div className="flex w-[778px] flex-col items-center gap-8 pt-8">
            <div className="rounded-[18.584px] bg-intg-bg-15 p-10" id={id}>
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
