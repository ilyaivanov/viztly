import { Tree, createItem, remove, createTree } from "./core";
import { createList, sp, c, getViews } from "./view";

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
    const views = getViews(createList(tree));

    expect(views.map((v) => v.item.title)).toEqual([
      "Item 1",
      "Item 1.1",
      "Item 2",
    ]);

    expect(views.map((v) => v.position.y)).toEqual([
      sp.yStep,
      sp.yStep * 2,
      sp.yStep * 3,
    ]);
    expect(views.map((v) => v.position.x)).toEqual([
      sp.xStep,
      sp.xStep * 2,
      sp.xStep,
    ]);
  });

  it("removing second item removes it from the list and moves items up", () => {
    remove(tree.root.children[0].children[0]);

    const views = getViews(createList(tree));

    expect(views.map((v) => v.item.title)).toEqual(["Item 1", "Item 2"]);

    expect(views.map((v) => v.position.y)).toEqual([sp.yStep, sp.yStep * 2]);
    expect(views.map((v) => v.position.x)).toEqual([sp.xStep, sp.xStep]);
  });

  it("Item 1 has a selected color", () => {
    const views = getViews(createList(tree));
    expect(views[0].color).toBe(c.textSelected);
  });

  it("Item 2 has a regular color", () => {
    const views = getViews(createList(tree));
    expect(views[1].color).toBe(c.textRegular);
  });
});
