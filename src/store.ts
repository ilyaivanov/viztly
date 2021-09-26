const listIfItems = (prefix: string, count: number) =>
  Array.from(new Array(count)).map((_, i) => createItem(prefix + (i + 1)));

const createItem = (title: string, children: Item[] = []): Item => ({
  title,
  isOpen: true,
  isSelected: false,
  children,
});

export const root: Item = createItem("Home", [
  createItem("Music", [createItem("Ambient")]),
  createItem("Cooking"),
  createItem("Software Development", [
    createItem("Front-End", listIfItems("Item ", 3)),
    createItem("Back-End", listIfItems("Item ", 2)),
  ]),
  createItem("Item 1", [
    createItem("Item 1.1", listIfItems("Item 1.1.", 12)),
    createItem("Item 1.2", listIfItems("Item 1.2.", 10)),
    createItem("Item 1.3", listIfItems("Item 1.3.", 6)),
  ]),
]);
