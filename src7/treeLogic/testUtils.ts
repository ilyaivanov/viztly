import { forEachOpenChild } from ".";
import * as t from "../types";

export const selectItemByName = (tree: t.Tree, name: string) => {
  tree.selectedItem = getItemByName(tree, name);
};

export const getItemByName = (tree: t.Tree, name: string): t.Item => {
  let itemFound: t.Item | undefined = undefined;
  forEachOpenChild(tree.root, (item) => {
    if (item.title === name) itemFound = item;
  });
  if (!itemFound) throw new Error(`Item '${name}' not found`);
  return itemFound;
};
