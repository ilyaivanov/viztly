import { isRoot } from "../../src/domain/tree.traversal";
import { removeChild } from "./tree.movement";

export const removeItem = (item: Item): Item | undefined => {
  let selectedItem: Item | undefined;
  const parent = item.parent;
  if (parent) {
    const index = parent.children.indexOf(item);
    if (index > 0) selectedItem = parent.children[index - 1];
    else {
      if (isRoot(parent)) {
        selectedItem = parent.children[index + 1];
      } else {
        selectedItem = parent;
        parent.isOpen = parent.children.length > 1;
      }
    }
    removeChild(parent, item);
  }
  return selectedItem;
};
