import { ChangeEvent, useEffect, useRef } from "react";

import usePageListStore from "@/state/use-page-list-store";

const Content = () => {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const { pageId, getCurrentPage, editPage } = usePageListStore();
  const currentPage = getCurrentPage();

  useEffect(() => {
    focusContentEditableTextToEnd(titleRef?.current as HTMLElement);
  }, [pageId]);

  const handleInputChange = (e: ChangeEvent<HTMLElement>, field: string) => {
    editPage({
      value: e.currentTarget.innerText,
      field: field,
    });

    focusContentEditableTextToEnd(e.currentTarget);
  };

  function focusContentEditableTextToEnd(element: HTMLElement) {
    if (element.innerText.length === 0) {
      element.focus();
      return;
    }

    const selection = window.getSelection();
    const newRange = document.createRange();
    newRange.selectNodeContents(element);
    newRange.collapse(false);
    selection?.removeAllRanges();
    selection?.addRange(newRange);
  }

  return (
    <section className="flex flex-col gap-2 w-full max-w-[708px]">
      <div className="flex flex-col-reverse h-[166px]">
        <h1
          className="content-header min-h-[54px] p-1 text-4xl"
          data-text="제목 없음"
          contentEditable
          suppressContentEditableWarning
          ref={titleRef}
          onInput={(e: ChangeEvent<HTMLHeadingElement>) =>
            handleInputChange(e, "title")
          }
        >
          {currentPage?.title}
        </h1>
      </div>

      <div className="p-1 px-2">
        <div
          className="p-1"
          data-text="내용을 입력해주세요."
          contentEditable
          suppressContentEditableWarning
          ref={contentRef}
          onInput={(e: ChangeEvent<HTMLDivElement>) =>
            handleInputChange(e, "content")
          }
        >
          {currentPage?.content}
        </div>
      </div>
    </section>
  );
};

export default Content;
