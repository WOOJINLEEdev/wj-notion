import { PlusIcon } from "@heroicons/react/20/solid";

import usePageListStore from "@/state/use-page-list-store";

const PageAddition = () => {
  const { addPage } = usePageListStore();

  const handlePageAddition = () => {
    addPage({
      title: "",
      content: "",
    });
  };

  return (
    <div
      role="button"
      className="my-5 py-1 text-[14px] hover:rounded-md hover:bg-[rgba(55,53,47,0.08)]"
      onClick={handlePageAddition}
    >
      <div className="flex items-center gap-x-2 h-[24px]">
        <PlusIcon width="24" height="24" />
        <div className="h-full leading-6">페이지 추가</div>
      </div>
    </div>
  );
};

export default PageAddition;
