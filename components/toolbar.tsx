import { MouseEvent, RefObject, useEffect, useState } from "react";

import usePageListStore from "@/state/use-page-list-store";
import useToolbarStore from "@/state/use-toolbar-store";

interface ToolbarProps {
  contentRef: RefObject<HTMLElement>;
}

const Toolbar = ({ contentRef }: ToolbarProps) => {
  const { selectionCoordinates, isBold, boldToggle } = useToolbarStore();
  const { editContent } = usePageListStore();
  const isVisible =
    selectionCoordinates.left > 0 && selectionCoordinates.top > 0;

  const handleToggleBold = (e: MouseEvent<HTMLButtonElement>) => {
    const selection = window.getSelection();
    const range = selection?.getRangeAt(0) as Range;
    const selectedTextLength = range?.toString().length as number;
    const startOffset = range?.startOffset;
    const endOffset = range?.endOffset;

    removeEmptyTextNodes(contentRef.current as HTMLElement);

    // 선택한 글자가 span 안에 있을 때, 첫글자와 마지막 글자를 제외한 글자를 선택한 경우
    if (
      range?.startContainer.parentElement?.nodeName === "SPAN" &&
      startOffset !== 0 &&
      endOffset !== range?.commonAncestorContainer.textContent?.length
    ) {
      const notBoldText = range?.commonAncestorContainer.textContent?.slice(
        startOffset,
        endOffset
      );
      const firstBoldText = range?.commonAncestorContainer.textContent?.slice(
        0,
        startOffset
      );
      const SecondBoldText =
        range?.commonAncestorContainer.textContent?.slice(endOffset);

      console.log("notBoldText", notBoldText);
      console.log("firstBoldText", firstBoldText);
      console.log("SecondBoldText", SecondBoldText);
    }

    // 선택한 글자가 span 안에 있을 때, 첫글자부터 마지막 글자 앞까지 선택한 경우
    if (
      range?.startContainer.parentElement?.nodeName === "SPAN" &&
      selectedTextLength >= 1 &&
      startOffset === 0 &&
      endOffset !== range?.commonAncestorContainer.textContent?.length
    ) {
      const notBoldText = range?.commonAncestorContainer.textContent?.slice(
        startOffset,
        endOffset
      );
      const boldText =
        range?.commonAncestorContainer.textContent?.slice(endOffset);

      if (
        range?.commonAncestorContainer.parentNode?.previousSibling?.nodeName ===
        "#text"
      ) {
        range.commonAncestorContainer.parentNode.previousSibling.textContent =
          range.commonAncestorContainer.parentNode?.previousSibling.textContent!.concat(
            range.toString()
          );
        range.deleteContents();
      }
      if (
        range?.commonAncestorContainer.parentNode?.previousSibling?.nodeName ===
        "SPAN"
      ) {
        range.deleteContents();
        selection?.removeRange(range);
        range.insertNode(document.createTextNode(range.toString()));
      }

      editContent({
        field: contentRef.current?.dataset.id ?? "",
        value: contentRef.current?.innerHTML ?? "",
      });
      return;
    }

    // 선택한 글자가 span 안에 있을 때, 첫글자를 제외하고 마지막 글자까지 선택한 경우
    if (
      range?.startContainer.parentElement?.nodeName === "SPAN" &&
      startOffset !== 0 &&
      endOffset === range?.commonAncestorContainer.textContent?.length
    ) {
      const notBoldText = range?.commonAncestorContainer.textContent?.slice(
        startOffset,
        endOffset
      ) as string;
      const boldText = range?.commonAncestorContainer.textContent?.slice(
        0,
        startOffset
      ) as string;

      const selectedText = range?.toString();
      const nodeList = Object.values(
        contentRef.current?.childNodes as Object
      ).map((node, i) => {
        if (node.nodeName === "#text" && node.textContent.length === 0) return;
        if (
          node.nodeName === "SPAN" &&
          node.textContent.includes(selectedText)
        ) {
          node.nextSibling.textContent = selectedText?.concat(
            "",
            node.nextSibling.textContent
          );
          range?.deleteContents();
        }
      });

      editContent({
        field: contentRef.current?.dataset.id ?? "",
        value: contentRef.current?.innerHTML ?? "",
      });
      return;
    }

    if (selection) {
      const isAlreadyWrapped =
        range?.commonAncestorContainer.parentElement?.nodeName === "SPAN";

      // span이 있으면 span을 없애고, 없으면 span을 만든다.
      if (isAlreadyWrapped) {
        const selectedText = range?.toString();

        if (
          range.startOffset !== 0 &&
          range.endOffset !== range.commonAncestorContainer.textContent?.length
        ) {
          const firstText = range.commonAncestorContainer.textContent?.slice(
            0,
            range.startOffset
          );
          const secondText = range.commonAncestorContainer.textContent?.slice(
            range.endOffset,
            range.commonAncestorContainer.textContent?.length
          );
          const notBoldText = document.createTextNode(selectedText);

          const firstSpan = document.createElement("span");
          const secondSpan = document.createElement("span");
          firstSpan.style.fontWeight = "bold";
          firstSpan.innerHTML = firstText as string;

          secondSpan.style.fontWeight = "bold";
          secondSpan.innerHTML = secondText as string;

          range.deleteContents();
          selection.removeRange(range);
          range.commonAncestorContainer.parentElement.remove();
          range.insertNode(secondSpan);
          range.insertNode(notBoldText);
          range.insertNode(firstSpan);
        }

        // 선택한 글자가 span 안에 있을 때, 선택한 글자 뒤에 글자(textnode)가 있는 경우
        if (
          range.commonAncestorContainer.parentNode?.previousSibling
            ?.textContent === "" &&
          range.commonAncestorContainer.parentNode?.nextSibling &&
          range.commonAncestorContainer.parentNode?.nextSibling?.nodeName ===
            "#text"
        ) {
          range.commonAncestorContainer.parentNode.nextSibling.textContent =
            selectedText?.concat(
              "",
              range.commonAncestorContainer.parentNode?.nextSibling.textContent!
            );
          range.commonAncestorContainer.parentElement.remove();
          // contentRef.current?.removeChild(
          //   range.commonAncestorContainer.parentNode as Node
          // );
        }

        // 선택한 글자가 span 안에 있을 때, 한 글자 선택했을 때
        if (selectedText.length === 1) {
          // span에 한글자가 있고 그것을 선택했을 때
          if (range.commonAncestorContainer.textContent?.length === 1) {
            if (
              range.commonAncestorContainer.parentNode?.previousSibling &&
              (!range.commonAncestorContainer.parentNode?.nextSibling ||
                range.commonAncestorContainer.parentNode?.nextSibling
                  ?.textContent === "")
            ) {
              if (range.commonAncestorContainer.parentNode?.previousSibling) {
                range.commonAncestorContainer.parentNode.previousSibling.textContent =
                  range.commonAncestorContainer.parentNode?.previousSibling.textContent!.concat(
                    selectedText
                  );

                range.commonAncestorContainer.parentElement.remove();
              }
            }
          }

          // 선택한 글자 앞에 글자가 없을때
          if (
            (range.startOffset === 0 &&
              range.endOffset === 1 &&
              !range.commonAncestorContainer.parentNode?.previousSibling) ||
            range.commonAncestorContainer.parentNode?.previousSibling
              ?.textContent === ""
          ) {
            // 선택한 글자 다음에 글자가 있을 때(빈 string이 아닐 때)
            if (
              range.commonAncestorContainer.parentNode?.nextSibling &&
              range.commonAncestorContainer.parentNode.nextSibling
                ?.textContent !== ""
            ) {
              range.commonAncestorContainer.parentNode.nextSibling.textContent! =
                selectedText?.concat(
                  "",
                  range.commonAncestorContainer.parentNode?.nextSibling
                    .textContent!
                );

              contentRef.current?.removeChild(
                range.commonAncestorContainer.parentNode as Node
              );
            }
          }

          // 선택한 글자가 span 안에 있을 때, 선택한 글자 뒤에 글자가 없을 때 (또는 뒤에 textnode가 존재하고 빈 string일 때)
          if (
            selectedText.length !==
              range.commonAncestorContainer.textContent?.length &&
            range.commonAncestorContainer.parentNode?.previousSibling &&
            (!range.commonAncestorContainer.parentNode?.nextSibling ||
              range.commonAncestorContainer.parentNode?.nextSibling
                ?.textContent === "")
          ) {
            if (range.commonAncestorContainer.parentNode?.previousSibling) {
              range.commonAncestorContainer.parentNode.previousSibling.textContent =
                range.commonAncestorContainer.parentNode?.previousSibling.textContent!.concat(
                  selectedText
                );

              // range.commonAncestorContainer.parentElement.remove();
              contentRef.current?.removeChild(
                range.commonAncestorContainer.parentNode as Node
              );
            }
          }
        }

        //
        if (
          range.commonAncestorContainer.parentNode?.previousSibling
            ?.textContent !== "" &&
          range.commonAncestorContainer.parentNode?.previousSibling
            ?.nodeName === "#text" &&
          range.commonAncestorContainer.parentNode?.nextSibling?.textContent !==
            "" &&
          range.commonAncestorContainer.parentNode?.nextSibling?.nodeName ===
            "#text"
        ) {
          range.commonAncestorContainer.parentNode.previousSibling.textContent =
            range.commonAncestorContainer.parentNode?.previousSibling.textContent!.concat(
              selectedText,
              range.commonAncestorContainer.parentNode?.nextSibling.textContent!
            );
          range.commonAncestorContainer.parentNode.nextSibling.remove();
          contentRef.current?.removeChild(
            range.commonAncestorContainer.parentNode as Node
          );
        }

        if (
          range.commonAncestorContainer.parentNode?.previousSibling
            ?.textContent !== "" &&
          range.commonAncestorContainer.parentNode?.previousSibling
            ?.nodeName === "#text" &&
          range.commonAncestorContainer.parentNode?.nextSibling?.nodeName ===
            "SPAN"
        ) {
          range.commonAncestorContainer.parentNode.previousSibling.textContent =
            range.commonAncestorContainer.parentNode?.previousSibling.textContent!.concat(
              "",
              selectedText
            );
          contentRef.current?.removeChild(
            range.commonAncestorContainer.parentNode as Node
          );
        }
      } else {
        console.log("span이 없습니다.");
        const span = document.createElement("span");
        span.style.fontWeight = "bold";
        span.innerHTML = range.toString();
        range.deleteContents();
        selection.removeRange(range);
        range.insertNode(span);
      }

      editContent({
        field: contentRef.current?.dataset.id ?? "",
        value: contentRef.current?.innerHTML ?? "",
      });
      boldToggle();
    }
  };

  const handleItalicToggle = () => {
    alert("Italic은 아직 지원하지 않습니다.");
  };

  function removeEmptyTextNodes(parentNode: HTMLElement) {
    for (let i = parentNode.childNodes.length - 1; i >= 0; i--) {
      const childNode = parentNode.childNodes[i];

      if (
        childNode.nodeType === 3 &&
        (childNode as Text).textContent?.trim() === ""
      ) {
        parentNode.removeChild(childNode);
      } else if (childNode.nodeType === 1) {
        removeEmptyTextNodes(childNode as HTMLElement);
      }
    }
  }

  return (
    <div
      className={`absolute top-[${selectionCoordinates.top}] left-[${
        selectionCoordinates.left
      }] transition-opacity duration-500 ${
        isVisible ? "opacity-100 delay-300" : "invisible opacity-0"
      }`}
      style={{
        top: selectionCoordinates.top - 35,
        left: selectionCoordinates.left - 10,
      }}
    >
      <div
        className="flex bg-white rounded-md text-sm"
        style={{
          boxShadow:
            "rgba(15, 15, 15, 0.05) 0px 0px 0px 1px, rgba(15, 15, 15, 0.1) 0px 3px 6px, rgba(15, 15, 15, 0.2) 0px 9px 24px",
        }}
      >
        <button
          type="button"
          aria-label="bold"
          className={`min-w-[30px] p-1 text-center ${
            isBold ? "text-blue-500" : "text-black"
          } border-r border-[rgba(55, 53, 47, 0.09)] font-semibold hover:bg-gray-100 hover:rounded-l-md`}
          onClick={(e) => handleToggleBold(e)}
        >
          B
        </button>
        <button
          type="button"
          aria-label="italic"
          className="min-w-[30px] p-1 text-center font-semibold italic hover:bg-gray-100 hover:rounded-r-md"
          onClick={handleItalicToggle}
        >
          i
        </button>
      </div>
    </div>
  );
};

export default Toolbar;
