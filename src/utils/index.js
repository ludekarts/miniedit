import { selectInlineRange } from "../shared/select";
import { getCaretNode, getCaretPosition, caretAtIndex } from "../shared/caret";

// Debounce given callback with provided delay.
export const debounce = (callback, delay) => {
  let timeout;
  return (...args) => {
    const later = () => {
      timeout = null;
      callback.apply(this, args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, delay);
  };
};

// Find given @pattern in @element (which should be a text node).
export const transform = (element, pattern, format) => {
  let match;
  if (!element) return;
  while (match = pattern.exec(element.textContent)) {
    selectInlineRange(element, match.index, pattern.lastIndex);
    document.execCommand("insertHTML", false, format(...match));
  }
};

// Revmoe and place caret in the same possition - this resets browser current caret style e.g. Bold.
export const resetCurrentCaretStyle = () => {
  const node = getCaretNode();
  caretAtIndex(node, getCaretPosition(node));
};

// Chrome hack for adding styled nodes at the end of the block elements.
export const chromeEolHack = insertCallback => {
  const node = getCaretNode();
  const eol = node.parentNode.dataset.block
    && getCaretPosition(node) === node.textContent.length
    && document.createTextNode("#");

  eol && node.parentNode.appendChild(eol);
  insertCallback();
  eol && eol.remove();
};

// Add style tag to the document.
export const attachStyle = style => {
  document.head.appendChild(
    document.createElement("style")
  ).textContent = style;
}
