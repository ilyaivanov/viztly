import * as t from "../types";
import * as events from "../infra/events";

export type AppEvents = {
  // init: { selectedItem: Item };
  // "selection-changed": { prev: Item; current: Item };
  "item-toggled": t.Item;
  // "item-changed-view": Item;
  // "item-changed-completed": Item;
  // "item-children-loaded": { item: Item; children: Item[] };
  // "item-moved": Item;
  // "item-focused": { prev: Item; current: Item };
  // "item-startEdit": Item;
  // "item-finishEdit": Item;
  // "item-removed": { itemRemoved: Item; itemSelected: Item | undefined };
  // "item-added": Item;
};
//Events

const source = events.createSource<AppEvents>();

export const trigger = <T extends keyof AppEvents>(
  event: T,
  data: AppEvents[T]
) => events.trigger(source, event, data);

export const on = <T extends keyof AppEvents>(event: T, cb: F1<AppEvents[T]>) =>
  events.on(source, event, cb);

export const goDown = (tree: t.Tree) => {
  const itemBelow = getItemBelow(tree.selectedItem);

  if (itemBelow) tree.selectedItem = itemBelow;
};
export const goUp = (tree: t.Tree) => {
  const itemBelow = getItemAbove(tree.selectedItem);

  if (itemBelow) tree.selectedItem = itemBelow;
};

export const goLeft = (tree: t.Tree) => {
  const selected = tree.selectedItem;
  if (selected && selected.isOpen) close(selected);
  else if (selected && selected.parent && !isRoot(selected.parent))
    tree.selectedItem = selected.parent;
};

export const goRight = (tree: t.Tree) => {
  const selected = tree.selectedItem;
  if (selected && !selected.isOpen && selected.children.length > 0)
    open(selected);
  else if (selected && selected.children.length > 0)
    tree.selectedItem = selected.children[0];
};

const close = (item: t.Item) => {
  // if (isFocused(item)) return;

  item.isOpen = false;
  trigger("item-toggled", item);
};

const open = (item: t.Item) => {
  // if (isFocused(item)) return;

  item.isOpen = true;
  trigger("item-toggled", item);
};

const getItemAbove = (item: t.Item): t.Item | undefined => {
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

const getLastNestedItem = (item: t.Item): t.Item => {
  if (item.isOpen && item.children) {
    const { children } = item;
    return getLastNestedItem(children[children.length - 1]);
  }
  return item;
};
// //this goes down into children
const getItemBelow = (item: t.Item): t.Item | undefined =>
  item.isOpen && item.children ? item.children![0] : getFollowingItem(item);

//this always returns following item without going down to children
const getFollowingSibling = (item: t.Item): t.Item | undefined =>
  getRelativeSibling(item, (currentIndex) => currentIndex + 1);

const getFollowingItem = (item: t.Item): t.Item | undefined => {
  const followingItem = getFollowingSibling(item);
  if (followingItem && !isBoard(item.parent)) return followingItem;
  else {
    let parent = item.parent;
    while (parent && (isLast(parent) || isBoard(parent.parent))) {
      parent = parent.parent;
    }
    if (parent) return getFollowingSibling(parent);
  }
};

const isLast = (item: t.Item): boolean => !getFollowingSibling(item);

const getRelativeSibling = (
  item: t.Item,
  getItemIndex: F2<number, number>
): t.Item | undefined => {
  const context = item.parent?.children;
  if (context) {
    const index = context.indexOf(item);
    return context[getItemIndex(index)];
  }
};

export const forEachOpenChild = (item: t.Item, cb: F1<t.Item>) => {
  const traverse = (children: t.Item[]) => {
    children.forEach((c) => {
      cb(c);
      if (hasVisibleChildren(c)) forEachOpenChild(c, cb);
    });
  };
  traverse(item.children);
};

const hasVisibleChildren = (item: t.Item) =>
  item.isOpen && item.children.length;

const isBoard = (item: t.Item | undefined): boolean => item?.view === "board";
const isRoot = (item: t.Item) => !item.parent;
