import { c, spacings } from "../designSystem";
import { flattenItemChildren } from "../itemTree";
import { ItemRow } from "./list";

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

    const res: ItemRow = createRowItem(item, level, offset);
    offset += halfOfHeight;
    return res;
  };
  return flattenItemChildren(root, createRow);
};

export const createRowItem = (
  item: Item,
  level: number,
  y: number
): ItemRow => ({
  item,
  level,
  childrenHeight: getChildrenHeight(item),
  position: { x: spacings.xBase + level * spacings.xStep, y },
  color: c.text,
  childrenColor: c.line,
});

// assumes all children are below level 0
const getChildrenHeight = (item: Item): number =>
  flattenItemChildren(item, () => spacings.itemHeight).reduce(
    (sum, val) => sum + val,
    0
  );
