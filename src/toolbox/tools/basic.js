import { template } from "@ludekarts/utility-belt";
import { headlines } from "../../shared/patterns";
import { unwrapNode, replaceNode } from "../../shared/node";
import {
  ClearIcon, CloseIcon, LinkIcon, QuoteIcon, StrikeIcon, ItalicIcon,
  BoldIcon, HeadlineIcon, H1Icon, H2Icon, H3Icon, H4Icon, H5Icon, H6Icon,
} from "../../shared/icons";

export default function BasicEditor() {
  return currentTarget => {
    const [element, refs] = template`
      <div class="toolbox-controllers">
        <div class="toolbox-basic">
          <button class="${currentTarget.dataset.md.includes("#") ? "active" : ""}" data-action="headlines" title="Nagłówki">${HeadlineIcon}</button>
          <button class="${currentTarget.dataset.md === "bold" ? "active" : ""}" data-action="bold" title="Bold">${BoldIcon}</button>
          <button class="${currentTarget.dataset.md === "italic" ? "active" : ""}" data-action="italic" title="Italic">${ItalicIcon}</button>
          <button class="${currentTarget.dataset.md === "strike" ? "active" : ""}" data-action="strike" title="Strike through">${StrikeIcon}</button>
          <button class="${currentTarget.dataset.md === "quote" ? "active" : ""}" data-action="quote" title="Blockquote">${QuoteIcon}</button>
          <button data-action="link" title="Create link">${LinkIcon}</button>
          <button data-action="clear" title="Clear styles">${ClearIcon}</button>
          <button data-action="close" title="Close toolbox">${CloseIcon}</button>
        </div>
        <div ref="headlines" class="headlines">
          <button class="${currentTarget.dataset.md === "#" ? "active" : ""}" data-action="#" title="Headline 1">${H1Icon}</button>
          <button class="${currentTarget.dataset.md === "##" ? "active" : ""}" data-action="##" title="Headline 2">${H2Icon}</button>
          <button class="${currentTarget.dataset.md === "###" ? "active" : ""}" data-action="###" title="Headline 3">${H3Icon}</button>
          <button class="${currentTarget.dataset.md === "####" ? "active" : ""}" data-action="####" title="Headline 4">${H4Icon}</button>
          <button class="${currentTarget.dataset.md === "#####" ? "active" : ""}" data-action="#####" title="Headline 5">${H5Icon}</button>
          <button class="${currentTarget.dataset.md === "######" ? "active" : ""}" data-action="######" title="Headline 6">${H6Icon}</button>
        </div>
      </div>
    `;


    // ---- Methods ------------

    function unwrapElement() {
      if (currentTarget.nodeType === 1) {
        !currentTarget.parentNode
          ? document.execCommand("insertHTML", false, currentTarget.textContent)
          : unwrapNode(currentTarget);
      }
    }

    function toggleHeadlines() {
      refs.headlines.classList.toggle("active");
      return true;
    }

    function updateHeadline(size) {
      insertNode(
        currentTarget,
        `<${headlines[size]} data-md="${size}">${currentTarget.innerHTML}</${headlines[size]}>`
      );
    }

    function boldElement() {
      insertNode(
        currentTarget,
        `<strong data-md="bold">${currentTarget.innerHTML}</strong>`
      );
    }

    function italicElement() {
      insertNode(
        currentTarget,
        `<em data-md="italic">${currentTarget.innerHTML}</em>`
      );
    }

    function strikeElement() {
      insertNode(
        currentTarget,
        `<s data-md="strike">${currentTarget.innerHTML}</s>`
      );
    }

    function quoteElement() {
      insertNode(
        currentTarget,
        `<blockquote data-block="true" data-md="quote">${currentTarget.innerHTML}</blockquote>`
      );
    }

    function linkElement() {
      const tempId = Date.now();

      insertNode(
        currentTarget,
        `<a data-md="link" href="" data-tmpid="${tempId}">${currentTarget.innerHTML}</a>`
      );

      return {
        target: document.querySelector(`a[data-tmpid="${tempId}"]`),
      };
    }


    // ---- API ----------------

    return {
      element,
      command: cmd => {
        switch (cmd) {
          case "headlines":
            return toggleHeadlines();

          case "bold":
            return boldElement();

          case "italic":
            return italicElement();

          case "strike":
            return strikeElement();

          case "quote":
            return quoteElement();

          case "link":
            return linkElement();

          case "clear":
            return unwrapElement();

          default:
            // Handle all headlines.
            updateHeadline(cmd);
            break;
        }
      }
    };
  }
}

// ---- Helpers ----------------

function insertNode(target, markup) {
  replaceNode(
    target.parentNode ? target : null, // Enable transforming selections.
    markup,
  );
}