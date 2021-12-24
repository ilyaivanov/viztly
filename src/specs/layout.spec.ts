import { createItem, createRoot } from "../domain/items";
import { itemAtv2 } from "./check2";
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

  it("should have an Item 1 at 1,1", () =>
    itemAtv2(app, 1, 1, { title: "Item 1" }));

  it("should have an Item 1.1 at 2,2", () =>
    itemAtv2(app, 2, 2, { title: "Item 1.1" }));

  it("should have an Item 2 at 1,4", () =>
    itemAtv2(app, 1, 4, { title: "Item 2" }));
});
