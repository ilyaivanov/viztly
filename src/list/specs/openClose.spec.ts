import { c, spacings } from "../../designSystem";
import { createItem, createRoot } from "../../itemTree";
import { List } from "../list";

const { yBase, zeroLevelItemHeight } = spacings;

it("Having three items at level 1 should have proper y coordinates", () => {
  const list = new List(
    createRoot([createItem("First"), createItem("Second"), createItem("Third")])
  );

  expect(list.rows[0].position.y).toBe(yBase);
  expect(list.rows[1].position.y).toBe(yBase + zeroLevelItemHeight);
  expect(list.rows[2].position.y).toBe(yBase + zeroLevelItemHeight * 2);
});

//open close tests

it("having one child closing item removes rows and marks it as closed", () => {
  const list = new List(
    createRoot([
      createItem("First", [createItem("First.1")]),
      createItem("Second"),
    ])
  );

  list.closeSelectedItem();

  expect(list.rows.map((r) => r.item.title)).toEqual(["First", "Second"]);
  expect(list.rows[0].position.y).toBe(yBase);
  expect(list.rows[0].childrenHeight).toBe(0);

  expect(list.rows[1].position.y).toBe(yBase + zeroLevelItemHeight);
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

    it("childrenHeight for that parent", () => {
      expect(list.rows[0].childrenHeight).toBe(spacings.itemHeight * 2);
    });

    describe("opening First.1 item", () => {
      beforeEach(() => list.openSelectedItem());

      it("adds items to the flatlist", () => {
        const expectedItems = [
          "First",
          "First.1",
          "First.1.1",
          "First.1.2",
          "First.2",
          "Second",
        ];
        expect(list.rows.map((r) => r.item.title)).toEqual(expectedItems);
      });

      it("places them in a correct position", () => {
        // todo: figure out better positioning system for testing
        expect(list.rows[2].position.y).toBe(87);
        expect(list.rows[3].position.y).toBe(109);
        expect(list.rows[4].position.y).toBe(131);
      });

      it("updates First item children height", () => {
        expect(list.rows[0].childrenHeight).toBe(spacings.itemHeight * 4);
      });
    });
  });
});
