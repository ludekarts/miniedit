import { template } from "@ludekarts/utility-belt";
import { CloseIcon, FollowIcon } from "../../shared/icons";

export default function EmbedEditor() {
  return currentTarget => {
    const element = template`
      <div class="toolbox-controllers">
        <button data-action="follow" title="Open in YouTube">${FollowIcon}</button>
        <button data-action="close" title="Close toolbox">${CloseIcon}</button>
      </div>
    `;


    // ---- Methods ------------

    function followLink() {
      window.open(currentTarget.firstElementChild.alt, "_blank");
    }


    // ---- API ----------------

    return {
      element,
      command: cmd => {
        switch (cmd) {
          case "follow":
            followLink();
            break;

          default:
            break;
        }
      }
    };
  };
}