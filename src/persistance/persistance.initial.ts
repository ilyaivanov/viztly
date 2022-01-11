import { createTree } from "../tree";
import { createItem, createRoot, list } from "../tree/tree.crud";

const medium = createRoot([
  createItem("Item 1", list("Item 1.", 10)),
  createItem("Item 2"),
  createItem("Item 3", [
    createItem("Item 3.1", list("Item 3.1.", 20)),
    createItem("Item 3.2", list("Item 3.2.", 10)),
  ]),
  createItem("Big", list("Big child ", 50)),
  createItem("Item 4", [
    createItem("Item 4.1.", list("Item 4.1.", 10)),
    createItem("Item 4.2.", list("Item 4.2.", 10)),
    createItem("Item 4.3.", list("Item 4.3.", 10)),
  ]),
  createItem("Item 5", list("Item 5.", 5)),
  createItem("Item 6"),
  createItem("Item 7"),
]);

export default createTree(medium);
