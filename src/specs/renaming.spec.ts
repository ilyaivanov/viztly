import { createItem, createRoot } from "../domain/items";
import { itemAt } from "./itemCheck";
import { inputDoesNotExist, checkInput } from "./inputCheck";
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
    checkInput({
      left: 50 + sp.circleToTextDistance,
      top: 50 - sp.fontSize * 0.32 * 2.5,
      text: "Item 1",
    });
  });

  it("entering a new text and pressing enter removes input and assigns title to an item", () => {
    simulation.setValueToInput("New Title");

    simulation.hitEnter(app);

    itemAt(app, 1, 1, { title: "New Title", isSelected: true });

    inputDoesNotExist();
  });

  it("bluring on text input removes it from the DOM", () => {
    simulation.blurOnInput();

    itemAt(app, 1, 1, { title: "Item 1", isSelected: true });

    inputDoesNotExist();
  });

  it("pressing down or up should not change selection", () => {
    simulation.selectDown(app);
    itemAt(app, 1, 1, { title: "", isSelected: true });

    simulation.selectUp(app);
    itemAt(app, 1, 1, { title: "", isSelected: true });

    simulation.selectLeft(app);
    simulation.selectLeft(app);
    itemAt(app, 1, 1, { title: "", isSelected: true });
  });
});
