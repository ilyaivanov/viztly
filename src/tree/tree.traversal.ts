export const getItemAbove = (item: Item): Item | undefined => {
  const parent = item.parent;
  if (parent) {
    const index = parent.children.indexOf(item);
    if (index > 0) {
      const previousItem = parent.children[index - 1];
      return getLastNestedItem(previousItem);
    } else if (!isRoot(parent)) return parent;
  }
};

// //this goes down into children
export const getItemBelow = (item: Item): Item | undefined =>
  item.isOpen && item.children ? item.children![0] : getFollowingItem(item);

export const getNextSiblingOrItemBelow = (item: Item): Item | undefined =>
  getFollowingSibling(item) || getFollowingItem(item);

export const getPreviousSiblingOrItemAbove = (item: Item): Item | undefined =>
  getRelativeSibling(item, (currentIndex) => currentIndex - 1) ||
  getItemAbove(item);

export const forEachOpenChild = (item: Item, cb: F1<Item>) => {
  const traverse = (children: Item[]) => {
    children.forEach((c) => {
      cb(c);
      if (c.isOpen && c.children.length > 0) forEachOpenChild(c, cb);
    });
  };
  traverse(item.children);
};

export const needsToBeOpened = (item: Item) =>
  !item.isOpen && item.children.length > 0;

export const isEmpty = (item: Item) => item.children.length === 0;

export const needsToBeClosed = (item: Item) => item.isOpen;
export const isRoot = (item: Item) => !item.parent;

export const hasItemInPath = (item: Item, itemToSearch: Item) => {
  let parent: Item | undefined = item;

  while (parent) {
    if (parent === itemToSearch) return true;

    parent = parent.parent;
  }
  return false;
};

const getLastNestedItem = (item: Item): Item => {
  if (item.isOpen && item.children) {
    const { children } = item;
    return getLastNestedItem(children[children.length - 1]);
  }
  return item;
};

//this always returns following item without going down to children
const getFollowingSibling = (item: Item): Item | undefined =>
  getRelativeSibling(item, (currentIndex) => currentIndex + 1);

const getFollowingItem = (item: Item): Item | undefined => {
  const followingItem = getFollowingSibling(item);
  if (followingItem) return followingItem;
  else {
    let parent = item.parent;
    while (parent && isLast(parent)) {
      parent = parent.parent;
    }
    if (parent) return getFollowingSibling(parent);
  }
};

const isLast = (item: Item): boolean => !getFollowingSibling(item);

const getRelativeSibling = (
  item: Item,
  getItemIndex: F2<number, number>
): Item | undefined => {
  const context = item.parent?.children;
  if (context) {
    const index = context.indexOf(item);
    return context[getItemIndex(index)];
  }
};
