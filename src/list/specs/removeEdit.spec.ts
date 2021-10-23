import { createItem, createRoot } from "../../itemTree";
import { List } from "../list";
import { createItems, createRootWith } from "./itemCreation";
import { verifyRowsLayout } from "./layoutCheck";

describe("having four items", () => {
  let list: List;

  beforeEach(() => {
    list = new List(
      createRoot([
        createItem("First"),
        createItem("Second", [createItem("sub")]),
        createItem("Third"),
      ])
    );
  });

  describe("while Second is removed", () => {
    beforeEach(() => {
      list.selectNextItem();
      list.removeSelectedItem();
    });

    it("removes Second from rows", () => {
      verifyRowsLayout(list.rows, createRootWith("First", "Third"));
    });
  });

  describe("while sub is removed", () => {
    beforeEach(() => {
      list.selectNextItem();
      list.selectNextItem();
      list.removeSelectedItem();
    });

    it("updates children height for Second", () => {
      verifyRowsLayout(list.rows, createRootWith("First", "Second", "Third"));
    });
  });

  describe("while Third is removed", () => {
    beforeEach(() => {
      list.selectNextItem();
      list.selectNextItem();
      list.selectNextItem();
      list.removeSelectedItem();
    });

    it("removes last item list ", () => {
      verifyRowsLayout(
        list.rows,
        createRoot([
          createItem("First"),
          createItem("Second", [createItem("sub")]),
        ])
      );
    });
  });
});

describe("Creating new item", () => {
  it("add another one with the same position as current second item", () => {
    const list = new List(
      createRoot([createItem("First"), createItem("Second")])
    );

    list.createNewItemAfterSelected();

    verifyRowsLayout(
      list.rows,
      createRoot([createItem("First"), createItem(""), createItem("Second")])
    );

    expect(list.getSelectedItemRow().item.title).toBe("");
  });

  it("when item is open new item is being added as first child", () => {
    const list = new List(
      createRoot([
        createItem("First", [createItem("First.1")]),
        createItem("Second"),
      ])
    );

    list.createNewItemAfterSelected();

    verifyRowsLayout(
      list.rows,
      createRoot([
        createItem("First", createItems("", "First.1")),
        createItem("Second"),
      ])
    );
  });
});
