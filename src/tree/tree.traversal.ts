export const getItemAbove = (item: Item): Item | undefined => {
  const parent = item.parent;
  if (parent) {
    if (parent.view === "board") return parent;

    const index = parent.children.indexOf(item);
    if (index > 0) {
      const previousItem = parent.children[index - 1];
      if (previousItem.view === "board" && previousItem.isOpen)
        return getLastNestedItem(previousItem.children[0]);
      return getLastNestedItem(previousItem);
    } else if (!isRoot(parent)) return parent;
  }
};

// //this goes down into children
export const getItemBelow = (item: Item): Item | undefined =>
  item.isOpen && item.children ? item.children![0] : getFollowingItem(item);

export const getNextSiblingOrItemBelow = (item: Item): Item | undefined =>
  getFollowingItem(item);

export const getPreviousSiblingOrItemAbove = (item: Item): Item | undefined =>
  getRelativeSibling(item, (currentIndex) => currentIndex - 1) ||
  getItemAbove(item);

export const getRightTab = (item: Item): Item | undefined => {
  const tabInfo = getBoardInParent(item);

  if (tabInfo && tabInfo.tab.children.length - 1 > tabInfo.index)
    return tabInfo.tab.children[tabInfo.index + 1];
};

export const getLeftTab = (item: Item): Item | undefined => {
  const tabInfo = getBoardInParent(item);

  if (tabInfo && tabInfo.index > 0)
    return tabInfo.tab.children[tabInfo.index - 1];
};

export const forEachOpenChild = (item: Item, cb: F1<Item>) => {
  const traverse = (children: Item[]) => {
    children.forEach((c) => {
      cb(c);
      if (c.isOpen && c.children.length > 0) forEachOpenChild(c, cb);
    });
  };
  traverse(item.children);
};

export const findFirstChild = (
  item: Item,
  predicate: F2<Item, boolean>
): Item | undefined => {
  const traverse = (children: Item[]): Item | undefined => {
    for (let i = 0; i < children.length; i += 1) {
      const item = children[i];
      if (predicate(item)) return item;

      if (item.children.length > 0) {
        const anyChildFound = traverse(item.children);
        if (anyChildFound) return anyChildFound;
      }
    }
  };

  if (predicate(item)) return item;
  else return traverse(item.children);
};

export const needsToBeOpened = (item: Item) =>
  !item.isOpen && item.children.length > 0;

export const needsToBeLoaded = (item: Item): boolean =>
  !item.isOpen &&
  item.children.length === 0 &&
  (!!item.channelId || !!item.playlistId);

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

const getBoardInParent = (
  item: Item
): { tab: Item; index: number } | undefined => {
  let parent: Item | undefined = item;

  while (parent) {
    if (parent.parent && parent.parent.view === "board")
      return {
        tab: parent.parent,
        index: parent.parent.children.indexOf(parent),
      };

    parent = parent.parent;
  }
  return undefined;
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
  if (followingItem && item.parent?.view !== "board") return followingItem;
  else {
    let parent = item.parent;
    while (parent && (isLast(parent) || parent.parent?.view === "board")) {
      parent = parent.parent;
      console.log(parent);
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
