import Item from "./item";

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

export const moveItemRight = (root: Item, item: Item): Item => {
  const parent = findParent(root, item);
  if (parent) {
    const index = parent.children.indexOf(item);
    if (index > 0) {
      const prevItem = parent.children[index - 1];
      prevItem.isOpen = true;
      parent.children.splice(index, 1);
      prevItem.children.push(item);
    }
  }
  return root;
};

export const moveItemLeft = (root: Item, item: Item): Item => {
  const parent = findParent(root, item);
  if (parent) {
    const parentOfParent = findParent(root, parent);
    if (parentOfParent) {
      const parentIndex = parentOfParent.children.indexOf(parent);
      parent.children = parent.children.filter((i) => i !== item);
      parentOfParent.children.splice(parentIndex + 1, 0, item);
    }
  }
  return root;
};

export const moveItemUp = (root: Item, item: Item): Item => {
  const parent = findParent(root, item);
  if (parent) {
    const index = parent.children.indexOf(item);
    if (index > 0) {
      parent.children.splice(index, 1);
      parent.children.splice(index - 1, 0, item);
    }
  }
  return root;
};

export const moveItemDown = (root: Item, item: Item): Item => {
  const parent = findParent(root, item);
  if (parent) {
    const index = parent.children.indexOf(item);
    if (index <= parent.children.length - 1) {
      parent.children.splice(index, 1);
      parent.children.splice(index + 1, 0, item);
    }
  }
  return root;
};

//this goes down into children
export const getItemBelow = (root: Item, item: Item): Item | undefined => {
  if (item.isOpen && item.children) return item.children![0];

  const followingItem = getFollowingItem(root, item);
  if (followingItem) return followingItem;
  else {
    let parent = findParent(root, item);
    while (parent && isLast(root, parent)) {
      parent = findParent(root, parent);
    }
    if (parent) return getFollowingItem(root, parent);
  }
};

//this always returns following item without going down to children
export const getFollowingItem = (root: Item, item: Item): Item | undefined => {
  const parent = findParent(root, item);
  if (parent) {
    const context: Item[] = parent.children!;
    const index = context.indexOf(item);
    if (index < context.length - 1) {
      return context[index + 1];
    }
  }
};

//need to find parent quickly (probably store direct link on an item)
export const removeItem = (root: Item, item: Item) => {
  const traverseChildren = (i: Item) => {
    i.children = i.children.filter((c) => c != item);
    hasVisibleChildren(i) && i.children.forEach(traverseChildren);
  };

  traverseChildren(root);
};

export const isLast = (root: Item, item: Item): boolean =>
  !getFollowingItem(root, item);

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

export const createItem = (title: string, children: Item[] = []): Item => {
  const item = new Item(title, children);
  item.isOpen = children.length > 0;
  return item;
};

const rootName = "51230812GIBERISHMAKINGSURETHISISUNIQUE%42%";

export const createRoot = (children: Item[] = []): Item =>
  createItem(rootName, children);

export const isRoot = (item: Item) =>
  //this is buggy, but I need to check for Home for backward compatability.
  //in future I will probably add a parent link to an Item data structure
  item.title === rootName || item.title === "Home";

export const findParent = (root: Item, item: Item): Item | undefined => {
  let res: Item | undefined = undefined;

  const traverseChildren = (i: Item) => {
    const child = i.children.find((c) => c == item);
    if (child) res = i;
    else i.children.forEach(traverseChildren);
  };

  traverseChildren(root);
  return res;
};

export const getPath = (root: Item, item: Item) => {
  const parents: Item[] = [];

  let i: Item | undefined = item;
  let iterationsLeft = 20;
  while (iterationsLeft > 0 && i && !isRoot(i)) {
    parents.push(i);
    i = findParent(root, i);
    iterationsLeft -= 1;
  }

  return parents;
};

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
