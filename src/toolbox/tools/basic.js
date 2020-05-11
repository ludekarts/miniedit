import { template } from "travrs";
import { unwrapNode } from "node";

export default function BasicEditor() {
  return currentTarget => {
    const element = template(`
      div.toolbox-controllers
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