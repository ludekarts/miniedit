import { template } from "travrs";
import { unwrapNode, replaceNode } from "node";

export default function InlineEditor() {
  return currentTarget => {
    const element = template(`
      div.toolbox-controllers
        button${currentTarget.dataset.md === "strong" ? ".active" : ""}[data-action="bold" title="Bold"]
          i.fa.fa-bold
        button${currentTarget.dataset.md === "italic" ? ".active" : ""}[data-action="italic" title="Italic"]
          i.fa.fa-italic
        button${currentTarget.dataset.md === "strike" ? ".active" : ""}[data-action="strike" title="Strike through"]
          i.fa.fa-strikethrough
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

    function boldElement() {
      replaceNode(
        currentTarget,
        `<strong data-md="strong">${currentTarget.textContent}</strong>`
      );
    }

    function italicElement() {
      replaceNode(
        currentTarget,
        `<em data-md="italic">${currentTarget.textContent}</em>`
      );
    }

    function strikeElement() {
      replaceNode(
        currentTarget,
        `<s data-md="strike">${currentTarget.textContent}</s>`
      );
    }


    // ---- API ----------------

    return {
      element,
      command: cmd => {
        switch (cmd) {
          case "bold":
            boldElement();
            break;

          case "italic":
            italicElement();
            break;

          case "strike":
            strikeElement();
            break;

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