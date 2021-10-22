import { createItem, createRoot } from "../../itemTree";
import { List } from "../list";
import { verifyRowsLayout as verifyLayout } from "./layoutCheck";

fit("having two items moving second item right moves it inside first", () => {
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
