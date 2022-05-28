import * as t from "../types";

// import initialState from "./initialState";
import initialState from "./viztly.json";

export const loadItems = (): t.Tree => {
  const rootParsed = mapItem(initialState as any);
  const tree: t.Tree = {
    root: rootParsed,
    focusedItem: rootParsed,
    selectedItem: rootParsed.children[0],
  };
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
