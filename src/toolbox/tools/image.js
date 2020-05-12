import { template } from "@ludekarts/utility-belt";
import { selectNode } from "../../shared/select";

export default function ImageEditor() {
  return currentTarget => {
    const [element, refs] = template`
      <div class="toolbox-controllers">
        <div class="link list">
          <input ref="alt" class="name" type="text" placeholder="Image alt text">
          <input ref="url" class="name" type="text" placeholder="Image URL">
        </div>
        <div>
          <button data-action="update" title="Update image">
            <i class="fa fa-check">✔</i>
          </button>
          <button data-action="copy" title="Copy link"">
            <i class="fa fa-clipboard">❐</i>
          </button>
          <button data-action="close" title="Close toolbox">
            <i class="fa fa-times">✖</i>
          </button>
        </div>
      </div>
    `;

    console.log(refs);


    refs.url.value = currentTarget.firstElementChild.src;
    refs.alt.value = currentTarget.firstElementChild.alt;

    // ---- Methods ------------


    function updateTarget() {
      selectNode(currentTarget);
      document.execCommand("insertHTML", false, `<figure data-md="img" data-block="true" data-noedit="true" data-click="showImageOptions"><img src="${refs.url.value}" alt="${refs.alt.value}"/></figure>`);
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
