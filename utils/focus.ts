export function focusContentEditableTextToEnd(element: HTMLElement | null) {
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

export function focusContentEditableTextToStart(element: HTMLElement | null) {
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
