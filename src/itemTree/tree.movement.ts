import Item from "./item";

export const moveItemRight = (item: Item) => {
  const parent = item.parent;
  if (parent) {
    const index = parent.children.indexOf(item);
    if (index > 0) {
      const prevItem = parent.children[index - 1];
      prevItem.isOpen = true;
      parent.removeChildAt(index);
      prevItem.addChildAt(item, prevItem.children.length);
    }
  }
};

export const moveItemLeft = (item: Item) => {
  const parent = item.parent;
  if (parent) {
    const parentOfParent = parent.parent;
    if (parentOfParent) {
      const parentIndex = parentOfParent.children.indexOf(parent);
      parent.removeChild(item);
      parentOfParent.addChildAt(item, parentIndex + 1);
    }
  }
};

export const moveItemUp = (item: Item) => {
  const parent = item.parent;
  if (parent) {
    const index = parent.children.indexOf(item);
    if (index > 0) {
      parent.removeChildAt(index);
      parent.addChildAt(item, index - 1);
    }
  }
};

export const moveItemDown = (item: Item) => {
  const parent = item.parent;
  if (parent) {
    const index = parent.children.indexOf(item);
    if (index <= parent.children.length - 1) {
      parent.removeChildAt(index);
      parent.addChildAt(item, index + 1);
    }
  }
};
