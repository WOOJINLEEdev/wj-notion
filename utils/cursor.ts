export function getCursorPosition(element: HTMLElement) {
  const selection = window.getSelection() as Selection;
  const range = selection.getRangeAt(0);
  const clonedRange = range.cloneRange();
  clonedRange.selectNodeContents(element);
  clonedRange.setEnd(range.endContainer, range.endOffset);

  const cursorPosition = clonedRange.toString().length;

  return cursorPosition;
}
