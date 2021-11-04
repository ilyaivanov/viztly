import Item from "./item";

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

export const flattenItemWithChildren = <T>(
  item: Item,
  mapper: (item: Item, level: number) => T
): T[] => {
  const res: T[] = [];

  const traverseItem = (item: Item, level: number) => {
    res.push(mapper(item, level));
    item.isOpen &&
      item.children.forEach((c) => {
        traverseItem(c, level + 1);
      });
  };

  traverseItem(item, 0);

  return res;
};

export const getLastNestedItem = (item: Item): Item => {
  if (item.isOpen && item.children) {
    const { children } = item;
    return getLastNestedItem(children[children.length - 1]);
  }
  return item;
};

// //this goes down into children
export const getItemBelow = (item: Item): Item | undefined => {
  if (item.isOpen && item.children) return item.children![0];

  const followingItem = getFollowingItem(item);
  if (followingItem) return followingItem;
  else {
    let parent = item.parent;
    while (parent && isLast(parent)) {
      parent = parent.parent;
    }
    if (parent) return getFollowingItem(parent);
  }
};

//this always returns following item without going down to children
export const getFollowingItem = (item: Item): Item | undefined => {
  const parent = item.parent;
  if (parent) {
    const context: Item[] = parent.children!;
    const index = context.indexOf(item);
    if (index < context.length - 1) {
      return context[index + 1];
    }
  }
};

export const isLast = (item: Item): boolean => !getFollowingItem(item);
