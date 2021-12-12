import { createItemTree, createItemBoard, createTree, Tree } from "./tree";

const small = createItemTree("Root", [
  createItemBoard("Board", [
    createItemTree("one", [createItemTree("one child")]),
    createItemTree("two", [createItemTree("two child")]),
    createItemTree("three"),
  ]),
  createItemTree("Tasks"),
]);

export const tree: Tree = createTree(small);
