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

export const addItemAfter = (root: Item, item: Item, itemToAdd: Item) => {
  const traverseChildren = (i: Item) => {
    i.children = i.children
      .map((c) => (c == item ? [c, itemToAdd] : [c]))
      .flat();
    hasVisibleChildren(i) && i.children.forEach(traverseChildren);
  };

  traverseChildren(root);
};
export const addItemInside = (item: Item, itemToAdd: Item) => {
  item.children = [itemToAdd].concat(item.children);
};

export const createItem = (title: string, children: Item[] = []): Item => ({
  title,
  isOpen: children.length > 0,
  children,
});

export const createRoot = (children: Item[] = []): Item =>
  createItem("Home", children);

export const flattenItemChildren = <T>(
  item: Item,
  mapper: (item: Item, level: number) => T
): T[] => {
  const res: T[] = [];

  const traverseChildren = (item: Item, level: number) => {
    item.isOpen &&
      item.children.forEach((c) => {
        res.push(mapper(c, level));
        traverseChildren(c, level + 1);
      });
  };

  traverseChildren(item, 0);

  return res;
};
