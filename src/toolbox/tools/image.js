import { template } from "travrs";
import { selectNode } from "select";

export default function ImageEditor() {
  return currentTarget => {
    const [element, refs] = template(`
      div.toolbox-controllers
        div.link.list
          @alt::input.name[placeholder="Image alt text"]
          @url::input.url[placeholder="Image URL"]
        div
          button[data-action="update" title="Update image"]
            i.fa.fa-check
          button.pressable[data-action="copy" title="Copy link"]
            i.fa.fa-clipboard
          button[data-action="close" title="Close toolbox"]
            i.fa.fa-times
    `);

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
