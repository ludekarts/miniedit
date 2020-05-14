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
        unwrapNode(currentTarget);
      }
    }

    function toggleHeadlines() {
      refs.headlines.classList.toggle("active");
    }

    function updateHeadline(size) {
      replaceNode(
        currentTarget,
        `<${headlines[size]} data-md="${size}">${currentTarget.innerHTML}</${headlines[size]}>`
      );
    }

    function boldElement() {
      replaceNode(
        currentTarget,
        `<strong data-md="strong">${currentTarget.textContent}</strong>`
      );
    }

    function italicElement() {
      replaceNode(
        currentTarget,
        `<em data-md="italic">${currentTarget.textContent}</em>`
      );
    }

    function strikeElement() {
      replaceNode(
        currentTarget,
        `<s data-md="strike">${currentTarget.textContent}</s>`
      );
    }

    function quoteElement() {
      replaceNode(
        currentTarget,
        `<blockquote data-block="true" data-md="quote">${currentTarget.textContent}</blockquote>`
      );
    }

    function linkElement() {
      replaceNode(
        currentTarget,
        `<a data-md="link" href="">${currentTarget.textContent}</a>`
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