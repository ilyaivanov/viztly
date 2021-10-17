import { createItem, createRoot } from "../../itemTree";
import { List } from "../list";

it("moving left from level 1 does nothing", () => {
  const list = new List(
    createRoot([createItem("First"), createItem("Second")])
  );

  list.selectParentItem();

  expect(list.getSelectedItemRow().item.title).toEqual("First");
});
