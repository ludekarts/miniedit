import Toolbox from "./toolbox";
import oberver from "./utils/observer";
import { deleteNode } from "./shared/node";
import { markdownToHtml } from "./shared/patterns";
import { selectNode, selectionToHtml } from "./shared/select";
import { parseMarkdown, extractMarkdown } from "./utils/parsers";
import { debounce, chromeEolHack, transform, resetCurrentCaretStyle, attachStyle } from "./utils";
import { getCaretNode, getCaretPosition, caretToStart, caretAfterNode, caretBeforeNode } from "./shared/caret";

// Styles.
import createStyles from "./styles.js";

// Core.
export default function MiniEdit(selector, namespace) {

  // Attach CSS styles.
  attachStyle(createStyles(namespace));

  // Global referenes.
  let undoMode = false;
  let selectedBlock = null;
  let selectionMenuLock = false;

  // Set main content container.
  let content = selector instanceof HTMLElement
    ? selector
    : document.querySelector(selector);

  content.dataset.block = "true";
  content.dataset.miniedit = "🧱";
  content.setAttribute("contenteditable", true);
  content.focus();

  // Initialize inline toolboxes.
  const toolbox = Toolbox(content);

  // Render after each keyboard sequence.
  const render = debounce(() => {
    const text = getCaretNode();
    chromeEolHack(() => {
      markdownToHtml.forEach(
        pattern => transform(text, pattern.match, pattern.format),
      );
    });
  }, 300);


  // Activate text selection-toolbox.
  content.addEventListener("mousedown", event => {
    // Show select toolbox.
    if (event.altKey && window.getSelection().toString().length) {
      selectionMenuLock = true;
      toolbox.selection();
      event.preventDefault();
    }
  });


  // Handle Clicks.
  content.addEventListener("click", event => {
    selectedBlock = null;

    // Allow selection-toolbox to be use inside other elements and to no be close when selecting pure text.
    if (!selectionMenuLock) {
      // Handle ckicks on non-editabe elments.
      if (event.target.dataset.noedit) {
        event.preventDefault();
        selectNode(event.target);
        selectedBlock = event.target;
        event.altKey && toolbox.open(event.target);
        return;
      // Show dedicated toolbox.
      } else if (event.target.dataset && event.target.dataset.md && event.altKey /*event.altKey */) {
        event.stopPropagation();
        toolbox.open(event.target);
        return;
      }
      toolbox.close();
    }

    selectionMenuLock = false;
  });


  // Handle KEYBOARD.
  content.addEventListener("keydown", event => {

    // Current selection length.
    const selectionLength = window.getSelection().toString().length;

    // Remvoe selected noneditable block - fix for <figure>s not being removed form the DOM.
    if (selectedBlock && !event.code.includes("Arrow") && !(event.ctrlKey || event.shiftKey || event.altKey)) {
      deleteNode(selectedBlock);
    }

    selectedBlock = null;

    // ENTER.
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

    // Ctrl/Command + Space.
    if (event.altKey  && event.code === "Space") {
      const text = getCaretNode();
      const node = text.parentNode;
      const range = window.getSelection().getRangeAt(0);
      range.selectNode(node);
      document.execCommand("insertHTML", false, `${node.outerHTML} `);
      return;
    }

    // Backspace.
    if (event.code === "Backspace") {
      // Code below removes text and associated styles when user selects entire
      // styled text node (e.g. strong) and removes it with Backspace key.
      if (selectionLength > 0) {
        event.preventDefault();
        document.execCommand("delete");
        resetCurrentCaretStyle();
        return;
      }
      return;
    }

    // Delete.
    if (event.code === "Delete") {

      const text = getCaretNode();
      const nonZeroSelection = selectionLength > 0;

      // Code below removes text and associated styles when user selects entire
      // styled text node (e.g. strong) and removes it with Delete key.
      if (nonZeroSelection) {
        event.preventDefault();
        document.execCommand("delete");
        resetCurrentCaretStyle();
        return;
      }

      // At the END of text node.
      if (getCaretPosition(text) === text.textContent.length) {
        // Do not merge node styles when using Backspace.
        if (text.nextElementSibling && text.nextElementSibling.dataset.block) {
          event.preventDefault();
          caretToStart(text.nextElementSibling);
        }
      }
      return;
    }

    // Ctrl + Z.
    if (event.code === "KeyZ" && event.altKey ) {
      // Do not render - allow to get back to the moment when markdown haven't been yet converted into node.
      undoMode = true;
      return;
    }

    if (event.altKey  && (event.code === "KeyB" || event.code === "KeyI") && !event.shiftKey) {
      return event.preventDefault();
    }

    // Display markdown code.
    if (event.code === "F2") {
      return console.log(extractMarkdown(content));
    }

    // Do not allow input text into noneditable nodes + select node.
    const node = getCaretNode();
    if (node.dataset && node.dataset.noedit && selectionLength === 0) {
      event.preventDefault();
      selectNode(node);

      if (event.code === "ArrowDown" || event.code === "ArrowRight") {
        node.nextSibling && caretAfterNode(node.nextSibling);
      } else if (event.code === "ArrowUp" || event.code === "ArrowLeft") {
        node.previousSibling && caretBeforeNode(node.previousSibling);
      }

      selectedBlock = node;
    }

    // Reset UndoMode.
    undoMode = false;

    // Rnder inline markdown.
    // console.log(event.code);

    !(event.ctrlKey || event.shiftKey || event.code.includes("Arrow")) && render() ;

  });

  // Prevent Drag & Drop.
  content.addEventListener("drag", event => {
    event.preventDefault();
  });

  content.addEventListener("dragover", event => {
    event.preventDefault();
  })

  // CLIPBOARD.
  content.addEventListener("copy", event => {
    event.preventDefault();
    event.clipboardData.setData("text/plain", extractMarkdown(selectionToHtml()));
  });

  content.addEventListener("cut", event => {
    event.preventDefault();
    event.clipboardData.setData("text/plain", extractMarkdown(selectionToHtml()));
    document.execCommand("delete");
  });

  content.addEventListener("paste", event => {
    event.preventDefault();
    const node = getCaretNode();

    if (node !== content && !node.parentNode.dataset.block) {
      // Do not allow for pasting formatted content into inline nodes.
      const container = document.createElement("div");
      container.innerHTML = parseMarkdown(event.clipboardData.getData("text/plain"));
      document.execCommand("insertHTML", false, container.textContent);
    } else {
      // Paste formatted content.
      chromeEolHack(() => {
        document.execCommand("insertHTML", false, parseMarkdown(
          event.clipboardData.getData("text/plain")
        ));
      });
    }
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
      chromeEolHack(() => {
        document.execCommand("insertHTML", false, parseMarkdown(text));
      });
    },

    getText: () => {
      return extractMarkdown(content);
    },

    extend: ({name, type, match, format, extract}) => {
      // TO DO: Enable extending markup.
    },

  });
}
