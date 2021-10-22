import { spacings } from "../../designSystem";
import { createItem, createRoot } from "../../itemTree";
import { List } from "../list";
import { createRootWith } from "./itemCreation";
import { verifyRowsLayout } from "./layoutCheck";

it("having one child closing item removes rows and marks it as closed", () => {
  const list = new List(
    createRoot([
      createItem("First", [createItem("First.1")]),
      createItem("Second"),
    ])
  );

  list.closeSelectedItem();

  verifyRowsLayout(list.rows, createRootWith("First", "Second"));
});

describe("having a nested items", () => {
  let list: List;
  beforeEach(() => {
    list = new List(
      createRoot([
        createItem("First", [
          createItem("First.1", [
            createItem("First.1.1"),
            createItem("First.1.2"),
          ]),
          createItem("First.2"),
        ]),
        createItem("Second"),
      ])
    );
  });

  describe("closing First.1 item", () => {
    beforeEach(() => {
      list.selectNextItem();
      list.closeSelectedItem();
    });

    it("removes First.1 children", () => {
      verifyRowsLayout(
        list.rows,
        createRoot([
          createItem("First", [createItem("First.1"), createItem("First.2")]),
          createItem("Second"),
        ])
      );
    });

    it("childrenHeight for that parent", () => {
      expect(list.rows[0].childrenHeight).toBe(spacings.itemHeight * 2);
    });

    describe("opening First.1 item", () => {
      beforeEach(() => list.openSelectedItem());

      it("places them in a correct position", () => {
        verifyRowsLayout(
          list.rows,
          createRoot([
            createItem("First", [
              createItem("First.1", [
                createItem("First.1.1"),
                createItem("First.1.2"),
              ]),
              createItem("First.2"),
            ]),
            createItem("Second"),
          ])
        );
      });
    });
  });
});
