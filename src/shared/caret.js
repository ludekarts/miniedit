// Caret utilities.

// Returns current text-node that contains edit caret.
export const getCaretNode = () => {
  return window.getSelection().anchorNode;
};

// Returns carret position in given node.
export const getCaretPosition = node => {
  const selection = window.getSelection();
  const range = selection.getRangeAt(0);
  const clonedRange = range.cloneRange();
  clonedRange.selectNodeContents(node);
  clonedRange.setEnd(range.endContainer, range.endOffset);
  const position = clonedRange.toString().trim().length;
  clonedRange.detach();
  return position;
};

// Insert caret at given index insinde node.
export const caretAtIndex = (node, position) => {
  const range = document.createRange();
  const selection = window.getSelection();
  range.setStart(node, position);
  range.setEnd(node, position);
  range.collapse(true);
  selection.removeAllRanges();
  selection.addRange(range);
  return selection;
};

// Places caret after given node.
export const caretAfterNode = node => {
  const range = document.createRange();
  const selection = window.getSelection();
  range.setStartAfter(node);
  range.setEndAfter(node);
  range.collapse(true);
  selection.removeAllRanges();
  selection.addRange(range);
  return selection;
};

// Places caret before given node.
export const caretBeforeNode = node => {
  const range = document.createRange();
  const selection = window.getSelection();
  range.setStartBefore(node);
  range.setEndBefore(node);
  range.collapse(true);
  selection.removeAllRanges();
  selection.addRange(range);
  return selection;
};

// Places caret at the end of given node.
export const caretToEnd = node => {
  const range = document.createRange();
  const selection = window.getSelection();
  const element = node.nodeType === 3 ? node : node.lastChild;
  range.setStart(element, element.textContent.length);
  range.setEnd(element, element.textContent.length);
  selection.removeAllRanges();
  selection.addRange(range);
  return selection;
};

// Places caret at the begining of given node.
export const caretToStart = node => {
  const range = document.createRange();
  const selection = window.getSelection();
  range.setStart(node, 0);
  range.setEnd(node, 0);
  selection.removeAllRanges();
  selection.addRange(range);
  return selection;
};
