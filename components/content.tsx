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
  const [contentCursor, setContentCursor] = useState<{
    index: number;
    direction: "start" | "end";
  }>({ index: -1, direction: "end" });
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
    if (contentRef.current && contentCursor.index > -1) {
      if (contentCursor.direction === "start") {
        focusContentEditableTextToStart(contentRef.current);
      } else {
        focusContentEditableTextToEnd(contentRef.current);
      }
    }
  }, [contentCursor]);

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

  const handleTitleKeyDown = (e: KeyboardEvent<HTMLHeadingElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      setContentCursor({ index: 0, direction: "end" });
    }
  };

  const handleContentKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const selection = window.getSelection();
    const range = selection?.getRangeAt(0);

    switch (e.key) {
      case "Enter":
        e.preventDefault();
        addContentLine(contentCursor.index);
        setContentCursor((prev) => ({
          index: prev.index + 1,
          direction: "end",
        }));
        contentRef.current?.focus();
        break;

      case "Backspace":
        if (
          (currentPage?.contents as any)?.length > 1 &&
          currentPage?.contents?.[contentCursor.index]?.text === ""
        ) {
          e.preventDefault();
          removeContentLine(contentCursor.index);
          setContentCursor((prev) => ({
            index: prev.index - 1,
            direction: "end",
          }));
          focusContentEditableTextToEnd(contentRef?.current as HTMLElement);
        }
        break;

      case "ArrowUp":
        if (contentCursor.index === 0) {
          return;
        }
        setContentCursor((prev) => ({
          index: prev.index - 1,
          direction: "end",
        }));
        focusContentEditableTextToEnd(contentRef?.current as HTMLElement);
        break;

      case "ArrowDown":
        if (
          contentCursor.index ===
          (currentPage?.contents?.length as number) - 1
        ) {
          return;
        }
        setContentCursor((prev) => ({
          index: prev.index + 1,
          direction: "end",
        }));
        focusContentEditableTextToEnd(contentRef?.current as HTMLElement);
        break;

      case "ArrowLeft":
        if (contentCursor.index === 0) {
          return;
        }

        if (selection?.focusOffset === 0) {
          e.preventDefault();
          setContentCursor((prev) => ({
            index: prev.index - 1,
            direction: "end",
          }));
        }
        break;

      case "ArrowRight":
        if (
          contentCursor.index ===
          (currentPage?.contents?.length as number) - 1
        ) {
          return;
        }

        if (
          range?.endContainer.textContent &&
          (range?.endOffset || 0) >= range?.endContainer.textContent.length
        ) {
          e.preventDefault();
          setContentCursor((prev) => ({
            index: prev.index + 1,
            direction: "start",
          }));
        }
        break;

      default:
        break;
    }
  };

  function focusContentEditableTextToEnd(element: HTMLElement | null) {
    if (element === null || element.innerText.length === 0) {
      element?.focus();
      return;
    }

    const selection = window.getSelection();
    const newRange = document.createRange();
    newRange.selectNodeContents(element);
    newRange.collapse(false);
    selection?.removeAllRanges();
    selection?.addRange(newRange);
  }

  function focusContentEditableTextToStart(element: HTMLElement | null) {
    if (element === null || element.innerText.length === 0) {
      element?.focus();
      return;
    }

    const selection = window.getSelection();
    const newRange = document.createRange();

    newRange.setStart(element.firstChild || element, 0);
    newRange.collapse(true);
    selection?.removeAllRanges();
    selection?.addRange(newRange);
  }

  return (
    <section className="flex flex-col gap-2 w-full max-w-[708px]">
      <div className="flex flex-col-reverse h-[166px]">
        <h1
          className="content-header min-h-[54px] p-1 text-4xl hover:cursor-text"
          data-text="제목 없음"
          contentEditable
          suppressContentEditableWarning
          ref={titleRef}
          onInput={(e: ChangeEvent<HTMLHeadingElement>) => handleTitleChange(e)}
          onKeyDown={(e) => handleTitleKeyDown(e)}
        >
          {currentPage?.title}
        </h1>
      </div>

      <div className="p-1 px-2">
        {currentPage?.contents?.map((content, i) => {
          return (
            <div
              key={`${content.id}_${i}`}
              className="p-1 hover:cursor-text"
              data-text="내용을 입력해주세요."
              tabIndex={0}
              contentEditable
              suppressContentEditableWarning
              ref={i === contentCursor.index ? contentRef : null}
              onInput={(e: SyntheticEvent<HTMLDivElement, InputEvent>) =>
                handleContentChange(e, content.id)
              }
              onKeyDown={(e) => handleContentKeyDown(e)}
              onCompositionEnd={(e) => handleCompositionEnd(e, content.id)}
              onClick={() => setContentCursor({ index: i, direction: "end" })}
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
