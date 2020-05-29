// Select text inside single text-node.
export const selectInlineRange = (element, satrt, end) => {
  const range = document.createRange();
  const selection = window.getSelection();
  range.setStart(element, satrt);
  range.setEnd(element, end);
  selection.removeAllRanges();
  selection.addRange(range);
  return selection;
};


// Selects given node.
export const selectNode = node => {
  const selection = window.getSelection();
  const range = new Range();
  range.selectNode(node);
  selection.removeAllRanges();
  selection.addRange(range);
  return selection;
};

// Selects given node with extra character before and after element.
export const selectNodeExt = node => {

  // Only for block nodes;
  if (node.nodeType === 3) return;

  const selection = window.getSelection();
  const range = selection.getRangeAt(0);

  const startLength = node.previousSibling && node.previousSibling.textContent.length
    ? node.previousSibling.textContent.length - 1
    : 0;

  const endLength = node.nextSibling && node.nextSibling.textContent.length
    ? 1
    : 0;

  const startNode = node.previousSibling ? node.previousSibling : node;
  const endNode = node.nextSibling ? node.nextSibling : node;

  range.setStart(startNode, startLength);
  range.setEnd(endNode, endLength);
  selection.removeAllRanges();
  selection.addRange(range);
  return selection;
}

// Returns HTML of current selection wrapped with wrapper element.
export const selectionToHtml = (wrapper = "div") => {
  const selection = window.getSelection();
  const container = document.createElement(wrapper);
  if (!selection.isCollapsed) {
    const range = selection.getRangeAt(0);
    container.appendChild(range.cloneContents());
  }
  return container;
};