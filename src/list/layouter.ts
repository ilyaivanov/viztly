import { spacings } from "../designSystem";
import { flattenItemChildren } from "../itemTree";
import ItemRow from "./ItemRow";

export const createRows = (
  root: Item,
  startingYOffset = spacings.yBase,
  startingLevel = 0
): ItemRow[] => {
  let offset = startingYOffset;
  let isFirstItem = true;
  const createRow = (item: Item, lvl: number): ItemRow => {
    const level = lvl + startingLevel;
    const halfOfHeight =
      level === 0 ? spacings.zeroLevelItemHeight / 2 : spacings.itemHeight / 2;

    if (!isFirstItem) offset += halfOfHeight;

    isFirstItem = false;

    const res = new ItemRow(item, level, offset);
    offset += halfOfHeight;
    return res;
  };
  return flattenItemChildren(root, createRow);
};
