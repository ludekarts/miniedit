import { template } from "@ludekarts/utility-belt";
import { caretBeforeNode } from "../../shared/caret";
import { deleteNode, insertNodeBefore } from "../../shared/node";
import { CheckIcon, FollowIcon, CopyIcon, CloseIcon } from "../../shared/icons";

export default function ImageEditor() {
  return currentTarget => {
    const [element, refs] = template`
      <div class="toolbox-controllers">
        <div class="link list">
          <input ref="alt" class="name" type="text" placeholder="Image alt text">
          <input ref="url" class="name" type="text" placeholder="Image URL">
          <input ref="link" class="name" type="text" placeholder="External URL">
        </div>
        <div class="toolbox-buttons">
          <button data-action="update" title="Update image">${CheckIcon}</button>
          <button data-action="copy" title="Copy link">${CopyIcon}</button>
          ${currentTarget.dataset.link
              ? `<button data-action="follow" title="Copy link"">${FollowIcon}</button>`
              : ""
          }
          <button data-action="close" title="Close toolbox">${CloseIcon}</button>
        </div>
      </div>
    `;

    refs.url.value = currentTarget.firstElementChild.src;
    refs.alt.value = currentTarget.firstElementChild.alt;
    if (currentTarget.dataset.link) {
      refs.link.value = currentTarget.dataset.link;
    }

    // ---- Methods ------------

    function updateTarget() {
      let marker;
      const nextElement = currentTarget.nextSibling;
      deleteNode(currentTarget);

      // Place marker to poperly place caret - this action is not recorded by conteneditable history.
      if (nextElement) {
        marker = document.createTextNode("﻿");  // &#xfeff; - ZERO WIDTH NO-BREAK SPACE
        insertNodeBefore(marker, nextElement);
        caretBeforeNode(marker);
      }

      const link = refs.link.value ? `data-link="${refs.link.value}" ` : "";
      document.execCommand("insertHTML", false,
        `<figure data-md="img" data-block="true" data-noedit="true" ${link}data-click="showImageOptions"><img src="${refs.url.value}" alt="${refs.alt.value}"/></figure>${nextElement.nodeName !== "BR" ? `<br data-md="nl"/>`: ""}`
      );


      // Remove marker.
      marker && marker.remove();
    }

    function copyLink() {
      refs.url.select();
      document.execCommand("copy");
      refs.url.blur();
    }

    function followLink() {
      window.open(currentTarget.dataset.link, "_blank");
    }


    // ---- API ----------------

    return {
      element,
      command: cmd => {
        switch (cmd) {
          case "update":
            updateTarget();
            return;

          case "follow":
            followLink();
            return true;

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
