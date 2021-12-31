import * as events from "./events";

let tree: Tree;

type Tree = {
  root: Item;
  selectedItem: Item | undefined;
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

//Events
export type AppEvents = {
  init: { selectedItem: Item };
  "selection-changed": { prev: Item; current: Item };
};

const source = events.createSource<AppEvents>();

const trigger = <T extends keyof AppEvents>(event: T, data: AppEvents[T]) =>
  events.trigger(source, event, data);

export const on = <T extends keyof AppEvents>(event: T, cb: F1<AppEvents[T]>) =>
  events.on(source, event, cb);
