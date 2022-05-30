import { forEachChild, forEachParent } from "../treeLogic";
import { getItemByName } from "../treeLogic/testUtils";
import * as t from "../types";

// import initialState from "./initialState";
import initialState from "./viztly.json";

export const loadItems = (): t.Tree => {
  const rootParsed = mapItem(initialState as any);
  forEachChild(rootParsed, (child, parent) => (child.parent = parent));

  const tree: t.Tree = {
    root: rootParsed,
    focusedItem: rootParsed,
    selectedItem: rootParsed.children[0],
  };
  const deepHouse = getItemByName(tree, "Deep house");

  forEachParent(deepHouse, (i) => (i.isOpen = true));

  deepHouse.view = "gallery";
  const res = getItemByName(tree, "Viztly");

  console.log(res);
  res.isOpen = false;
  return tree;
};

const mapItem = (item: t.Item): t.Item => {
  const res: t.Item = item;
  res.children = item.children.map((c) => {
    const item = mapItem(c);
    item.parent = res;
    return item;
  });
  return res;
};
