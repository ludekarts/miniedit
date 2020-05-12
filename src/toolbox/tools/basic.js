import { template } from "@ludekarts/utility-belt";
import { unwrapNode } from "../../shared/node";

export default function BasicEditor() {
  return currentTarget => {
    const element = template`
      <div class="toolbox-controllers">
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


    // ---- API ----------------

    return {
      element,
      command: cmd => {
        switch (cmd) {
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