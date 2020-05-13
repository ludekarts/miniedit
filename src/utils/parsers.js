import { markdownToHtml, markdownMarkup } from "../shared/patterns";

export function extractMarkdown(container) {
  return Array.from(container.childNodes).reduce((acc, node) => {
    // Text nodes.
    if (node.nodeType === 3) {
      acc += node.textContent
    // Line breakes.
    } else if (node.nodeName === "BR") {
      acc += "\n";
    // Images.
    } else if (node.nodeName === "FIGURE") {
      if (node.dataset.md === "embed")  {
        acc += markdownMarkup.embed(node.firstElementChild.alt);
      } else {
        acc += markdownMarkup.img(node.firstElementChild.src, node.firstElementChild.alt);
      }
    // Links.
    } else if (node.nodeName === "A") {
      acc += markdownMarkup.link(node.href, node.textContent);
    // Nested elements.
    } else {
      const transform = markdownMarkup[node.dataset.md];
      acc +=  transform ? transform(extractMarkdown(node)) : node.textContent;
    }
    return acc;
  }, "");
}


// PARSE MARKDOWN TO HTML-NODES.
export function parseMarkdown(markdown) {
  return markdownToHtml.reduce(
    (acc, pattern) => acc.replace(pattern.match, pattern.format)
  , markdown);
}
