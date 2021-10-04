import { createItem } from "../../store";
import { FlatednedList } from "../FlatednedList";

it("creating a new item adds that item after selected and changes selection", () => {
  let list = createFlatList([createItem("First"), createItem("Second")]);

  const itemView = list.createNewItemAfterSelected();

  itemView.item.title = "new item";

  const expectedItems = ["First", "new item", "Second"];

  expect(list.visibleItems.map((v) => v.item.title)).toEqual(expectedItems);
  expect(list.selectedItemIndex).toBe(1);
});

it("creating a new item adds that item after selected and changes selection", () => {
  let list = createFlatList([
    createItem("First", [createItem("First.1")]),
    createItem("Second"),
  ]);

  const itemView = list.createNewItemAfterSelected();

  itemView.item.title = "new item";

  expect(list.visibleItems[0].item.children.map((c) => c.title)).toEqual([
    "new item",
    "First.1",
  ]);
});

const createFlatList = (children: Item[]) =>
  new FlatednedList(createItem("Home", children));
