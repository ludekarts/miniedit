import { template } from "@ludekarts/utility-belt";
import { unwrapNode, replaceNode } from "../../shared/node";

export default function InlineEditor() {
  return currentTarget => {
    const element = template`
      <div class="toolbox-controllers">
        <button class="${currentTarget.dataset.md === "strong" ? ".active" : ""}" data-action="bold" title="Bold">
          <i class="fa fa-bold">B</i>
        </button>
        <button class="${currentTarget.dataset.md === "italic" ? ".active" : ""}" data-action="italic" title="Italic">
          <i class="fa fa-italic">I</i>
        </button>
        <button class="${currentTarget.dataset.md === "strike" ? ".active" : ""}" data-action="strike" title="Strike through">
          <i class="fa fa-strike">S</i>
        </button>
        <button data-action="clear" title="Clear styles">
          <i class="fa fa-eraser">⚌</i>
        </button>
        <button data-action="close" title="Close toolbox">
          <i class="fa fa-times">✖</i>
        </button>
      </div>
    `;


    // ---- Methods ------------

    function unwrapElement() {
      if (currentTarget.nodeType === 1) {
        unwrapNode(currentTarget);
      }
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


    // ---- API ----------------

    return {
      element,
      command: cmd => {
        switch (cmd) {
          case "bold":
            boldElement();
            break;

          case "italic":
            italicElement();
            break;

          case "strike":
            strikeElement();
            break;

          case "clear":
            unwrapElement();
            break;

          default:
            break;
        }
      }
    };
  }
}