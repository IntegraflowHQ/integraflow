import { Preview } from "./preview-panel";

export default function UpdateQuestion() {
  return (
    <div className="flex flex-1 gap-[38px] pb-8 pl-5 pr-12 pt-6">
      <div className="scrollbar-hide w-[471px]  space-y-4 overflow-y-scroll  pt-2">
        edit
      </div>
      <Preview />
    </div>
  );
}
