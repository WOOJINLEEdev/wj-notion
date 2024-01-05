import { KeyboardEvent, MouseEvent } from "react";
import { ChevronRightIcon } from "@heroicons/react/20/solid";
import { TrashIcon } from "@heroicons/react/24/outline";

import usePageListStore from "@/state/use-page-list-store";

const PageList = () => {
  const { pageList, pageId, deletePage, initPageId, setPageId } =
    usePageListStore();

  const handlePageDelete = (
    e: MouseEvent<HTMLButtonElement>,
    pageId: string
  ) => {
    e.stopPropagation();
    deletePage(pageId);
    initPageId();
  };

  const handlePageSelect = (pageId: string) => {
    setPageId(pageId);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLLIElement>, pageId: string) => {
    switch (e.key) {
      case "Enter":
        e.preventDefault();
        handlePageSelect(pageId);
        break;

      default:
        break;
    }
  };

  return (
    <ul>
      {pageList.map((page) => {
        return (
          <li
            role="none"
            key={`page_${page.id}`}
            tabIndex={0}
            className={`relative py-1 text-[14px] cursor-pointer rounded-md group/item hover:rounded-md hover:bg-[rgba(55,53,47,0.08)] ${
              page.id === pageId ? "bg-[rgba(0,0,0,0.12)]" : ""
            }`}
            onClick={() => handlePageSelect(page.id)}
            onKeyDown={(e) => handleKeyDown(e, page.id)}
          >
            <div className="flex items-center gap-x-2 h-[24px]">
              <ChevronRightIcon width="24" height="24" />
              <div className=" w-[calc(100%-48px)] h-full leading-6 truncate">
                {!page.title ? "제목 없음" : `${page.title}`}
              </div>
            </div>

            <button
              type="button"
              className="absolute top-[6px] right-1 flex items-center justify-center w-5 h-5 invisible group-hover/item:visible"
              onClick={(e) => handlePageDelete(e, page.id)}
            >
              <TrashIcon width="16" height="16" />
            </button>
          </li>
        );
      })}
    </ul>
  );
};

export default PageList;
