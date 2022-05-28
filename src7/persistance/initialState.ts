import * as t from "../types";

export const list = (prefix: string, count: number): t.Item[] =>
  Array.from(new Array(count)).map((_, index) =>
    createItem(`${prefix}${index + 1}`)
  );

export const createRoot = (children: t.Item[]) => createItem("Root", children);

export const createItem = (
  title: string,
  children: t.Item[] = [],
  isOpen?: boolean
) => {
  const item: t.Item = {
    title,
    isOpen: typeof isOpen === "boolean" ? isOpen : children.length > 0,
    view: "tree",
    children,
    type: "folder",
    id: Math.random() + "",
  };
  setChildren(item, children);
  return item;
};

const setChildren = (item: t.Item, children: t.Item[]) => {
  item.children = children;
  children.forEach((i) => (i.parent = item));
};

export default createRoot([
  createItem("Item 1", list("Item 1.", 10)),
  createItem("Item 2"),
  createItem("Item 3", [
    createItem("Item 3.1", list("Item 3.1.", 20), false),
    createItem("Item 3.2", list("Item 3.2.", 10)),
  ]),
  createItem("Big", list("Big child ", 50), false),
  createItem("Item 4", [
    createItem("Item 4.1.", list("Item 4.1.", 10)),
    createItem("Item 4.2.", list("Item 4.2.", 10)),
    createItem("Item 4.3.", list("Item 4.3.", 10)),
  ]),
  createItem("Item 5", list("Item 5.", 5)),
  createItem("Item 6"),
  createItem("Item 7"),
]);
