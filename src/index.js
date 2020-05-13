import Toolbox from "./toolbox";
import oberver from "./utils/observer";
import { markdownToHtml } from "./shared/patterns";
import { unwrapNode, deleteNode } from "./shared/node";
import { selectNode, selectionToHtml } from "./shared/select";
import { parseMarkdown, extractMarkdown } from "./utils/parsers";
import { getCaretNode,  getCaretPosition, caretToStart, caretAfterNode, caretBeforeNode } from "./shared/caret";
import { debounce, chromeEolHack, transform, resetCurrentCaretStyle, attachStyle } from "./utils";

// Styles.
import createStyles from "./styles.js";

// Core.
export default function MiniEdit(selector, namespace) {

  // Attach CSS styles.
  attachStyle(createStyles(namespace));

  // Global referenes.
  let undoMode = false;
  let selectedBlock = null;

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

  // Handle CLICKS.
  content.addEventListener("click", event => {
    selectedBlock = null;

    if (event.target.dataset.noedit) {
      event.preventDefault();
      selectNode(event.target);
      selectedBlock = event.target;
      (event.ctrlKey || event.metaKey) && toolbox.open(event.target);
    }
    else if (event.target.dataset && event.target.dataset.md && (event.ctrlKey || event.metaKey)) {
      event.stopPropagation();
      toolbox.open(event.target);
    }
  });


  // Handle KEYBOARD.
  content.addEventListener("keydown", event => {

    // Remvoe selected noneditable block.
    if (selectedBlock && !event.code.includes("Arrow") && !(event.ctrlKey || event.metaKey)) {
      deleteNode(selectedBlock);
    }

    selectedBlock = null;

    // ENTER.
    if (event.code === "Enter") {
      event.preventDefault();

      const text = getCaretNode();
      const node = text.parentNode;
      // console.log(text, node);

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
    if ((event.ctrlKey || event.metaKey) && event.code === "Space") {
      const text = getCaretNode();
      const node = text.parentNode;
      const range = window.getSelection().getRangeAt(0);
      range.selectNode(node);
      document.execCommand("insertHTML", false, `${node.outerHTML} `);
      return;
    }

    // Backspace.
    if (event.code === "Backspace") {
      // const text = getCaretNode();
      const selection = window.getSelection().toString().length;

      // Code below removes text and associated styles when user selects entire
      // styled text node (e.g. strong) and removes it with Backspace key.
      if (selection > 0) {
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
      const selection = window.getSelection()
      const nonZeroSelection = selection.toString().length > 0;

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
    if (event.code === "KeyZ" && (event.ctrlKey || event.metaKey)) {
      // Do not render - allow to get back to the moment when markdown haven't been yet converted into node.
      undoMode = true;
      return;
    }

    // Display markdown code.
    if (event.code === "F2") {
      return console.log(extractMarkdown(content));
    }

    // Unwrap caret node.
    if (event.code === "F4") {
      const node = getCaretNode();
      chromeEolHack(() => {
        unwrapNode(node.parentNode);
      })
      return;
    }

    // Do not allow input text into noneditable nodes + select node.
    const node = getCaretNode();
    if (node.dataset && node.dataset.noedit) {
      event.preventDefault();

      if (event.code === "ArrowDown" || event.code === "ArrowRight") {
        caretAfterNode(node.nextSibling);
      } else if (event.code === "ArrowUp" || event.code === "ArrowLeft") {
        caretBeforeNode(node.previousSibling);
      }

      selectNode(node);
      selectedBlock = node;
    }

    // Reset UndoMode.
    undoMode = false;

    // Rnder inline markdown.
    render();
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
    }
  });
}
