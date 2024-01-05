import {
  ChangeEvent,
  CompositionEvent,
  KeyboardEvent,
  SyntheticEvent,
  useEffect,
  useRef,
  useState,
} from "react";

import usePageListStore from "@/state/use-page-list-store";

const Content = () => {
  const [contentIndex, setContentIndex] = useState(0);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const {
    pageId,
    getCurrentPage,
    editTitle,
    editContent,
    addContentLine,
    removeContentLine,
  } = usePageListStore();
  const currentPage = getCurrentPage();

  useEffect(() => {
    focusContentEditableTextToEnd(titleRef?.current as HTMLElement);
  }, [pageId]);

  useEffect(() => {
    if (contentRef.current) {
      focusContentEditableTextToEnd(contentRef.current);
    }
  }, [contentIndex]);

  const handleTitleChange = (e: ChangeEvent<HTMLHeadingElement>) => {
    editTitle({
      value: e.currentTarget.innerText,
    });

    focusContentEditableTextToEnd(e.currentTarget);
  };

  const handleContentChange = (
    e: SyntheticEvent<HTMLDivElement, InputEvent>,
    field: string
  ) => {
    if (e.nativeEvent.isComposing) {
      return;
    }
    editContent({
      field: field,
      value: e.currentTarget.innerText,
    });
    focusContentEditableTextToEnd(e.currentTarget);
  };

  const handleCompositionEnd = (
    e: CompositionEvent<HTMLDivElement>,
    field: string
  ) => {
    editContent({
      field: field,
      value: e.currentTarget.innerText,
    });
    focusContentEditableTextToEnd(e.currentTarget);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    switch (e.key) {
      case "Enter":
        e.preventDefault();
        addContentLine(contentIndex);
        setContentIndex((prev) => prev + 1);
        contentRef.current?.focus();
        break;

      case "Backspace":
        if (
          (currentPage?.contents as any)?.length > 1 &&
          currentPage?.contents?.[contentIndex]?.text === ""
        ) {
          e.preventDefault();
          removeContentLine(contentIndex);
          setContentIndex((prev) => prev - 1);
          focusContentEditableTextToEnd(contentRef?.current as HTMLElement);
        }
        break;

      case "ArrowUp":
        if (contentIndex === 0) {
          return;
        }
        setContentIndex((prev) => prev - 1);
        focusContentEditableTextToEnd(contentRef?.current as HTMLElement);
        break;

      case "ArrowDown":
        if (contentIndex === (currentPage?.contents?.length as number) - 1) {
          return;
        }
        setContentIndex((prev) => prev + 1);
        focusContentEditableTextToEnd(contentRef?.current as HTMLElement);
        break;

      default:
        break;
    }
  };

  function focusContentEditableTextToEnd(element: HTMLElement) {
    if (element === null || element.innerText.length === 0) {
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
          onInput={(e: ChangeEvent<HTMLHeadingElement>) => handleTitleChange(e)}
        >
          {currentPage?.title}
        </h1>
      </div>

      <div className="p-1 px-2">
        {currentPage?.contents?.map((content, i) => {
          return (
            <div
              key={`${content.id}_${i}`}
              className="p-1"
              data-text="내용을 입력해주세요."
              contentEditable
              suppressContentEditableWarning
              ref={i === contentIndex ? contentRef : null}
              onInput={(e: SyntheticEvent<HTMLDivElement, InputEvent>) =>
                handleContentChange(e, content.id)
              }
              onKeyDown={(e) => handleKeyDown(e)}
              onCompositionEnd={(e) => handleCompositionEnd(e, content.id)}
              onClick={() => setContentIndex(i)}
            >
              {content.text}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Content;
