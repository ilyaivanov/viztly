import { createItem, createRoot } from "../domain/items";
import { itemAt } from "./itemCheck";
import { AppContent, init } from "../app";

describe("Having three nested items", () => {
  let app: AppContent;

  beforeEach(() => {
    app = init(
      createRoot([
        createItem("Item 1", [createItem("Item 1.1"), createItem("Item 1.2")]),
        createItem("Item 2", [createItem("Item 2.1")]),
        createItem("Item 3"),
      ])
    );
  });

  it("should have an Item 1 at 1,1", () =>
    itemAt(app, 1, 1, { title: "Item 1" }));

  it("should have an Item 1.1 at 2,2", () =>
    itemAt(app, 2, 2, { title: "Item 1.1" }));

  it("should have an Item 2 at 1,4", () =>
    itemAt(app, 1, 4, { title: "Item 2" }));
});
