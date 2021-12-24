import { AppContent, init } from "../app";
import { createItem, createRoot } from "../domain/items";
import simulation from "./simulation";
import { check } from "./check";

describe("Having two consecutive items", () => {
  let app: AppContent;
  beforeEach(() => {
    app = init(createRoot([createItem("Item 1"), createItem("Item 2")]));
  });
  describe("moving first down", () => {
    beforeEach(() => simulation.swapDown(app));

    it("swaps it with second item", () => {
      check.itemExistsAt(app.views, 1, 1, "Item 2");
      check.itemExistsAt(app.views, 1, 2, "Item 1");
    });

    it("original item remains selected", () =>
      check.itemSelected(app.views, 1, 2));

    describe("moving same item down again", () => {
      beforeEach(() => simulation.swapDown(app));

      it("does nothing", () => {
        check.itemExistsAt(app.views, 1, 1, "Item 2");
        check.itemExistsAt(app.views, 1, 2, "Item 1");
      });
    });
  });

  describe("selecting second item and moving it up", () => {
    beforeEach(() => {
      simulation.selectDown(app);
      simulation.swapUp(app);
    });

    it("swaps it with the first item", () => {
      check.itemExistsAt(app.views, 1, 1, "Item 2");
      check.itemExistsAt(app.views, 1, 2, "Item 1");
    });
  });

  describe("selecting second item and moving it right", () => {
    beforeEach(() => {
      simulation.selectDown(app);
      simulation.swapRight(app);
    });

    it("asigns selected item as a child of the previous one", () => {
      check.itemExistsAt(app.views, 1, 1, "Item 1");
      check.itemExistsAt(app.views, 2, 2, "Item 2");
    });

    it("moving it left positions it on the original place", () => {
      simulation.swapLeft(app);

      check.itemExistsAt(app.views, 1, 1, "Item 1");
      check.itemExistsAt(app.views, 1, 2, "Item 2");
    });
  });
});
