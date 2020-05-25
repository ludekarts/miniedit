import { createElement } from "@ludekarts/utility-belt";
import { selectionToHtml } from "../shared/select";
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
  function showToolbox() {

    // Get current editor instance.
    const editor = toolsFactory.getEditor(currentTarget.dataset.md, currentTarget);
    installTool(editor);

    // Set toolbox coordinates.
    const {x, y, width} = getTargetPosition(currentTarget);
    element.style.top = `${y - element.offsetHeight - 25}px`;
    element.style.left = `${(x + width)/2 + editor.element.offsetWidth/2}px`;
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

  // Handle tools internal buttons events, to unify actions handling among all tools & simplify tool's code.
  element.addEventListener("click", event => {
    // Discard all irrelevant clicks.
    if (!event.target.dataset || !event.target.dataset.action) return;
    // Default close action for all tools.
    if (event.target.dataset.action === "close") return closeToolbox();
    // Run given command in currentTool and close toolbox.
    if (currentTool) {
      const toolNextAction = currentTool.command(event.target.dataset.action);
      if (!toolNextAction) {
        closeToolbox();
      } else if (toolNextAction.target) {
        closeToolbox();
        currentTarget = toolNextAction.target;
        showToolbox();
      } else {
        return; // NOTE: If command returns TRUTHY value the tollbox will NOT CLOSE by default.
      }
    }
  })

  // ---- API ----------------

  return Object.freeze({
    open(target) {
      currentTarget = target;
      showToolbox();
    },

    close() {
      currentTarget = null;
      closeToolbox();
    },

    selection() {
      const selectedHtml = selectionToHtml();
      selectedHtml.dataset.md = "selection";
      currentTarget = selectedHtml;
      showToolbox();
    }
  });
}

// ---- Helpers ----------------

function getTargetPosition(target) {
  return target.dataset.md === "selection"
    ? window.getSelection().getRangeAt(0).getBoundingClientRect()
    : target.getBoundingClientRect();
}