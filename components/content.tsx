import {
  useState,
  useEffect,
  useRef,
  CompositionEvent,
  KeyboardEvent,
  SyntheticEvent,
} from "react";
import ContentEditable from "react-contenteditable";
import { PlusIcon } from "@heroicons/react/24/outline";

import Toolbar from "@/components/toolbar";

import {
  focusContentEditableTextToEnd,
  focusContentEditableTextToStart,
} from "@/utils/focus";
import { getCursorPosition } from "@/utils/cursor";
import usePageListStore, { ContentType } from "@/state/use-page-list-store";
import useToolbarStore from "@/state/use-toolbar-store";

const Content = () => {
  const [contentCursor, setContentCursor] = useState<{
    index: number;
    direction: "start" | "end" | "none";
  }>({ index: -1, direction: "end" });

  const titleRef = useRef<HTMLHeadingElement>(null);
  const contentRef = useRef<HTMLDivElement | any>(null);

  const {
    pageId,
    getCurrentPage,
    editTitle,
    editContent,
    addContentLine,
    removeContentLine,
  } = usePageListStore();
  const currentPage = getCurrentPage();

  const { setSelectionCoordinates, bold, restore } = useToolbarStore();

  useEffect(() => {
    focusContentEditableTextToEnd(titleRef?.current as HTMLElement);
    setContentCursor({ index: -1, direction: "end" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageId]);

  useEffect(() => {
    if (contentRef.current && contentCursor.index > -1) {
      // contentRef.current?.focus();

      if (contentCursor.direction === "none") {
        return;
      }

      if (contentCursor.direction === "start") {
        focusContentEditableTextToStart(contentRef.current);
        return;
      }

      focusContentEditableTextToEnd(contentRef.current);
    }
  }, [contentCursor]);

  useEffect(() => {
    const handleMouseDown = () => {
      const selection = window.getSelection();

      if (selection && selection.rangeCount > 0 && contentRef.current) {
        const range = selection.getRangeAt(0);
        const $section = document
          .querySelector("#section")
          ?.getBoundingClientRect();
        const boundingRect = range.getBoundingClientRect();
        const selectedElementParentTagName =
          range.commonAncestorContainer.parentElement?.tagName;

        if (range?.collapsed) {
          setSelectionCoordinates({ top: 0, left: 0 });
          return;
        }

        restore();

        if (selectedElementParentTagName === "SPAN") {
          bold();
        }

        setSelectionCoordinates({
          top: Math.round(boundingRect.top - $section?.top!),
          left: Math.round(boundingRect.left - $section?.left!),
        });
      }
    };

    document.addEventListener("selectionchange", handleMouseDown);

    return () => {
      document.removeEventListener("selectionchange", handleMouseDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTitleChange = (
    e: SyntheticEvent<HTMLHeadingElement, InputEvent>
  ) => {
    if (e.nativeEvent.isComposing) {
      return;
    }
    editTitle({
      value: e.currentTarget.innerText,
    });
    focusContentEditableTextToEnd(e.currentTarget);
  };

  const handleTitleCompositionEnd = (e: CompositionEvent<HTMLDivElement>) => {
    editTitle({
      value: e.currentTarget.innerText,
    });
    focusContentEditableTextToEnd(e.currentTarget);
  };

  const handleTitleKeyDown = (e: KeyboardEvent<HTMLHeadingElement>) => {
    switch (e.key) {
      case "Enter":
        e.preventDefault();
        setContentCursor({ index: 0, direction: "end" });
        break;

      case "Tab":
        e.preventDefault();
        setContentCursor({ index: 0, direction: "end" });
        break;

      case "ArrowDown":
        e.preventDefault();
        setContentCursor({ index: 0, direction: "end" });

      default:
        break;
    }
  };

  const handleContentKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const selection = window.getSelection();

    switch (e.key) {
      case "Enter":
        e.preventDefault();
        addContentLine(contentCursor.index);
        setContentCursor((prev) => ({
          index: prev.index + 1,
          direction: "end",
        }));

        break;

      case "Backspace":
        const isFirstLine =
          contentCursor.index === 0 && currentPage?.contents?.[0]?.text === "";

        if (isFirstLine) {
          e.preventDefault();
          setContentCursor({ index: -1, direction: "end" });
          focusContentEditableTextToEnd(titleRef?.current as HTMLElement);
          return;
        }

        if (
          (currentPage?.contents as ContentType[])?.length > 1 &&
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
          focusContentEditableTextToEnd(titleRef?.current as HTMLElement);
          setContentCursor({
            index: -1,
            direction: "end",
          });
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
          focusContentEditableTextToEnd(contentRef?.current as HTMLElement);
        }
        break;

      case "ArrowRight":
        const cursorPosition = getCursorPosition(
          contentRef?.current as HTMLElement
        );

        if (
          contentCursor.index ===
          (currentPage?.contents?.length as number) - 1
        ) {
          return;
        }

        if (cursorPosition === contentRef?.current?.innerText.length) {
          e.preventDefault();
          setContentCursor((prev) => ({
            index: prev.index + 1,
            direction: "start",
          }));
        }
        break;

      case "Tab":
        if (
          contentCursor.index ===
          (currentPage?.contents?.length as number) - 1
        ) {
          return;
        }

        e.preventDefault();
        setContentCursor((prev) => ({
          index: prev.index + 1,
          direction: "end",
        }));
        focusContentEditableTextToEnd(contentRef?.current as HTMLElement);
        break;

      default:
        break;
    }
  };

  const handleAddNewLine = (index: number) => {
    addContentLine(index);
    setContentCursor(() => ({
      index: index + 1,
      direction: "end",
    }));
    contentRef.current?.focus();
  };

  return (
    <section
      id="section"
      className="relative flex flex-col gap-2 w-full max-w-[708px]"
    >
      <div className="flex flex-col-reverse h-[166px]">
        <h1
          className="content-header min-h-[54px] p-1 text-4xl hover:cursor-text"
          data-text="제목 없음"
          contentEditable
          suppressContentEditableWarning
          ref={titleRef}
          onInput={(e: SyntheticEvent<HTMLHeadingElement, InputEvent>) =>
            handleTitleChange(e)
          }
          onKeyDown={(e) => handleTitleKeyDown(e)}
          onCompositionEnd={(e) => handleTitleCompositionEnd(e)}
          onClick={() => setContentCursor({ index: -1, direction: "end" })}
        >
          {currentPage?.title}
        </h1>
      </div>

      <div className="flex flex-col gap-1">
        {currentPage?.contents?.map((content, i) => {
          return (
            <div
              key={`content_line_${content.id}_${i}`}
              className={`relative group/contentLine`}
            >
              <div
                className={`absolute top-0 left-[-28px] flex items-center h-8 invisible group-hover/contentLine:visible`}
              >
                <button
                  type="button"
                  className="flex items-center justify-center w-7 h-7 p-1 rounded hover:bg-gray-100"
                  onClick={() => handleAddNewLine(i)}
                >
                  <PlusIcon className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <ContentEditable
                className="p-1 hover:cursor-text"
                data-id={content.id}
                tabIndex={0}
                contentEditable
                suppressContentEditableWarning
                innerRef={i === contentCursor.index ? contentRef : undefined}
                html={content.text}
                onChange={(e) => {
                  editContent({
                    field: content.id,
                    value: e.target.value,
                  });
                }}
                onFocus={() => {
                  if (contentCursor.index !== i) {
                    setContentCursor({
                      index: i,
                      direction: "none",
                    });
                  }
                }}
                onKeyDown={(e) => handleContentKeyDown(e)}
              />
            </div>
          );
        })}
      </div>

      <Toolbar contentRef={contentRef} />
    </section>
  );
};

export default Content;
