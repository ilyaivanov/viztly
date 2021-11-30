import { animatePosition, spring } from "../src/infra/animations";
import { difference } from "../src/infra/set";
import { hasChildren, Item, Tree } from "./core";

export type ItemView = {
  item: Item;
  position: Point;
  textPosition: Point;
  color: string;
  circleRadius: number;
  isCircleEmpty: boolean;
  opacity: number;
  isRemoving?: boolean;
};

export type ItemViewList = {
  items: Map<Item, ItemView>;
};

export const forEachView = (
  list: ItemViewList,
  action: (view: ItemView) => void
) => {
  list.items.forEach(action);
};

export const getViews = (list: ItemViewList): ItemView[] =>
  Array.from(list.items.values());

let itemsCreated = 0;
const createItem = (item: Item, offset: number, level: number): ItemView => {
  const color = item.isSelected ? c.textSelected : c.textRegular;
  itemsCreated += 1;
  const view: ItemView = {
    item: item,
    position: zeroPoint(),
    textPosition: zeroPoint(),
    circleRadius: 3.4,
    isCircleEmpty: !hasChildren(item),
    color,
    opacity: 1,
  };
  setPosition(view, (level + 1) * sp.xStep, offset);
  return view;
};

const setPosition = (view: ItemView, x: number, y: number) => {
  //initially no animations
  if (view.position.x == 0 && view.position.y == 0) {
    view.position.x = x;
    view.position.y = y;
    view.textPosition.x = x + 10;
    view.textPosition.y = y + 0.32 * sp.fontSize;
  } else {
    animatePosition(view.position, x, y);
    animatePosition(view.textPosition, x + 10, y + 0.32 * sp.fontSize);
  }
};

export const traverseOpenViews = (
  { root }: Tree,
  action: (item: Item, offset: number, level: number) => void
) => {
  let offset = 0;
  const traverseChildren = (parent: Item, level: number) => {
    parent.isOpen &&
      parent.children.forEach((item) => {
        offset += sp.yStep;
        action(item, offset, level);
        traverseChildren(item, level + 1);
      });
  };

  traverseChildren(root, 0);
};

export const createList = (tree: Tree): ItemViewList => {
  const items = new Map<Item, ItemView>();

  traverseOpenViews(tree, (item, offset, level) =>
    items.set(item, createItem(item, offset, level))
  );

  return { items };
};

export const updateList = (list: ItemViewList, tree: Tree) => {
  const itemsShown = new Set<Item>();
  traverseOpenViews(tree, (item, xOffset, level) => {
    itemsShown.add(item);
    const view = list.items.get(item);
    if (view) {
      //might be removing here
      view.color = item.isSelected ? c.textSelected : c.textRegular;
      if (xOffset !== view.position.x) {
        spring(view.position.y, xOffset, (v) => {
          view.position.y = v;
          view.textPosition.y = v + 0.32 * sp.fontSize;
        });
      }
    } else {
      //enter animations
      const view = createItem(item, xOffset, level);
      list.items.set(item, view);
      view.opacity = 0;
      spring(0, 100, (v) => {
        view.opacity = v / 100;
      });
    }
  });

  //exit animations
  const allItems = new Set(list.items.keys());
  const itemsToRemove = difference(allItems, itemsShown);
  itemsToRemove.forEach((i) => {
    const view: ItemView | undefined = list.items.get(i);
    if (view && !view.isRemoving) {
      view.isRemoving = true;

      const starting = view.position.x;
      spring(view.position.x, 0, (v, isDone) => {
        view.position.x = v;
        view.textPosition.x = v + 10;
        view.opacity = Math.max(v / starting, 0);
        if (isDone) {
          list.items.delete(i);
        }
      });
    }
  });
};

//DESIGN SYSTEM
export const sp = {
  yStep: 22,
  xStep: 20,
  fontSize: 14,
};

export const c = {
  textRegular: "white",
  textSelected: "#ACE854",
};

//POINT
type Point = {
  x: number;
  y: number;
};

const isEqual = (p: Point, p2: Point) => p.x === p2.x && p.y === p2.y;
const zeroPoint = (): Point => ({ x: 0, y: 0 });
