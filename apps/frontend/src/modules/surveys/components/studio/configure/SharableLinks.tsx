import { Button, Header } from "@/ui";
import { useState } from "react";

export default function SharableLinks() {
    const [links, setLinks] = useState([]);
    return (
        <div className="h-full w-full p-2">
            {links.length ? (
                <div className="flex justify-between">
                    <Header
                        variant="2"
                        title="Sharable links"
                        font="medium"
                        description="Create survey links or QR codes to distribute your survey."
                    />
                </div>
            ) : (
                <div className="flex h-full w-full flex-col items-center justify-center">
                    <Header
                        title="Nothing to see here yet."
                        description="Create your first link!"
                    />
                    <Button
                        text="Create link"
                        className="mt-4 w-max px-[12px] py-[8px]"
                        onClick={() => {}}
                    />
                </div>
            )}
        </div>
    );
}
