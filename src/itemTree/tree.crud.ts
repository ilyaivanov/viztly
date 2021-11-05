import Item from "./item";

export const removeItem = (item: Item): Item | undefined => {
  let selectedItem: Item | undefined;
  const parent = item.parent;
  if (parent) {
    const index = parent.children.indexOf(item);
    if (index > 0) selectedItem = parent.children[index - 1];
    else {
      selectedItem = parent;
      parent.isOpen = parent.children.length > 1;
    }
    parent.removeChild(item);
  }
  return selectedItem;
};

export const addItemAfter = (item: Item, itemToAdd: Item) => {
  const parent = item.parent;

  if (parent) parent.addChildAt(itemToAdd, parent.children.indexOf(item) + 1);
};
export const addItemInside = (item: Item, itemToAdd: Item) => {
  item.addChildAtEnd(itemToAdd, 0);
};
