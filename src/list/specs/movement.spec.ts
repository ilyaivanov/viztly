import {
  createItem,
  createRoot,
  moveItemDown,
  moveItemRight,
  moveItemUp,
} from "../../itemTree";
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

it("moving item right places it to the end of previous item", () => {
  const root = createRoot([
    createItem("1", [createItem("1.1")]),
    createItem("2"),
  ]);
  const res = moveItemRight(root, root.children[1]);

  expect(res).toEqual(
    createRoot([createItem("1", [createItem("1.1"), createItem("2")])])
  );
});

it("moving up replaces it with the item above", () => {
  const root = createRoot([createItem("1"), createItem("2")]);
  const res = moveItemUp(root, root.children[1]);

  expect(res).toEqual(createRoot([createItem("2"), createItem("1")]));
});

it("moving down replaces it with the item below", () => {
  const root = createRoot([createItem("1"), createItem("2")]);
  const res = moveItemDown(root, root.children[0]);

  expect(res).toEqual(createRoot([createItem("2"), createItem("1")]));
});
