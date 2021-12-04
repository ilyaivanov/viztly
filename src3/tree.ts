export type Item = {
  title: string;
  children: Item[];
  isOpen: boolean;
  view: "tree" | "board";
  parent?: Item;
  isSelected?: boolean;
};

export type Tree = {
  root: Item;
  selectedItem?: Item;
};

const createItem = (
  title: string,
  view: "tree" | "board",
  children: Item[]
) => {
  const isOpen = children.length > 0;
  const item: Item = { title, isOpen, view: view, children };
  children.forEach((c) => (c.parent = item));
  return item;
};

export const createItemTree = (title: string, children: Item[] = []): Item =>
  createItem(title, "tree", children);

export const createItemBoard = (title: string, children: Item[] = []): Item =>
  createItem(title, "board", children);

export const createItemClosed = (
  title: string,

  children: Item[] = []
): Item => {
  const item = createItemTree(title, children);
  item.isOpen = false;
  return item;
};

export const remove = (item: Item) => {
  const parent = item.parent;
  if (parent) {
    parent.children = parent.children.filter((i) => i !== item);
  }
};

export const createTree = (root: Item): Tree => {
  root.children[0].isSelected = true;
  return { root, selectedItem: root.children[0] };
};

export const selectNextItem = (tree: Tree) => {
  if (tree.selectedItem) {
    const itemBelow = getItemBelow(tree.selectedItem);
    if (itemBelow) selectItem(tree, itemBelow);
  }
};

export const selectPreviousItem = (tree: Tree) => {
  if (tree.selectedItem) {
    const parent = tree.selectedItem.parent;
    if (parent) {
      const index = parent.children.indexOf(tree.selectedItem);
      if (index > 0) {
        const previousItem = parent.children[index - 1];
        return selectItem(tree, getLastNestedItem(previousItem));
      } else if (parent != tree.root) selectItem(tree, parent);
    }
  }
};

export const selectTabRight = (tree: Tree) => {
  const selected = tree.selectedItem;
  if (selected) {
    const { tab, child } = findParentTabAndDirectChildForItem(selected);

    if (tab && child) {
      const index = tab.children.indexOf(child);
      if (index < tab.children.length - 1) {
        selectItem(tree, tab.children[index + 1]);
      }
    }
  }
};

export const selectTabLeft = (tree: Tree) => {
  const selected = tree.selectedItem;
  if (selected) {
    const { tab, child } = findParentTabAndDirectChildForItem(selected);

    if (tab && child) {
      const index = tab.children.indexOf(child);
      if (index > 0) {
        selectItem(tree, tab.children[index - 1]);
      }
    }
  }
};

export const selectItem = (tree: Tree, item: Item) => {
  if (tree.selectedItem) tree.selectedItem.isSelected = false;
  tree.selectedItem = item;
  tree.selectedItem.isSelected = true;
};

export const selectParent = (tree: Tree, item: Item) => {
  if (item.parent && item.parent !== tree.root) {
    selectItem(tree, item.parent);
  }
};

export const selectFirstChild = (tree: Tree, item: Item) => {
  if (hasChildren(item)) {
    selectItem(tree, item.children[0]);
  }
};

export const closeItem = (item: Item) => {
  item.isOpen = false;
};

export const openItem = (item: Item) => {
  item.isOpen = true;
};

export const hasChildren = (item: Item) => item.children.length > 0;

// //this goes down into children
const getItemBelow = (item: Item): Item | undefined => {
  if (item.isOpen && item.children) return item.children![0];
  if (item.parent?.view === "board") {
    if (!isLast(item.parent)) return getFollowingItem(item.parent);
    else if (item.parent.parent) return getFollowingItem(item.parent.parent);
  }
  const followingItem = getFollowingItem(item);
  if (followingItem) return followingItem;
  else {
    let parent = item.parent;
    while (parent && isLast(parent)) {
      parent = parent.parent;
    }
    if (parent) {
      if (parent.parent && parent.parent.view === "board") {
        if (!isLast(parent.parent)) return getFollowingItem(parent.parent);
        else if (parent.parent.parent)
          return getFollowingItem(parent.parent.parent);
      }
      return getFollowingItem(parent);
    }
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

const getLastNestedItem = (item: Item): Item => {
  if (item.isOpen && item.children) {
    const { children } = item;
    if (item.view === "board") return getLastNestedItem(children[0]);
    return getLastNestedItem(children[children.length - 1]);
  }
  return item;
};

type TabContext = {
  tab?: Item;
  child?: Item;
};
const findParentTabAndDirectChildForItem = (item: Item): TabContext => {
  let tab = item.parent;
  let child: Item | undefined = item;
  while (tab && tab.view !== "board") {
    child = tab;
    tab = tab.parent;
  }
  return { tab, child };
};

const isLast = (item: Item): boolean => !getFollowingItem(item);
