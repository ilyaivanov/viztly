import { createItem, createRoot } from "../domain/items";
import { check } from "./utils";
import { AppContent, init } from "../app";

describe("Having three nested items", () => {
  let app: AppContent;

  beforeEach(() => {
    app = init(
      createRoot([
        createItem("Item 1", "tree", [
          createItem("Item 1.1"),
          createItem("Item 1.2"),
        ]),
        createItem("Item 2", "tree", [createItem("Item 2.1")]),
        createItem("Item 3"),
      ])
    );
  });

  it("should have an Item 1 at 50,50", () =>
    check.itemExistsAt(app.views, 1, 1, "Item 1"));

  it("should have an Item 1.1 at 50+1,50+1", () =>
    check.itemExistsAt(app.views, 2, 2, "Item 1.1"));

  it("should have an Item 2 at 50,50+3", () =>
    check.itemExistsAt(app.views, 1, 4, "Item 2"));
});
