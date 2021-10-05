import { spacings } from "../designSystem";
import { List } from "./list";

const { yBase, level1ItemHeight } = spacings;

it("Having three items at level 1 should have proper y coordinates", () => {
  const list = new List(
    createRoot([createItem("First"), createItem("Second"), createItem("Third")])
  );

  expect(list.rows[0].position.y).toBe(yBase);
  expect(list.rows[1].position.y).toBe(yBase + level1ItemHeight);
  expect(list.rows[2].position.y).toBe(yBase + level1ItemHeight * 2);
});

//
//
//
//
//
//
//
//
//
// Domain utilities
export const createItem = (title: string, children: Item[] = []): Item => ({
  title,
  isOpen: true,
  children,
});

export const createRoot = (children: Item[] = []): Item =>
  createItem("Home", children);
