import { createItem, createRoot } from "../domain/items";
import { check } from "./utils";
import { AppContent, init } from "../app";
import { sp } from "../view/design";
import simulation from "./simulation";

describe(`When pressing 'e' while focusing on Item 1`, () => {
  let app: AppContent;
  beforeEach(() => {
    app = init(createRoot([createItem("Item 1"), createItem("Item 2")]));
    simulation.startRename(app);
  });

  it("an input should be rendered at text coordinates", () => {
    check.input({
      left: 50 + sp.circleToTextDistance,
      top: 50 - sp.fontSize * 0.32 * 2.5,
      text: "Item 1",
    });
  });

  it("entering a new text and pressing enter removes input and assigns title to an item", () => {
    simulation.setValueToInput("New Title");

    simulation.hitEnter(app);

    check.itemExistsAt(app.views, 1, 1, "New Title");
    check.itemSelectedHasTitle(app, "New Title");

    check.inputDoesNotExist();
  });

  it("bluring on text input removes it from the DOM", () => {
    simulation.blurOnInput();

    check.itemExistsAt(app.views, 1, 1, "Item 1");
    check.itemSelectedHasTitle(app, "Item 1");

    check.inputDoesNotExist();
  });

  it("pressing down or up should not change selection", () => {
    simulation.pressDown(app);
    check.itemSelectedHasTitle(app, "Item 1");

    simulation.pressUp(app);
    check.itemSelectedHasTitle(app, "Item 1");

    simulation.pressLeft(app);
    simulation.pressLeft(app);
    check.itemSelectedHasTitle(app, "Item 1");
  });
});
