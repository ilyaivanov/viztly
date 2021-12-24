import { createItem, createRoot } from "../domain/items";
import { AppContent, init, select } from "../app";
import { check } from "./utils";
import simulation from "./simulation";

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

  it("Item 1 is selected", () => check.itemSelected(app.views, 1, 1));

  it("pressing down selects Item 2", () => {
    check.itemUnselected(app.views, 2, 2);

    simulation.selectDown(app);

    check.itemSelectedHasTitle(app, "Item 1.1");
    check.itemUnselected(app.views, 1, 1);
    check.itemSelected(app.views, 2, 2);
  });

  it("when Item 1.2 is selected going left selects parent", () => {
    select(app, app.root.children[0].children[1]);

    simulation.selectLeft(app);

    check.itemSelectedHasTitle(app, "Item 1");
    check.itemUnselected(app.views, 2, 3);
  });

  describe("when Item 1 is selected going left", () => {
    beforeEach(() => {
      check.itemExistsAt(app.views, 1, 4, "Item 2");
      check.itemExistsAt(app.views, 2, 5, "Item 2.1");
      check.itemExistsAt(app.views, 1, 6, "Item 3");

      simulation.selectLeft(app);
    });
    it("closes that item", () => {
      check.notContainItemTitle(app.views, "Item 1.1");
      check.notContainItemTitle(app.views, "Item 1.2");

      check.itemExistsAt(app.views, 1, 2, "Item 2");
      check.itemExistsAt(app.views, 2, 3, "Item 2.1");
      check.itemExistsAt(app.views, 1, 4, "Item 3");
    });

    describe("going right", () => {
      beforeEach(() => simulation.selectRight(app));

      it("opens that item", () => {
        check.itemExistsAt(app.views, 2, 2, "Item 1.1");
        check.itemExistsAt(app.views, 2, 3, "Item 1.2");
        check.itemExistsAt(app.views, 1, 4, "Item 2");
        check.itemExistsAt(app.views, 2, 5, "Item 2.1");
        check.itemExistsAt(app.views, 1, 6, "Item 3");
      });

      describe("going right again", () => {
        beforeEach(() => simulation.selectRight(app));

        it("selected child (Item 1.1)", () => {
          check.itemSelected(app.views, 2, 2);
        });
      });
    });
  });

  describe("selecting Item 1.1 and then removing it", () => {
    beforeEach(() => {
      simulation.selectRight(app);
      simulation.removeSelected(app);
    });

    it("removes Item 1.1", () =>
      check.notContainItemTitle(app.views, "Item 1.1"));

    it("selectes Item 1", () => check.itemSelected(app.views, 1, 1));

    it("moves Item 1.2 to 1,2 position", () =>
      check.itemExistsAt(app.views, 2, 2, "Item 1.2"));
  });

  describe("selecting Item 1 and then removing it", () => {
    beforeEach(() => {
      simulation.removeSelected(app);
    });

    it("removes Item 1, Item 1.1 and Item 1.2", () => {
      check.notContainItemTitle(app.views, "Item 1");
      check.notContainItemTitle(app.views, "Item 1.1");
      check.notContainItemTitle(app.views, "Item 1.2");
    });

    it("moves Item 2 to 1,1 position", () =>
      check.itemExistsAt(app.views, 1, 1, "Item 2"));

    it("selects Item 2", () => check.itemSelected(app.views, 1, 1));
  });

  it("Removing Item 1.1 and Item 1.2 updates circle of Item 1 to empty", () => {
    simulation.selectDown(app);
    simulation.selectDown(app);
    check.itemSelectedHasTitle(app, "Item 1.2");

    check.circleAtHas(app.views, 1, 1, { filled: true });

    simulation.removeSelected(app);
    simulation.removeSelected(app);

    check.circleAtHas(app.views, 1, 1, { filled: false });
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

    simulation.selectDown(app);

    check.itemSelectedHasTitle(app, "Item 2");
  });

  it("when Item 2 is selsected going above selects Item 1.1.1.1", () => {
    select(app, app.root.children[1]);

    check.itemSelectedHasTitle(app, "Item 2");

    simulation.selectUp(app);

    check.itemSelectedHasTitle(app, "Item 1.1.1.1");
  });
});

it("When root is selected going up does nothing", () => {
  const app = init(createRoot([createItem("Item 1"), createItem("Item 2")]));

  check.itemSelectedHasTitle(app, "Item 1");

  simulation.selectUp(app);

  check.itemSelectedHasTitle(app, "Item 1");
});

it("When last is selected going down does nothing", () => {
  const app = init(createRoot([createItem("Item 1"), createItem("Item 2")]));

  select(app, app.root.children[1]);
  check.itemSelectedHasTitle(app, "Item 2");

  simulation.selectDown(app);
  check.itemSelectedHasTitle(app, "Item 2");
});
