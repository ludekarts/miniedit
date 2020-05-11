import { template } from "@ludekarts/utility-belt";
import { unwrapNode, replaceNode } from "../../shared/node";

export default function LinkEditor() {
  return currentTarget => {
    const [element, refs] = template(`
      div.toolbox-controllers
        div.link.list
          @name::input.name[placeholder="Link Name"]
          @url::input.url[placeholder="Link URL"]
        div
          button[data-action="update" title="Update link"]
            i.fa.fa-check
          button[data-action="follow" title="Follow link"]
            i.fa.fa-send
          button.pressable[data-action="copy" title="Copy link"]
            i.fa.fa-clipboard
          button[data-action="clear" title="Clear styles"]
            i.fa.fa-eraser
          button[data-action="close" title="Close toolbox"]
            i.fa.fa-times
    `);

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

  }
}
