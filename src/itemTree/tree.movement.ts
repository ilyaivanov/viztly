import Item from "./item";

export const moveItemRight = (root: Item, item: Item): Item => {
  const parent = item.parent;
  if (parent) {
    const index = parent.children.indexOf(item);
    if (index > 0) {
      const prevItem = parent.children[index - 1];
      prevItem.isOpen = true;
      parent.children.splice(index, 1);
      prevItem.children.push(item);
    }
  }
  return root;
};

export const moveItemLeft = (root: Item, item: Item): Item => {
  const parent = item.parent;
  if (parent) {
    const parentOfParent = parent.parent;
    if (parentOfParent) {
      const parentIndex = parentOfParent.children.indexOf(parent);
      parent.children = parent.children.filter((i) => i !== item);
      parentOfParent.children.splice(parentIndex + 1, 0, item);
    }
  }
  return root;
};

export const moveItemUp = (root: Item, item: Item): Item => {
  const parent = item.parent;
  if (parent) {
    const index = parent.children.indexOf(item);
    if (index > 0) {
      parent.children.splice(index, 1);
      parent.children.splice(index - 1, 0, item);
    }
  }
  return root;
};

export const moveItemDown = (root: Item, item: Item): Item => {
  const parent = item.parent;
  if (parent) {
    const index = parent.children.indexOf(item);
    if (index <= parent.children.length - 1) {
      parent.children.splice(index, 1);
      parent.children.splice(index + 1, 0, item);
    }
  }
  return root;
};
