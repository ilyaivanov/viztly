import { createItem, createRoot } from "../domain/items";
import { AppContent, init } from "../app";
import simulation from "./simulation";
import { check } from "./check";

describe(`When pressing 'e' while focusing on Item 1`, () => {
  let app: AppContent;
  beforeEach(
    () => (app = init(createRoot([createItem("Item 1"), createItem("Item 2")])))
  );

  describe("pressing enter", () => {
    beforeEach(() => simulation.hitEnter(app));

    it("creates a new item with empty title after Item 1", () => {
      const expectedItems = ["Item 1", "", "Item 2"];
      expect(app.root.children.map((i) => i.title)).toEqual(expectedItems);

      check.itemSelectedHasTitle(app, "");
      check.itemExistsAt(app.views, 1, 2, "");
      simulation.setValueToInput("My Great Item");

      simulation.hitEnter(app);

      check.inputDoesNotExist();
      check.itemSelectedHasTitle(app, "My Great Item");
      check.itemExistsAt(app.views, 1, 2, "My Great Item");
    });
  });
});
