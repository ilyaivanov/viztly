import Item from "./item";

export const removeItem = (item: Item): Item | undefined => {
  let selectedItem: Item | undefined;
  const parent = item.parent;
  if (parent && parent.parent) {
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
