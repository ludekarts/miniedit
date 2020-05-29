import Toolbox from "./toolbox";
import oberver from "./utils/observer";
import { debounce, stickToEol } from "./utils";
import { markdownToHtml } from "./shared/patterns";
import { attachStyle } from "@ludekarts/utility-belt";
import { parseMarkdown, extractMarkdown } from "./utils/parsers";
import { selectNode, selectionToHtml, selectNodeExt, selectInlineRange } from "./shared/select";
import { getCaretNode, getCaretPosition, caretToStart, caretAfterNode, caretBeforeNode } from "./shared/caret";

// Styles.
import createStyles from "./styles.js";

// Core.
export default function MiniEdit(selector, { namespace = "", focus = false }) {

  // Setup workspace.
  const content = setupEnvironment(selector, namespace, focus);

  // Initialize inline toolboxes.
  const toolbox = Toolbox(content);

  // Globals.
  let undoMode = false;
  let selectedBlock = null;
  let selectionMenuLock = false;

  // Render after each keyboard sequence.
  const render = debounce(() => {
    const text = getCaretNode();
    stickToEol(() => {
      markdownToHtml.forEach(
        pattern => parseInlineMarkdown(text, pattern.match, pattern.format),
      );
    });
  }, 300);


  // Handle KEYBOARD.
  content.addEventListener("keydown", event => {

    // Current selection length.
    const selectionLength = window.getSelection().toString().length;

    // Handle non-editable nodes.
    const node = getCaretNode();
    if (node.dataset && node.dataset.noedit) {
      event.preventDefault();
      if (isTextKey(event)) {
        document.execCommand("insertHTML", false, "");
        selectedBlock = null;
      } else {
        selectNodeExt(node);
        selectedBlock = node;
      }
      return;
    }

    // ---- Enter ----------------

    if (event.code === "Enter") {
      event.preventDefault();
      const text = getCaretNode();
      const node = text.parentNode;

      // Prevent from breaking non-text nodes.
      if (node.dataset.md) {
        getCaretPosition(text) === 0
          // If carret at the begining insert enter before node.
          ? caretBeforeNode(node.previousSibling)
          // Insert enter after node.
          : caretAfterNode(node);
      }

      // Insert custom Line Break
      document.execCommand("insertHTML", false, `<br data-md="nl"/>&#8203;`);
      return;
    }


     // ---- Ctrl + Space ----------------

     if (event.code === "Space" && (event.ctrlKey || event.metaKey)) {
      const text = getCaretNode();
      const node = text.parentNode;
      const range = window.getSelection().getRangeAt(0);
      range.selectNode(node);
      document.execCommand("insertHTML", false, `${node.outerHTML} `);
      return;
    }


    // ---- Backspace ----------------

    if (event.code === "Backspace") {

      const text = getCaretNode();

      // Removes text and associated styles when user selects entire
      // styled text node (e.g. strong) and removes it with Backspace key.
      if (selectionLength > 0) {
        event.preventDefault();
        document.execCommand("insertHTML", false, "");
        return;
      }

      // Fix for bug in Chrome when user removes content of styled element and stops right after fist letter.
      // Chrome remove node but if any (excepn Backspace) key is pressed browser applies <span> with mimic styles.
      if (!selectionLength && text.textContent.length === 1) {
        event.preventDefault();
        selectNode(text);
        document.execCommand("insertHTML", false, "");
        return;
      }

      return;
    }

    // ---- Delete ----------------

    if (event.code === "Delete") {

      const text = getCaretNode();
      const nonZeroSelection = selectionLength > 0;

      // Code below removes text and associated styles when user selects entire
      // styled text node (e.g. strong) and removes it with Delete key.
      if (nonZeroSelection) {
        event.preventDefault();
        document.execCommand("insertHTML", false, "");
        return;
      }

      // Fix for bug in Chrome when user removes content of styled element and stops right after fist letter.
      // Chrome remove node but if any (excepn Delete) key is pressed browser applies <span> with mimic styles.
      if (!selectionLength && text.textContent.length === 1) {
        event.preventDefault();
        selectNode(text);
        document.execCommand("insertHTML", false, "");
        return;
      }

      // Smooth transition between nodes when using Delete.
      if (getCaretPosition(text) === text.textContent.length) {
        event.preventDefault();
        const next = findNextEditable(text.parentNode);
        text !== content && caretToStart(next);
      }
      return;
    }

    // Block browser's Ctrl + B nad Ctrl + I shortcuts.
    if ((event.code === "KeyB" || event.code === "KeyI") && (event.ctrlKey || event.metaKey) && !event.shiftKey) {
      return event.preventDefault();
    }

    // Ctrl + Z - allows preform cleanup after unwrap action.
    if (event.code === "KeyZ" && (event.ctrlKey || event.metaKey)) {
      undoMode = true;
      return;
    }

    // Display markdown code.
    if (event.code === "F2") {
      return console.log(extractMarkdown(content));
    }


    // ---- Reset UndoMode ----------------

    undoMode = false;


    // ---- Redner content ----------------

    isTextKey(event) && render();
  });


  // ---- Prevent Drag & Drop ----------------

  content.addEventListener("drag", event => {
    event.preventDefault();
  });

  content.addEventListener("dragover", event => {
    event.preventDefault();
  });

  // ---- CLipboard ----------------

  content.addEventListener("copy", event => {
    event.preventDefault();
    event.clipboardData.setData("text/plain", extractMarkdown(selectionToHtml()));
  });

  content.addEventListener("cut", event => {
    event.preventDefault();
    event.clipboardData.setData("text/plain", extractMarkdown(selectionToHtml()));
    document.execCommand("insertHTML", false, "");
  });

  content.addEventListener("paste", event => {
    event.preventDefault();
    const node = getCaretNode();

    if (node !== content && !node.parentNode.dataset.block) {
      // Do not allow for pasting formated content into inline nodes.
      const container = document.createElement("div");
      container.innerHTML = parseMarkdown(event.clipboardData.getData("text/plain"));
      document.execCommand("insertHTML", false, container.textContent);
    } else {
      // Paste formatted content.
      stickToEol(() => {
        document.execCommand("insertHTML", false, parseMarkdown(
          event.clipboardData.getData("text/plain")
        ));
      });
    }
  });


  // ---- Toolbox ----------------

  content.addEventListener("mousedown", event => {
    // Activate text selection-toolbox.
    if (event.altKey && window.getSelection().toString().length) {
      selectionMenuLock = true;
      toolbox.selection();
      event.preventDefault();
    }
  });


  // ---- Clicks ----------------

  content.addEventListener("click", event => {
    selectedBlock = null;

    // Allow selection-toolbox to be use inside other elements and to no be close when selecting pure text.
    if (!selectionMenuLock) {
      // Handle ckicks on non-editabe elments.
      if (event.target.dataset.noedit) {
        event.preventDefault();
        selectNodeExt(event.target);
        selectedBlock = event.target;
        event.altKey && toolbox.open(event.target);
        return;
      }

      // Show dedicated toolbox.
      if (event.altKey && event.target.dataset && event.target.dataset.md) {
        event.stopPropagation();
        toolbox.open(event.target);
        return;
      }

      toolbox.close();
    }

    selectionMenuLock = false;
  });

  // DOM clenup.
  oberver(content, addedNode => {
    // Remove artefacts after custom empty line brake.
    if (/^\u200B/g.test(addedNode.textContent)) {
      addedNode.remove();
      return;
    }

    // Remove artefacts after undo unwrapNode.
    if (/^\uFEFF/g.test(addedNode.textContent) && undoMode) {
      addedNode.remove();
      return;
    }
  });


  // ---- API ----------------

  return Object.freeze({
    setText: text => {
      content.innerHTML = parseMarkdown(text);
    },

    insertText: text => {
      stickToEol(() => {
        document.execCommand("insertHTML", false, parseMarkdown(text));
      });
    },

    getText: () => {
      return extractMarkdown(content);
    },

  });
}


