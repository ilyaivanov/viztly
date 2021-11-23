//Domain
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

//View

export type ItemView = {
  item: Item;
  y: number;
  x: number;
  color: string;
};

export const flattenItems = ({ root }: Tree): ItemView[] => {
  const res: ItemView[] = [];

  let offset = 0;
  const traverseChildren = (parent: Item, level: number) => {
    parent.children.forEach((item) => {
      offset += 20;
      const color = item.isSelected ? "red" : "white";
      res.push({ item: item, y: offset, x: level * 20 + 20, color });
      traverseChildren(item, level + 1);
    });
  };

  traverseChildren(root, 0);

  return res;
};
