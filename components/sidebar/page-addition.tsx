import { KeyboardEvent } from "react";
import { PlusIcon } from "@heroicons/react/20/solid";

import usePageListStore from "@/state/use-page-list-store";

const PageAddition = () => {
  const { addPage } = usePageListStore();

  const handlePageAddition = () => {
    addPage({
      title: "",
      contents: [{ id: "content_0", text: "" }],
    });
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    switch (e.key) {
      case "Enter":
        e.preventDefault();
        handlePageAddition();
        break;

      default:
        break;
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      className="my-5 py-1 text-[14px] hover:rounded-md hover:bg-[rgba(55,53,47,0.08)]"
      onClick={handlePageAddition}
      onKeyDown={handleKeyDown}
    >
      <div className="flex items-center gap-x-2 h-[24px]">
        <PlusIcon width="24" height="24" />
        <div className="h-full leading-6">페이지 추가</div>
      </div>
    </div>
  );
};

export default PageAddition;
