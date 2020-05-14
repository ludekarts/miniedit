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

  // Toolbox core.
  function showToolbox(target) {

    // Get current editor instance.
    const editor = toolsFactory.getEditor(target.dataset.md, currentTarget);
    installTool(editor);

    // Set toolbox coordinates.
    const {x, y, width} = target.getBoundingClientRect();
    element.style.top = `${y - element.offsetHeight}px`;
    element.style.left = `${x + width/2 - 34}px`;
    element.classList.add("active");

    // Set listeners for close events.
    window.addEventListener("scroll", watchForClose);
  }

  function watchForClose(event) {
    if (!element.contains(event.target)) {
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

  // Handle tools internal buttons events.
  element.addEventListener("click", event => {
    if (!event.target.dataset || !event.target.dataset.action) return;
    if (event.target.dataset.action === "close") return closeToolbox();
    // NOTE: If command returns "true" tollbox will NOT CLOSE by default.
    if (currentTool) {
      !currentTool.command(event.target.dataset.action) && closeToolbox();
    }
  })

  // ---- API ----------------

  return Object.freeze({
    open(target) {
      currentTarget = target;
      showToolbox(currentTarget);
    },

    close() {
      currentTarget = null;
      closeToolbox();
    },

    selection(markdown) {
      console.log(markdown);
      showToolbox({dataset:{md:"quote"}});
    }
  });
}