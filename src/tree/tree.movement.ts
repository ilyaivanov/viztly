import { isFocused, trigger } from ".";

export const moveItemRight = (item: Item) => {
  const parent = item.parent;
  if (parent && canItemBeMoved(item)) {
    const index = parent.children.indexOf(item);
    if (index > 0) {
      const prevItem = parent.children[index - 1];
      if (!prevItem.isOpen) {
        prevItem.isOpen = true;
        trigger("item-toggled", prevItem);
      }
      removeChildAt(parent, index);
      addChildAt(prevItem, item, prevItem.children.length);
    }
  }
};

export const moveItemLeft = (item: Item) => {
  const parent = item.parent;
  if (parent && canItemBeMovedLeft(item)) {
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
  if (parent && canItemBeMoved(item)) {
    const index = parent.children.indexOf(item);
    if (index > 0) {
      removeChildAt(parent, index);
      addChildAt(parent, item, index - 1);
    }
  }
};

export const moveItemDown = (item: Item) => {
  const parent = item.parent;
  if (parent && canItemBeMoved(item)) {
    const index = parent.children.indexOf(item);
    if (index <= parent.children.length - 1) {
      removeChildAt(parent, index);
      addChildAt(parent, item, index + 1);
    }
  }
};

const canItemBeMoved = (item: Item) => !isFocused(item);
const canItemBeMovedLeft = (item: Item) =>
  canItemBeMoved(item) && item.parent && !isFocused(item.parent);

//common
const updateIsOpenFlag = (item: Item) => {
  item.isOpen = item.children.length !== 0;
};

const removeChildAt = (item: Item, index: number) => {
  item.children.splice(index, 1);
  updateIsOpenFlag(item);
};

export const removeChild = (parent: Item, item: Item) => {
  parent.children = parent.children.filter((c) => c !== item);
  updateIsOpenFlag(parent);
};

const addChildAt = (parent: Item, item: Item, index: number) => {
  parent.children.splice(index, 0, item);
  item.parent = parent;
  updateIsOpenFlag(parent);
};
