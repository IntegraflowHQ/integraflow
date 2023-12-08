import { CirclePlusIcon, DocumentPlusIcon } from "@/ui/icons";

export const UpdateQuestionsEditor = () => {
  return (
    <div className="flex gap-4">
      <button className="flex h-10 gap-2 rounded-sm bg-intg-bg-10 px-4 py-2 text-center text-white">
        <div style={{ marginTop: "1.5px" }}>
          <CirclePlusIcon />
        </div>
        Add your first question
      </button>

      <button
        className="flex h-10 gap-2 rounded-sm border-intg-bg-2 bg-intg-bg-12 px-4 py-2 text-center text-white"
        style={{ border: "1px solid #53389e" }}
      >
        <DocumentPlusIcon />
        Add question from library
      </button>
    </div>
  );
};
