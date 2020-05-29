import { getCaretNode, getCaretPosition } from "../shared/caret";

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

// Chrome hack for adding styled nodes at the end of the block elements.
export const stickToEol = insertCallback => {
  const node = getCaretNode();
  const eol = node.parentNode.dataset.block
    && getCaretPosition(node) === node.textContent.length
    && document.createTextNode("#");
  if (eol) {
    node.parentNode.appendChild(eol);
    insertCallback();
    eol.remove();
  } else {
    insertCallback();
  }
};

