import { selectNodeExt, selectNode } from "./select";

// Replaces given node with it's content.
export const unwrapNode = node => {
  const zeroWidthSpaceStart = document.createTextNode("﻿"); // &#xfeff; - ZERO WIDTH NO-BREAK SPACE
  const zeroWidthSpaceEnd = document.createTextNode("﻿"); // &#xfeff; - ZERO WIDTH NO-BREAK SPACE
  insertNodeBefore(zeroWidthSpaceStart, node);
  insertNodeAfter(zeroWidthSpaceEnd, node);
  selectNodeExt(node);
  const content = node.innerHTML.replace(/\uFEFF/g, "");
  document.execCommand("insertHTML", false, content);
}

// Delete given node.
export const deleteNode = node => {
  const zeroWidthSpaceStart = document.createTextNode("﻿"); // &#xfeff; - ZERO WIDTH NO-BREAK SPACE
  const zeroWidthSpaceEnd = document.createTextNode("﻿"); // &#xfeff; - ZERO WIDTH NO-BREAK SPACE
  insertNodeBefore(zeroWidthSpaceStart, node);
  insertNodeAfter(zeroWidthSpaceEnd, node);
  selectNodeExt(node);
  document.execCommand("delete");
}

// Replaces givern node with new content.
export const replaceNode = (node, contnent) => {
  node && selectNode(node);
  document.execCommand("insertHTML", false, contnent);
};

// Exracts childNodes from @node. Removes @node at the end.
export const extractNodes = node => {
  if (node.childNodes.length === 0) return node.remove();
  node.parentNode.insertBefore(node.firstChild, node);
  extractNodes(node);
};

// Move nodes @from node @to node.
export const moveNodes = (from, to) => {
  while(from.childNodes.length > 0) to.appendChild(from.firstChild);
  return to;
};

// Inserts newNode after the old one.
export const insertNodeAfter = (newNode, node) => {
  node.parentNode.insertBefore(newNode, node.nextSibling);
};

// Inserts newNode before the old one.
export const insertNodeBefore = (newNode, node) => {
  node.parentNode.insertBefore(newNode, node);
};

