import { AppContent, init } from "../app";
import { createItem, createRoot } from "../domain/items";
import simulation from "./simulation";
import { itemAt } from "./itemCheck";

describe("Having two consecutive items", () => {
  let app: AppContent;
  beforeEach(() => {
    app = init(createRoot([createItem("Item 1"), createItem("Item 2")]));
  });
  describe("moving first down", () => {
    beforeEach(() => simulation.swapDown(app));

    it("swaps it with second item", () => {
      itemAt(app, 1, 1, { title: "Item 2" });
      itemAt(app, 1, 2, { title: "Item 1" });
    });

    it("original item remains selected", () =>
      itemAt(app, 1, 2, { isSelected: true }));

    describe("moving same item down again", () => {
      beforeEach(() => simulation.swapDown(app));

      it("does nothing", () => {
        itemAt(app, 1, 1, { title: "Item 2" });
        itemAt(app, 1, 2, { title: "Item 1" });
      });
    });
  });

  describe("selecting second item and moving it up", () => {
    beforeEach(() => {
      simulation.selectDown(app);
      simulation.swapUp(app);
    });

    it("swaps it with the first item", () => {
      itemAt(app, 1, 1, { title: "Item 2" });
      itemAt(app, 1, 2, { title: "Item 1" });
    });
  });

  describe("selecting second item and moving it right", () => {
    beforeEach(() => {
      simulation.selectDown(app);
      simulation.swapRight(app);
    });

    it("asigns selected item as a child of the previous one", () => {
      itemAt(app, 1, 1, { title: "Item 1" });
      itemAt(app, 2, 2, { title: "Item 2" });
    });

    it("moving it left positions it on the original place", () => {
      simulation.swapLeft(app);

      itemAt(app, 1, 1, { title: "Item 1" });
      itemAt(app, 1, 2, { title: "Item 2" });
    });
  });
});
