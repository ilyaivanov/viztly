import Item from "./item";
import Tree from "./tree";

describe("having two items", () => {
  let tree: Tree;
  beforeEach(() => {
    tree = new Tree(new Item("root", [new Item("item 1"), new Item("item 2")]));
  });

  it("removing first selects second", () => {
    tree.removeSelected();

    expect(tree.selectedNode.title).toBe("item 2");
  });

  it("removing two items and then adding a new one adds that new one", () => {
    tree.removeSelected();
    tree.removeSelected();

    tree.createItem();
    expect(tree.selectedNode.title).toBe("");
  });
});
