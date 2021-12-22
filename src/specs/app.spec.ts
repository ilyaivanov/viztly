import { createItem, createRoot } from "../domain/items";
import { check } from "./utils";
import { AppContent, init, handleKeyDown, select } from "../app";

describe("Having three nested items", () => {
  let app: AppContent;

  beforeEach(() => {
    app = init(
      createRoot([
        createItem("Item 1", "tree", [createItem("Item 1.1")]),
        createItem("Item 2"),
      ])
    );
  });

  it("should have an Item 1 at 50,50", () =>
    check.itemExistsAt(app.views, 1, 1, "Item 1"));

  it("should have an Item 1.1 at 50+1,50+1", () =>
    check.itemExistsAt(app.views, 2, 2, "Item 1.1"));

  it("should have an Item 2 at 50,50+2", () =>
    check.itemExistsAt(app.views, 1, 3, "Item 2"));

  it("Item 1 is selected", () => check.itemSelected(app.views, 1, 1));

  it("pressing down selects Item 2", () => {
    check.itemUnselected(app.views, 2, 2);

    simulation.pressDown(app);

    check.itemSelectedHasTitle(app, "Item 1.1");
    check.itemUnselected(app.views, 1, 1);
    check.itemSelected(app.views, 2, 2);
  });
});

describe("Having a very deep tree of items", () => {
  let app: AppContent;
  beforeEach(() => {
    app = init(
      createRoot([
        createItem("Item 1", "tree", [
          createItem("Item 1.1", "tree", [
            createItem("Item 1.1.1", "tree", [createItem("Item 1.1.1.1")]),
          ]),
        ]),
        createItem("Item 2"),
      ])
    );
  });
  it("when a very nest item is selected going down selects parents of next child", () => {
    select(app, app.root.children[0].children[0].children[0].children[0]);

    check.itemSelectedHasTitle(app, "Item 1.1.1.1");

    simulation.pressDown(app);

    check.itemSelectedHasTitle(app, "Item 2");
  });

  it("when Item 2 is selsected going above selects Item 1.1.1.1", () => {
    select(app, app.root.children[1]);

    check.itemSelectedHasTitle(app, "Item 2");

    simulation.pressUp(app);

    check.itemSelectedHasTitle(app, "Item 1.1.1.1");
  });
});

it("When root is selected going up does nothing", () => {
  const app = init(createRoot([createItem("Item 1"), createItem("Item 2")]));

  check.itemSelectedHasTitle(app, "Item 1");

  simulation.pressUp(app);

  check.itemSelectedHasTitle(app, "Item 1");
});

it("When last is selected going down does nothing", () => {
  const app = init(createRoot([createItem("Item 1"), createItem("Item 2")]));

  select(app, app.root.children[1]);
  check.itemSelectedHasTitle(app, "Item 2");

  simulation.pressDown(app);
  check.itemSelectedHasTitle(app, "Item 2");
});

const simulation = {
  pressDown: (app: AppContent) =>
    handleKeyDown(app, { code: "ArrowDown" } as any),

  pressUp: (app: AppContent) => handleKeyDown(app, { code: "ArrowUp" } as any),
};
