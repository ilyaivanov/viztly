import { flattenItems, Tree, createItem, remove, createTree } from "./core";

//core tests
describe("Having a bunch of nested items", () => {
  let tree: Tree;

  beforeEach(() => {
    tree = createTree(
      createItem("root", [
        createItem("Item 1", [createItem("Item 1.1")]),
        createItem("Item 2"),
      ])
    );
  });

  it("Item 1 has a parent root", () => {
    expect(tree.root.children[0].parent).toBe(tree.root);
  });

  it("Item 1.1 has a parent Item.1", () => {
    const item1 = tree.root.children[0];
    const item11 = item1.children[0];
    expect(item11.parent).toBe(item1);
  });

  it("root has no parent", () => {
    expect(tree.root.parent).toBeUndefined();
  });

  it("first item is selected", () => {
    expect(tree.root.children[0].isSelected).toBe(true);
  });

  it("second item is not selected", () => {
    expect(tree.root.children[1].isSelected).toBeFalsy();
  });
});

//view tests
describe("Having a bunch of nested items", () => {
  let tree: Tree;

  beforeEach(() => {
    tree = createTree(
      createItem("root", [
        createItem("Item 1", [createItem("Item 1.1")]),
        createItem("Item 2"),
      ])
    );
  });

  it("should have proper offsets", () => {
    const views = flattenItems(tree);

    expect(views.map((v) => v.item.title)).toEqual([
      "Item 1",
      "Item 1.1",
      "Item 2",
    ]);

    expect(views.map((v) => v.y)).toEqual([20, 40, 60]);
    expect(views.map((v) => v.x)).toEqual([20, 40, 20]);
  });

  it("removing second item removes it from the list and moves items up", () => {
    remove(tree.root.children[0].children[0]);

    const views = flattenItems(tree);

    expect(views.map((v) => v.item.title)).toEqual(["Item 1", "Item 2"]);

    expect(views.map((v) => v.y)).toEqual([20, 40]);
    expect(views.map((v) => v.x)).toEqual([20, 20]);
  });

  it("Item 1 has a selected color", () => {
    const views = flattenItems(tree);
    expect(views[0].color).toBe("red");
  });

  it("Item 2 has a regular color", () => {
    const views = flattenItems(tree);
    expect(views[1].color).toBe("white");
  });
});
