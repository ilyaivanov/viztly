import { getItemAbove, getItemBelow } from "../src/domain/tree.traversal";
import * as events from "./events";

let tree: Tree;

type Tree = {
  root: Item;
  selectedItem: Item | undefined;
};
export type AppEvents = {
  init: { selectedItem: Item };
  "selection-changed": { prev: Item; current: Item };
  "item-toggled": Item;
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

//actions
export const selectNextItem = () => changeSelection(getItemBelow);

export const selectPreviousItem = () => changeSelection(getItemAbove);

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

export const goLeft = () => {
  if (tree.selectedItem && tree.selectedItem.isOpen) {
    tree.selectedItem.isOpen = false;
    trigger("item-toggled", tree.selectedItem);
  }
};
export const goRight = () => {
  const selected = tree.selectedItem;
  if (selected && !selected.isOpen && selected.children.length > 0) {
    selected.isOpen = true;
    trigger("item-toggled", selected);
  }
};

//Events

const source = events.createSource<AppEvents>();

const trigger = <T extends keyof AppEvents>(event: T, data: AppEvents[T]) =>
  events.trigger(source, event, data);

export const on = <T extends keyof AppEvents>(event: T, cb: F1<AppEvents[T]>) =>
  events.on(source, event, cb);
