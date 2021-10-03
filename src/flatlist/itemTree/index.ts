export const hasVisibleChildren = (item: Item) =>
  item.isOpen && item.children.length > 0;

export const visibleChildrenCount = (item: Item) =>
  getVisibleChildren(item).length;

export const getVisibleChildren = (item: Item): Item[] => {
  let childs: Item[] = [];
  const gatherChildren = (child: Item) => {
    childs.push(child);
    traverseChildren(child);
  };
  const traverseChildren = (i: Item) =>
    hasVisibleChildren(i) && i.children.forEach(gatherChildren);

  traverseChildren(item);
  return childs;
};

//need to find parent quickly (probably store direct link on an item)
export const removeItem = (root: Item, item: Item) => {
  const traverseChildren = (i: Item) => {
    i.children = i.children.filter((c) => c != item);
    hasVisibleChildren(i) && i.children.forEach(traverseChildren);
  };

  traverseChildren(root);
};
