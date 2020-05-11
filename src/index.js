import { unwrapNode, deleteNode } from "./shared/node";
import { selectNode, selectionToHtml } from "./shared/select";
import { getCaretNode,  getCaretPosition, caretToStart, caretAfterNode } from "./shared/caret";
import { markdownToHtml } from "./shared/patterns";
import Toolbox from "./toolbox";
import oberver from "./utils/observer";
import { parseMarkdown, extractMarkdown } from "./utils/parsers";
import { debounce, chromeEolHack, transform, resetCurrentCaretStyle, attachStyle } from "./utils";

import styles from "./styles.js";
attachStyle(styles);

export default function miniedit(selector) {

  // Global referenes.
  let undoMode = false;

  // Set main content container.
  let content = selector instanceof HTMLElement
    ? selector
    : document.querySelector(selector);

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
    if (event.target.nodeName === "FIGURE") {
      event.preventDefault();
      selectNode(event.target);
      (event.ctrlKey || event.metaKey) && toolbox.open(event.target);
    }
    else if (event.target.dataset && event.target.dataset.md && (event.ctrlKey || event.metaKey)) {
      event.stopPropagation();
      toolbox.open(event.target);
    }
  });


  // Handle KEYBOARD.
  content.addEventListener("keydown", event => {

    // ENTER.
    if (event.code === "Enter") {
      event.preventDefault();

      const text = getCaretNode();
      const node = text.parentNode;
      // console.log(text, node);

      // Prevent from breaking non-text nodes.
      if (node.dataset.md) {
        caretAfterNode(node);
      }

      // Insert custom Line Break
      document.execCommand("insertHTML", false, `<br data-md="nl"/>&#8203;`);
      return;
    }

    // CTRL + SPACE.
    if ((event.ctrlKey || event.metaKey) && event.code === "Space") {
      const text = getCaretNode();
      const node = text.parentNode;
      const range = window.getSelection().getRangeAt(0);
      range.selectNode(node);
      document.execCommand("insertHTML", false, `${node.outerHTML} `);
      return;
    }

    // BACKSPACE.
    if (event.code === "Backspace") {
      const text = getCaretNode();
      const selection = window.getSelection().toString().length;

      // Code below removes text and associated styles when user selects entire
      // styled text node (e.g. strong) and removes it with Backspace.
      if (selection > 0) {
        event.preventDefault();
        document.execCommand("delete");
        resetCurrentCaretStyle();
        return;
      }

      // When caret is at the BEGINING of node unwrap the node.
      if (getCaretPosition(text) === 0) {
        if (text.dataset && text.dataset.noedit) {
          event.preventDefault();
          deleteNode(text);
        } else {
          const prevNode = text.parentNode.previousSibling;
          unwrapNode(text.parentNode);
          prevNode && caretAfterNode(prevNode);
        }

      }
      return;
    }

    // Delete.
    if (event.code === "Delete") {

      const text = getCaretNode();
      const selection = window.getSelection()
      const nonZeroSelection = selection.toString().length > 0;

      // Code below removes text and associated styles when user selects entire
      // styled text node (e.g. strong) and removes it with Backspace.
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
      // Do not render - allow to get back to moment when markdown haven't been yet converted into node.
      undoMode = true;
      return;
    }

    if (event.code === "F2") {
      return console.log(getText());
    }

    if (event.code === "F4") {
      const node = getCaretNode();
      chromeEolHack(() => {
        unwrapNode(node.parentNode);
      })
      return ;
    }

    // Do not allow input text into noneditable nodes.
    const node = getCaretNode();
    if (node.dataset && node.dataset.noedit && !event.code.includes("Arrow")) {
      event.preventDefault();
    }

    // Reset UndoMode.
    undoMode = false;

    // Rnder inline markdown.
    render();
  });


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
    chromeEolHack(() => {
      document.execCommand("insertHTML", false, parseMarkdown(
        event.clipboardData.getData("text/plain")
      ));
    })

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
