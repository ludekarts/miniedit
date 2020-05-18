import { template } from "@ludekarts/utility-belt";

export default function EmbedEditor() {
  return currentTarget => {
    const element = template`
      <div class="toolbox-controllers">
        <button data-action="follow" title="Open in YouTube">↗</button>
        <button data-action="close" title="Close toolbox">✖</button>
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