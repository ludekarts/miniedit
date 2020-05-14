import { template } from "@ludekarts/utility-belt";
import { headlines } from "../../shared/patterns";
import { unwrapNode, replaceNode } from "../../shared/node";

export default function BasicEditor() {
  return currentTarget => {
    const [element, refs] = template`
      <div class="toolbox-controllers">
        <div>
          <button class="${currentTarget.dataset.md.includes("#") ? "active" : ""}" data-action="headlines" title="Nagłówki">H</button>
          <button class="${currentTarget.dataset.md === "bold" ? "active" : ""}" data-action="bold" title="Bold">B</button>
          <button class="${currentTarget.dataset.md === "italic" ? "active" : ""}" data-action="italic" title="Italic">I</button>
          <button class="${currentTarget.dataset.md === "strike" ? "active" : ""}" data-action="strike" title="Strike through">S</button>
          <button class="${currentTarget.dataset.md === "quote" ? "active" : ""}" data-action="quote" title="Blockquote">‟</button>
          <button data-action="link" title="Create link">↸</button>
          <button data-action="clear" title="Clear styles">※</button>
          <button data-action="close" title="Close toolbox">✖</button>
        </div>
        <div ref="headlines" class="headlines">
          <button class="${currentTarget.dataset.md === "#" ? "active" : ""}" data-action="#" title="Headline 1">H1</button>
          <button class="${currentTarget.dataset.md === "##" ? "active" : ""}" data-action="##" title="Headline 2">H2</button>
          <button class="${currentTarget.dataset.md === "###" ? "active" : ""}" data-action="###" title="Headline 3">H3</button>
          <button class="${currentTarget.dataset.md === "####" ? "active" : ""}" data-action="####" title="Headline 4">H4</button>
          <button class="${currentTarget.dataset.md === "#####" ? "active" : ""}" data-action="#####" title="Headline 5">H5</button>
          <button class="${currentTarget.dataset.md === "######" ? "active" : ""}" data-action="######" title="Headline 6">H6</button>
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
      insertNode(
        currentTarget,
        `<a data-md="link" href="">${currentTarget.innerHTML}</a>`
      );
    }


    // ---- API ----------------

    return {
      element,
      command: cmd => {
        switch (cmd) {
          case "headlines":
            toggleHeadlines();
            return true; // Do not close toolbox.

          case "bold":
            boldElement();
            break;

          case "italic":
            italicElement();
            break;

          case "strike":
            strikeElement();
            break;

          case "quote":
            quoteElement();
            break;

          case "link":
            linkElement();
            break;

          case "clear":
            unwrapElement();
            break;

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