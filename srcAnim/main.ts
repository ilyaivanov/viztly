import { createItem, createRoot, list } from "../src/domain/items";
import {
  forEachOpenChild,
  getItemAbove,
  getItemBelow,
} from "../src/domain/tree.traversal";
import { canvas, engine } from "../src/infra";
import { animatePosition } from "../src/infra/animations";
import { sp } from "../src/view/design";
import { createItemView, setItemViewPosition } from "./itemView";

const el = canvas.createFullscreenCanvas();

el.style.display = "block";
document.body.appendChild(el);

document.body.style.margin = 0 + "";
document.body.style.backgroundColor = "#1e1e1e";

// TREE
type Tree = {
  root: Item;
  selectedItem: Item | undefined;
};

const createTree = (root: Item): Tree => {
  return {
    root,
    selectedItem: root.children[0],
  };
};
const tree = createTree(
  createRoot([
    createItem("Item 1", list("Item 1.", 10)),
    createItem("Item 2"),
    createItem("Item 3", list("Item 3.", 5)),
    createItem("Item 4"),
    createItem("Item 5"),
  ])
);
const globalApp = {};

//actions
const selectNextItem = (tree: Tree): MyEvent | undefined =>
  changeSelection(tree, getItemBelow);

const selectPreviousItem = (tree: Tree): MyEvent | undefined =>
  changeSelection(tree, getItemAbove);

const changeSelection = (
  tree: Tree,
  getNextItem: F2<Item, Item | undefined>
): MyEvent | undefined => {
  if (tree.selectedItem) {
    const previousItem = tree.selectedItem;
    const itemSelected = getNextItem(tree.selectedItem);
    if (itemSelected) {
      tree.selectedItem = itemSelected;
      return { type: "selection-changed", itemSelected, previousItem };
    }
  }
};

const closeItem = (item: Item): MyEvent | undefined => {
  item.isOpen = false;

  return {
    type: "item-toggled",
    item,
  };
};
const openItem = (item: Item): MyEvent | undefined => {
  item.isOpen = true;
  return {
    type: "item-toggled",
    item,
  };
};

type SelectionChanged = {
  type: "selection-changed";
  previousItem: Item;
  itemSelected: Item;
};
type ItemToggled = {
  type: "item-toggled";
  item: Item;
};

type MyEvent = SelectionChanged | ItemToggled;

// VIEWS
type TreeView = {
  views: Views;
  itemsToViews: Map<Item, ItemView>;
};

const initView = (tree: Tree): TreeView => {
  const set: Views = new Set();
  const itemsToViews: Map<Item, ItemView> = new Map();

  const view: TreeView = { views: set, itemsToViews };

  return view;
};

const viewItem = (tree: Tree, item: Item, xStart: number, yStart: number) => {
  let yOffset = yStart;

  const step = (item: Item, level: number) => {
    const x = level * sp.xStep + xStart;
    const isSelected = tree.selectedItem == item;
    const itemView = createItemView(item, isSelected, x, yOffset);
    view.views.add(itemView.circle);
    view.views.add(itemView.text);
    view.itemsToViews.set(item, itemView);
    yOffset += sp.yStep;
    if (item.isOpen && item.children.length > 0)
      item.children.forEach((c) => step(c, level + 1));
  };

  item.children.forEach((c) => step(c, 0));
};

const dispatchEvent = (event: MyEvent) => {
  if (event.type === "selection-changed") {
    view.itemsToViews.get(event.previousItem)!.circle.color = "white";
    view.itemsToViews.get(event.previousItem)!.text.color = "white";

    view.itemsToViews.get(event.itemSelected)!.circle.color = sp.selectedCircle;
    view.itemsToViews.get(event.itemSelected)!.text.color = sp.selectedCircle;
  } else if (event.type === "item-toggled") {
    if (event.item.isOpen) {
      const itemView = view.itemsToViews.get(event.item);
      if (itemView) {
        viewItem(
          tree,
          event.item,
          itemView.circle.x + sp.xStep,
          itemView.circle.y + sp.yStep
        );
        updatePositions(tree);
      }
    } else {
      const removeAllItemViews = (item: Item) => {
        const itemView = view.itemsToViews.get(item);
        if (itemView) {
          Object.values(itemView).forEach((shape) => view.views.delete(shape));
          view.itemsToViews.delete(item);
        }
      };
      forEachOpenChild(event.item, removeAllItemViews);
      updatePositions(tree);
    }
  }
};
const updatePositions = (tree: Tree) => {
  let yOffset = sp.start;

  const step = (item: Item, level: number) => {
    const x = level * sp.xStep + sp.start;
    const itemView = view.itemsToViews.get(item);

    if (itemView) setItemViewPosition(itemView, x, yOffset);

    yOffset += sp.yStep;
    if (item.isOpen && item.children.length > 0)
      item.children.forEach((c) => step(c, level + 1));
  };

  tree.root.children.forEach((c) => step(c, 0));
};

const view = initView(tree);
viewItem(tree, tree.root, sp.start, sp.start);
const render = () => {
  canvas.clear();
  canvas.setTranslation(0, 0);
  view.views.forEach(canvas.drawShape);
};

document.addEventListener("keydown", (e) => {
  const code = e.code as KeyboardKey;
  if (code === "ArrowDown") {
    const e = selectNextItem(tree);
    if (e) dispatchEvent(e);
  } else if (code === "ArrowUp") {
    const e = selectPreviousItem(tree);
    if (e) dispatchEvent(e);
  } else if (code === "ArrowLeft") {
    const e = closeItem(tree.selectedItem!);
    if (e) dispatchEvent(e);
  } else if (code === "ArrowRight") {
    const e = openItem(tree.selectedItem!);
    if (e) dispatchEvent(e);
  }
  render();
});

canvas.addEventListener("resize", render);

engine.onTick = render;
render();
