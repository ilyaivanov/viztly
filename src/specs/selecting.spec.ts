import { createItem, createRoot } from "../domain/items";
import { AppContent, changeSelection, init } from "../app";
import { itemAt } from "./itemCheck";
import simulation from "./simulation";

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

  it("Item 1 is selected", () => itemAt(app, 1, 1, { isSelected: true }));

  it("pressing down selects Item 2", () => {
    itemAt(app, 2, 2, { isSelected: false });

    simulation.selectDown(app);

    itemAt(app, 1, 1, { title: "Item 1", isSelected: false });
    itemAt(app, 2, 2, { title: "Item 1.1", isSelected: true });
  });

  it("when Item 1.2 is selected going left selects parent", () => {
    simulation.select(app, app.root.children[0].children[1]);

    simulation.selectLeft(app);

    itemAt(app, 1, 1, { title: "Item 1", isSelected: true });
    itemAt(app, 2, 2, { title: "Item 1.1", isSelected: false });
  });

  describe("when Item 1 is selected going left", () => {
    beforeEach(() => {
      itemAt(app, 1, 4, { title: "Item 2" });
      itemAt(app, 2, 5, { title: "Item 2.1" });
      itemAt(app, 1, 6, { title: "Item 3" });

      simulation.selectLeft(app);
    });
    it("closes that item and moves all items after up", () => {
      itemAt(app, 1, 2, { title: "Item 2" });
      itemAt(app, 2, 3, { title: "Item 2.1" });
      itemAt(app, 1, 4, { title: "Item 3" });
    });

    describe("going right", () => {
      beforeEach(() => simulation.selectRight(app));

      it("opens that item", () => {
        itemAt(app, 2, 2, { title: "Item 1.1" });
        itemAt(app, 2, 3, { title: "Item 1.2" });
        itemAt(app, 1, 4, { title: "Item 2" });
        itemAt(app, 2, 5, { title: "Item 2.1" });
        itemAt(app, 1, 6, { title: "Item 3" });
      });

      describe("going right again", () => {
        beforeEach(() => simulation.selectRight(app));

        it("selected child (Item 1.1)", () =>
          itemAt(app, 2, 2, { title: "Item 1.1", isSelected: true }));
      });
    });
  });

  describe("selecting Item 1.1 and then removing it", () => {
    beforeEach(() => {
      simulation.selectRight(app);
      simulation.removeSelected(app);
    });

    it("selectes Item 1", () =>
      itemAt(app, 1, 1, { title: "Item 1", isSelected: true }));

    it("moves Item 1.2 up", () => itemAt(app, 2, 2, { title: "Item 1.2" }));
  });

  describe("selecting Item 1 and then removing it", () => {
    beforeEach(() => {
      simulation.removeSelected(app);
    });

    it("moves Item 2 to 1,1 position", () =>
      itemAt(app, 1, 1, { title: "Item 2" }));

    it("selects Item 2", () =>
      itemAt(app, 1, 1, { title: "Item 2", isSelected: true }));
  });

  it("Removing Item 1.1 and Item 1.2 updates circle of Item 1 to empty", () => {
    simulation.selectDown(app);
    simulation.selectDown(app);
    itemAt(app, 2, 3, { title: "Item 1.2", isSelected: true });

    itemAt(app, 1, 1, { isCircleFilled: true });

    simulation.removeSelected(app);
    simulation.removeSelected(app);

    itemAt(app, 1, 1, { isCircleFilled: false });
  });
});

describe("Having a very deep tree of items", () => {
  let app: AppContent;
  beforeEach(() => {
    app = init(
      createRoot([
        createItem("Item 1", [
          createItem("Item 1.1", [
            createItem("Item 1.1.1", [createItem("Item 1.1.1.1")]),
          ]),
        ]),
        createItem("Item 2"),
      ])
    );
  });
  it("when a very nest item is selected going down selects parents of next child", () => {
    simulation.select(
      app,
      app.root.children[0].children[0].children[0].children[0]
    );

    itemAt(app, 4, 4, { title: "Item 1.1.1.1", isSelected: true });

    simulation.selectDown(app);

    itemAt(app, 1, 5, { title: "Item 2", isSelected: true });
  });

  it("when Item 2 is selsected going above selects Item 1.1.1.1", () => {
    simulation.select(app, app.root.children[1]);

    itemAt(app, 1, 5, { title: "Item 2", isSelected: true });

    simulation.selectUp(app);

    itemAt(app, 4, 4, { title: "Item 1.1.1.1", isSelected: true });
  });
});

it("When root is selected going up does nothing", () => {
  const app = init(createRoot([createItem("Item 1"), createItem("Item 2")]));

  itemAt(app, 1, 1, { title: "Item 1", isSelected: true });

  simulation.selectUp(app);

  itemAt(app, 1, 1, { title: "Item 1", isSelected: true });
});

it("When last is selected going down does nothing", () => {
  const app = init(createRoot([createItem("Item 1"), createItem("Item 2")]));

  simulation.select(app, app.root.children[1]);
  itemAt(app, 1, 2, { title: "Item 2", isSelected: true });

  simulation.selectDown(app);
  itemAt(app, 1, 2, { title: "Item 2", isSelected: true });
});
