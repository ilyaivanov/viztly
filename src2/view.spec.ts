import { Tree, createItem, remove, createTree } from "./core";
import { flattenItems } from "./view";

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
