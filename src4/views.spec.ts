import { sp } from "../src3/design";
import { createItem, createTree } from "./items";
import { checkItemAt, checkItemAtIsSelected } from "./testUtilts";
import { renderViews, Views } from "./views";

describe("having three nested items", () => {
  let views: Views;

  beforeEach(() => {
    const tree = createTree([
      createItem("Item 1", "tree", [createItem("Item 1.1")]),
      createItem("Item 2"),
    ]);

    views = renderViews(tree, 50, 50);
  });

  it("should have an Item 1 at 50,50", () =>
    checkItemAt(views, 50, 50, "Item 1"));

  it("should have an Item 1.1 at 50+1,50+1", () =>
    checkItemAt(views, 50 + sp.xStep, 50 + sp.yStep, "Item 1.1"));

  it("should have an Item 2 at 50,50+2", () =>
    checkItemAt(views, 50, 50 + sp.yStep * 2, "Item 2"));

  it("Item 1 is selected", () => checkItemAtIsSelected(views, 50, 50));
});
