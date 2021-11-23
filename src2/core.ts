export type Item = {
  title: string;
  children: Item[];
  isOpen: boolean;
  parent?: Item;
  isSelected?: boolean;
};

export type Tree = {
  root: Item;
  selectedItem?: Item;
};

export const createItem = (title: string, children: Item[] = []): Item => {
  const isOpen = children.length > 0;
  const item: Item = { title, isOpen, children };
  children.forEach((c) => (c.parent = item));
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

const getLastNestedItem = (item: Item): Item => {
  if (item.isOpen && item.children) {
    const { children } = item;
    return getLastNestedItem(children[children.length - 1]);
  }
  return item;
};

const isLast = (item: Item): boolean => !getFollowingItem(item);