// ---- HELPERS ----------------

function setupEnvironment(selector, namespace, focus) {
   // Attach CSS styles.
   attachStyle(createStyles(namespace));

   // Set main content container.
   const content = selector instanceof HTMLElement
     ? selector
     : document.querySelector(selector);

   content.dataset.block = "true";
   content.dataset.miniedit = "🧱";
   content.setAttribute("contenteditable", true);
   focus && content.focus();

   return content;
}

function isTextKey(event) {
  return !(event.altKey || event.ctrlKey || /(arrow|home|end|page)/ig.test(event.code));
}

// Parse markdown in single text node.
function parseInlineMarkdown(element, pattern, format) {
  let match;
  if (!element) return;
  while (match = pattern.exec(element.textContent)) {
    selectInlineRange(element, match.index, pattern.lastIndex);
    document.execCommand("insertHTML", false, format(...match));
  }
}

// Find next editable element (sibling).
function findNextEditable(node) {
  let nextNode = node;
  let parent = node.parentNode;
  let nodeIndex = indexOf(parent.childNodes, node) + 1;
  let stopIndex = parent.childNodes.length;
  while(nodeIndex < stopIndex && nextNode) {
    nextNode = parent.childNodes[nodeIndex];
    if (!nextNode.dataset || nextNode.dataset.md !== "nl") {
      return nextNode;
    } else {
      nodeIndex++;
    }
  }
  return nextNode;
}

// Index of item in array-like structure.
function indexOf(structure, item) {
  return Array.prototype.indexOf.call(structure, item);
}