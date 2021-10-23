import { createItem, createRoot } from "../../itemTree";
import { List } from "../list";
import { verifyRowsLayout as verifyLayout } from "./layoutCheck";

it("having two items moving second item right moves it inside first", () => {
  const list = new List(
    createRoot([createItem("First"), createItem("Second")])
  );

  list.selectNextItem();
  list.moveSelectedItemRight();

  verifyLayout(
    list.rows,
    createRoot([createItem("First", [createItem("Second")])])
  );
});

it("moving item to the left should not change selected item", () => {
  const list = new List(
    createRoot([
      createItem("First", [createItem("First.1"), createItem("First.2")]),
      createItem("Second"),
    ])
  );

  list.selectNextItem();
  expect(list.getSelectedItemRow().item.title).toBe("First.1");
  list.moveSelectedItemLeft();

  verifyLayout(
    list.rows,
    createRoot([
      createItem("First", [createItem("First.2")]),
      createItem("First.1"),
      createItem("Second"),
    ])
  );
  expect(list.getSelectedItemRow().item.title).toBe("First.1");
});
