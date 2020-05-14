import { template } from "@ludekarts/utility-belt";
import { unwrapNode, replaceNode } from "../../shared/node";

export default function LinkEditor() {
  return currentTarget => {
    const [element, refs] = template`
      <div class="toolbox-controllers">
        <div class="link list">
          <input ref="name" class="name" type="text" placeholder="Link Name">
          <input ref="url" class="url" type="text" placeholder="Link URL">
        </div>
        <div>
          <button data-action="update" title="Update link">
            <i class="fa fa-check">✔</i>
          </button>
          <button data-action="follow" title="Follow link"">
            <i class="fa fa-send">↗</i>
          </button>
          <button data-action="copy" title="Copy link">
            <i class="fa fa-clipboard">❐</i>
          </button>
          <button data-action="clear" title="Clear styles">
            <i class="fa fa-eraser">※</i>
          </button>
          <button data-action="close" title="Close toolbox">
            <i class="fa fa-times">✖</i>
          </button>
        </div>
      </div>
    `;

    refs.url.value = currentTarget.href;
    refs.name.value = currentTarget.textContent;


    // ---- Methods ------------

    function unwrapElement() {
      if (currentTarget.nodeType === 1) {
        unwrapNode(currentTarget);
      }
    }

    function updateTarget() {
      replaceNode(
        currentTarget,
        `<a href="${refs.url.value}" data-md="link">${refs.name.value}</a>`,
      );
    }

    function followLink() {
      window.open(currentTarget.href, "_blank");
    }

    function copyLink() {
      refs.url.select();
      document.execCommand("copy");
      refs.url.blur();
    }

    // ---- API ----------------

    return {
      element,
      command: cmd => {
        switch (cmd) {
          case "update":
            updateTarget();
            return;

          case "clear":
            unwrapElement();
            return;

          case "follow":
            followLink();
            return true;

          case "copy":
            copyLink();
            return true;

          default:
            break;
        }
      }
    };
  };
}
