import { createElement } from "@ludekarts/utility-belt";
import factory from "./factory";

export default function Toolbox(content) {

  // Currently selected tool.
  let currentTool;

  // Current element that tool is operating on.
  let currentTarget;

  // Initialization.
  const toolsFactory = factory();
  const element = createElement(`div[data-miniedit-toolbox="🧰"]`);

  content.parentNode.appendChild(element);

  // Core.
  function showToolbox(target) {

    console.log(target);

    // Get current editor instance.
    const editor = toolsFactory.getEditor(target.dataset.md, currentTarget);
    installTool(editor);

    // Set toolbox coordinates.
    const {x, y, width} = target.getBoundingClientRect();
    element.style.top = `${y - element.offsetHeight}px`;
    element.style.left = `${x + width/2 - 34}px`;
    element.classList.add("active");

    // Set listeners for close events.
    content.addEventListener("click", watchForClose);
    window.addEventListener("scroll", watchForClose);
  }

  function watchForClose(event) {
    if (!element.contains(event.target)) {
      content.removeEventListener("click", watchForClose);
      window.removeEventListener("scroll", watchForClose);
      element.classList.remove("active");
      currentTarget = null;
    }
  }

  function installTool(tool) {
    element.innerHTML = "";
    element.appendChild(tool.element);
    currentTool = tool;
  }

  function closeToolbox() {
    element.classList.remove("active");
  }

  // Handle text selection.
  content.addEventListener("dblclick", () => {
    // const selection = window.getSelection();
    // if (selection.toString().length) {
    //   const range = selection.anchorNode
    //     ? selection.getRangeAt(0)
    //     : new Range();
    //   showToolbox(range);
    // }
  });

  // Handle tools internal buttons events.
  element.addEventListener("click", event => {
    if (!event.target.dataset || !event.target.dataset.action) return;
    if (event.target.dataset.action === "close") return closeToolbox();
    if (currentTool) {
      // If command returns "true" tollbox WILL NOT CLOSE by default.
      !currentTool.command(event.target.dataset.action) && closeToolbox();
    }
  })

  // Api.
  return {
    open: target => {
      currentTarget = target;
      showToolbox(currentTarget);
    }
  }
}