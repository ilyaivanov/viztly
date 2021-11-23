export type Item = {
  title: string;
  children: Item[];
  parent?: Item;
  isSelected?: boolean;
};

export type Tree = {
  root: Item;
  selectedItem?: Item;
};

export const createItem = (title: string, children: Item[] = []): Item => {
  const item = { title, children };
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

// export const selectNextItem = (tree: Tree)=> {
//   const
// }
