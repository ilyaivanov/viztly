export const createItem = (title: string, children: Item[] = []): Item => ({
  title,
  isOpen: true,
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
