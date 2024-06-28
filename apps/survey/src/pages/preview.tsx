import dynamic from "next/dynamic";

const Preview = dynamic(() => Promise.resolve(import("@/components/Preview")), {
    ssr: false
});

export default function Page() {
    return <Preview />;
}
