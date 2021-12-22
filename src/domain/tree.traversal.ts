const getLastNestedItem = (item: Item): Item => {
  if (item.isOpen && item.children) {
    const { children } = item;
    return getLastNestedItem(children[children.length - 1]);
  }
  return item;
};

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
const getFollowingItem = (item: Item): Item | undefined => {
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
const isRoot = (item: Item) => {
  !item.parent; //?
  return !item.parent;
};
