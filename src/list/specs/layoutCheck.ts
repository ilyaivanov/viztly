import { difference } from "../../infra/set";
import { createRows } from "../layouter";
import ItemRow from "../ItemRow";

export const verifyRowsLayout = (rows: ItemRow[], root: Item) => {
  const expectedRows = createRows(root);

  const givenTitles = new Set(rows.map((r) => r.item.title));
  const expectedTitles = new Set(expectedRows.map((r) => r.item.title));

  const missingRows = difference(expectedTitles, givenTitles);
  const redundantRows = difference(givenTitles, expectedTitles);

  if (missingRows.size > 0) {
    throw new Error(
      `Missing ${Array.from(missingRows.keys()).join(", ")} items`
    );
  }

  if (redundantRows.size > 0) {
    throw new Error(
      `Redundant ${Array.from(redundantRows.keys()).join(", ")} items`
    );
  }

  rows.forEach((row, index) => {
    matchRow(row, expectedRows[index], index);
  });
};

const matchRow = (given: ItemRow, expected: ItemRow, index: number) => {
  if (given.item.title !== expected.item.title) {
    throw new Error(
      `Rows at ${index} point to a different item. Given: ${given.item.title}. Expected: ${expected.item.title}`
    );
  }

  if (
    given.position.x !== expected.position.x &&
    given.position.y !== expected.position.y
  ) {
    throw new Error(
      `${given.item.title} have a wrong position. Given - x:${given.position.x}, y: ${given.position.y}. Expected - x:${expected.position.x}, y: ${expected.position.y}.`
    );
  }

  if (given.position.y !== expected.position.y) {
    const extraMessage =
      given.position.y < expected.position.y
        ? `Moved up by ${expected.position.y - given.position.y}.`
        : `Moved down by ${given.position.y - expected.position.y}.`;
    throw new Error(
      `${given.item.title} have a different Y coordiante. Given: ${given.position.y}. Expected: ${expected.position.y}. ${extraMessage}`
    );
  }
  if (given.position.x !== expected.position.x) {
    const extraMessage =
      given.position.x < expected.position.x
        ? `Moved left by ${expected.position.x - given.position.x}.`
        : `Moved right by ${given.position.x - expected.position.x}.`;
    throw new Error(
      `${given.item.title} have a different X coordiante. Given: ${given.position.x}. Expected: ${expected.position.x}. ${extraMessage}`
    );
  }
};
