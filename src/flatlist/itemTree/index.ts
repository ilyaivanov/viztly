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
