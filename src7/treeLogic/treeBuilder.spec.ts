import { forEachOpenChild } from ".";
import * as t from "../types";
import { buildTree } from "./treeBuilder";

it("building a tree with only two items", () => {
  const tree = buildTree(`
    Item 1
    Item 2
    `);

  expect(titles(tree.root)).toEqual(["Item 1", "Item 2"]);
});

it("building a tree with two items and one nested", () => {
  const tree = buildTree(`
      Item 1
        Item 1.1
      Item 2
      `);

  expect(titles(tree.root)).toEqual(["Item 1", "Item 2"]);
  expect(titles(tree.root.children[0])).toEqual(["Item 1.1"]);
});

it("building a tree with two items and many nested", () => {
  const tree = buildTree(`
      Item 1
        Item 1.1 
           Item 1.1.1  # notice how I use three spaces here for indentation
           Item 1.1.2  
      Item 2
      `);

  expect(titles(tree.root)).toEqual(["Item 1", "Item 2"]);
  expect(titles(getItemByName(tree, "Item 1"))).toEqual(["Item 1.1"]);
  expect(titles(getItemByName(tree, "Item 1.1"))).toEqual([
    "Item 1.1.1",
    "Item 1.1.2",
  ]);
});

const titles = (item: t.Item) => item.children.map((i) => i.title);

const getItemByName = (tree: t.Tree, name: string): t.Item => {
  let itemFound: t.Item | undefined = undefined;
  forEachOpenChild(tree.root, (item) => {
    if (item.title === name) itemFound = item;
  });
  if (!itemFound) throw new Error(`Item '${name}' not found`);
  return itemFound;
};
