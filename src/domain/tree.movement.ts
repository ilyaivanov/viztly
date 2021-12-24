import { addChildAt, removeChild, removeChildAt } from "./items";

export const moveItemRight = (item: Item) => {
  const parent = item.parent;
  if (parent) {
    const index = parent.children.indexOf(item);
    if (index > 0) {
      const prevItem = parent.children[index - 1];
      prevItem.isOpen = true;
      removeChildAt(parent, index);
      addChildAt(prevItem, item, prevItem.children.length);
    }
  }
};

export const moveItemLeft = (item: Item) => {
  const parent = item.parent;
  if (parent) {
    const parentOfParent = parent.parent;
    if (parentOfParent) {
      const parentIndex = parentOfParent.children.indexOf(parent);
      removeChild(parent, item);
      addChildAt(parentOfParent, item, parentIndex + 1);
    }
  }
};

export const moveItemUp = (item: Item) => {
  const parent = item.parent;
  if (parent) {
    const index = parent.children.indexOf(item);
    if (index > 0) {
      removeChildAt(parent, index);
      addChildAt(parent, item, index - 1);
    }
  }
};

export const moveItemDown = (item: Item) => {
  const parent = item.parent;
  if (parent) {
    const index = parent.children.indexOf(item);
    if (index <= parent.children.length - 1) {
      removeChildAt(parent, index);
      addChildAt(parent, item, index + 1);
    }
  }
};
