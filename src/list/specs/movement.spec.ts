import { spacings } from "../../designSystem";
import { createItem, createRoot } from "../../itemTree";
import { List } from "../list";

it("having two items moving second item right moves it inside first", () => {
  const list = new List(
    createRoot([createItem("First"), createItem("Second")])
  );

  list.selectNextItem();
  list.moveSelectedItemRight();

  expect(list.rows[1].position.x).toBe(spacings.xBase + spacings.xStep);
  expect(list.rows[0].item.children[0].title).toBe("Second");
});
