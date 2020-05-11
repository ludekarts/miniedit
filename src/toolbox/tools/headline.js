import { template } from "travrs";
import { headlines } from "patterns";
import { unwrapNode, replaceNode } from "node";

export default function HeaderEditor() {
  return currentTarget => {

    const element = template(`
      div.toolbox-controllers
        button${currentTarget.dataset.md === "#" ? ".active" : ""}[data-action="#"] > "H1"
        button${currentTarget.dataset.md === "##" ? ".active" : ""}[data-action="##"] > "H2"
        button${currentTarget.dataset.md === "###" ? ".active" : ""}[data-action="###"] > "H3"
        button${currentTarget.dataset.md === "####" ? ".active" : ""}[data-action="####"] > "H4"
        button${currentTarget.dataset.md === "#####" ? ".active" : ""}[data-action="#####"] > "H5"
        button${currentTarget.dataset.md === "######" ? ".active" : ""}[data-action="######"] > "H6"
        button[data-action="clear" title="Clear styles"]
          i.fa.fa-eraser
        button[data-action="close" title="Close toolbox"]
          i.fa.fa-times
    `);


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