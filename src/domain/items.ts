export const createTree = (children: Item[]): Tree => {
  const root = createRoot(children);
  const selectedItem = root.children[0];
  return { root, selectedItem };
};

export const createRoot = (children: Item[]) =>
  createItem("Root", "tree", children);

export const createItem = (
  title: string,
  view: "tree" | "board" = "tree",
  children: Item[] = []
) => {
  const item: Item = {
    title,
    isOpen: children.length > 0,
    view: view,
    children,
    type: "folder",
    id: Math.random() + "",
  };
  children.forEach((c) => (c.parent = item));
  return item;
};