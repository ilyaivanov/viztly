import * as events from "../events";
import { addItemAfter, createItem, removeItem } from "./tree.crud";
import * as movement from "./tree.movement";
import * as traversal from "./tree.traversal";

let tree: Tree;

type Tree = {
  root: Item;
  selectedItem: Item | undefined;
};
export type AppEvents = {
  init: { selectedItem: Item };
  "selection-changed": { prev: Item; current: Item };
  "item-toggled": Item;
  "item-moved": Item;
  "item-startEdit": Item;
  "item-finishEdit": Item;
  "item-removed": { itemRemoved: Item; itemSelected: Item | undefined };
  "item-added": Item;
};

export const init = () => {
  if (tree.selectedItem) trigger("init", { selectedItem: tree.selectedItem });
};

export const createTree = (root: Item) => {
  tree = {
    root,
    selectedItem: root.children[0],
  };
};

export const getFocused = () => tree.root;
export const getSelected = () => tree.selectedItem;
export const isSelected = (item: Item) => tree.selectedItem === item;

//actions

export const moveSelectedDown = () => applyMovement(movement.moveItemDown);
export const moveSelectedUp = () => applyMovement(movement.moveItemUp);
export const moveSelectedLeft = () => applyMovement(movement.moveItemLeft);
export const moveSelectedRight = () => applyMovement(movement.moveItemRight);
export const removeSelected = () => {
  if (tree.selectedItem) {
    const itemRemoved = tree.selectedItem;
    const itemSelected = removeItem(itemRemoved);
    if (itemSelected) changeSelection(() => itemSelected);
    trigger("item-removed", { itemRemoved, itemSelected });
  }
};

export const startEdit = () => {
  if (tree.selectedItem) trigger("item-startEdit", tree.selectedItem);
};
export const finishEdit = (newText: string) => {
  if (tree.selectedItem) {
    tree.selectedItem.title = newText;
    trigger("item-finishEdit", tree.selectedItem);
  }
};
const changeSelection = (getNextItem: F2<Item, Item | undefined>) => {
  if (tree.selectedItem) {
    const prev = tree.selectedItem;
    const current = getNextItem(tree.selectedItem);
    if (current) {
      tree.selectedItem = current;
      trigger("selection-changed", { current, prev });
    }
  }
};

const applyMovement = (movement: F1<Item>) => {
  if (tree.selectedItem) {
    movement(tree.selectedItem);
    trigger("item-moved", tree.selectedItem);
  }
};

export const goDown = () => changeSelection(traversal.getItemBelow);
export const goUp = () => changeSelection(traversal.getItemAbove);
export const goToNextSibling = () =>
  changeSelection(traversal.getNextSiblingOrItemBelow);
export const goToPreviousSibling = () =>
  changeSelection(traversal.getPreviousSiblingOrItemAbove);
export const goLeft = () => {
  const selected = tree.selectedItem;
  if (selected && selected.isOpen) close(selected);
  else if (selected && selected.parent && !traversal.isRoot(selected.parent))
    changeSelection(() => selected.parent);
};

export const goRight = () => {
  const selected = tree.selectedItem;
  if (selected && !selected.isOpen && selected.children.length > 0)
    open(selected);
  else if (selected && selected.children.length > 0)
    changeSelection(() => selected.children[0]);
};

export const createItemAfterSelected = () => {
  if (tree.selectedItem) {
    const newItem = createItem("");
    addItemAfter(tree.selectedItem, newItem);
    changeSelection(() => newItem);
    trigger("item-added", tree.selectedItem);
    trigger("item-startEdit", tree.selectedItem);
  }
};

const open = (item: Item) => {
  item.isOpen = true;
  trigger("item-toggled", item);
};
const close = (item: Item) => {
  item.isOpen = false;
  trigger("item-toggled", item);
};

//Events

const source = events.createSource<AppEvents>();

const trigger = <T extends keyof AppEvents>(event: T, data: AppEvents[T]) =>
  events.trigger(source, event, data);

export const on = <T extends keyof AppEvents>(event: T, cb: F1<AppEvents[T]>) =>
  events.on(source, event, cb);