import { template } from "@ludekarts/utility-belt";
import { headlines } from "../../shared/patterns";
import { unwrapNode, replaceNode } from "../../shared/node";

export default function HeaderEditor() {
  return currentTarget => {

    const element = template`
      <div class="toolbox-controllers">
        <button class="${currentTarget.dataset.md === "#" ? ".active" : ""}" data-action="#" title="Clear styles">H1</button>
        <button class="${currentTarget.dataset.md === "##" ? ".active" : ""}" data-action="##" title="Clear styles">H2</button>
        <button class="${currentTarget.dataset.md === "###" ? ".active" : ""}" data-action="###" title="Clear styles">H3</button>
        <button class="${currentTarget.dataset.md === "####" ? ".active" : ""}" data-action="####" title="Clear styles">H4</button>
        <button class="${currentTarget.dataset.md === "#####" ? ".active" : ""}" data-action="#####" title="Clear styles">H5</button>
        <button class="${currentTarget.dataset.md === "######" ? ".active" : ""}" data-action="######" title="Clear styles">H6</button>
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

    function updateHeadline(size) {
      replaceNode(
        currentTarget,
        `<${headlines[size]} data-md="${size}">${currentTarget.innerHTML}</${headlines[size]}>`
      );
    }


    // ---- API ----------------

    return {
      element,
      command: cmd => {
        switch (cmd) {
          case "clear":
            unwrapElement();
            break;

          default:
            updateHeadline(cmd);
            break;
        }
      }
    };
  }
}