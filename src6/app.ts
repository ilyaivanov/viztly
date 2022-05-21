import { goDown, goLeft, goRight, goUp, on, Tree } from "../src/tree";
import { forEachOpenChild } from "../src/tree/tree.traversal";
import { draw } from "../src/view/tree/itemView";
import { appendToOffset } from "../src/view/tree/minimap";
import { AnimatedNumber } from "./animations/animatedNumber";
import { MyCanvas } from "./canvas";
import theme, { toggleTheme } from "./theme";

class ItemView {
  x: AnimatedNumber;
  y: AnimatedNumber;
  opacity = new AnimatedNumber(1);
  constructor(circleX: number, circleY: number, private item: Item) {
    this.x = new AnimatedNumber(circleX);
    this.y = new AnimatedNumber(circleY);
  }

  //hotpath
  draw(canvas: MyCanvas, tree: Tree) {
    const { item } = this;
    const x = this.x.current;
    const y = this.y.current;

    const isSelected = tree.selectedItem === item;
    const textColor = (
      isSelected ? theme.selectedColor : theme.textColor
    ).getHexColor();
    const circleColor = (
      isSelected ? theme.selectedColor : theme.circleColor
    ).getHexColor();

    const r = theme.outlineCircleR;
    const lineWidth = theme.outlineCircleLineWidth;

    canvas.context.globalAlpha = this.opacity.current;
    if (!item.isOpen && item.children.length > 0)
      canvas.fillCircle(x, y, r + lineWidth / 2, circleColor);
    else canvas.outlineCircle(x, y, r, lineWidth, circleColor);

    const textX = x + theme.textToCircleDistance + theme.outlineCircleR + 1;
    canvas.fillTextAtMiddle(textX, y + 1.5, item.title, textColor);
    canvas.context.globalAlpha = 1;
  }

  removeViaTransparency(parentY: number, cb: () => void) {
    this.opacity.switchTo(0);

    //I'm choosing here listening to coordinate animation, since it happens longer than opacity
    //but I need to think about animation orchestration
    this.y.switchTo(parentY, cb);
  }

  appearViaTransparency(parentY: number) {
    this.opacity = new AnimatedNumber(0);
    this.opacity.switchTo(1);
    const target = this.y.current;
    this.y = new AnimatedNumber(parentY);
    this.y.switchTo(target);
  }
}

export class App {
  private views: Map<Item, ItemView> = new Map();
  constructor(public canvas: MyCanvas, public tree: Tree) {
    const { children } = this.tree.root;
    if (children) {
      traverseItems(children, getLeftOffest(), theme.yStart, this.createView);
    }

    on("item-toggled", this.onItemToggled);
  }

  onItemToggled = (item: Item) => {
    traverseItems(
      this.tree.root.children,
      getLeftOffest(),
      theme.yStart,
      (item, x, y) => {
        const view = this.views.get(item);
        if (view && (view.x.target !== x || view.y.target !== y)) {
          view.x.switchTo(x);
          view.y.switchTo(y);
        }
      }
    );

    const parentView = this.views.get(item);
    if (parentView) {
      if (item.isOpen) {
        traverseItems(
          item.children,
          parentView.x.target + theme.xStep,
          parentView.y.target + theme.yStep,
          (item, x, y) => {
            const view = this.createView(item, x, y);
            view.appearViaTransparency(parentView.y.current);
          }
        );
      } else {
        forEachOpenChild(item, (child) => {
          const view = this.views.get(child);
          if (view) {
            view.removeViaTransparency(parentView.y.current, () => {
              console.log("deleting");
              this.views.delete(child);
            });
          }
        });
      }
    }
  };

  private createView = (item: Item, x: number, y: number) => {
    const view = new ItemView(x, y, item);
    this.views.set(item, view);
    return view;
  };

  draw() {
    const ctx = this.canvas;
    ctx.clearRect(theme.backgroundColor.getHexColor());

    for (const view of this.views.values()) {
      view.draw(ctx, this.tree);
    }
  }

  handleKey(e: KeyboardEvent) {
    if (e.code === "ArrowDown") {
      goDown();
    } else if (e.code === "ArrowUp") {
      goUp();
    } else if (e.code === "ArrowLeft") {
      goLeft();
    } else if (e.code === "ArrowRight") {
      goRight();
    } else if (e.code === "Space") {
      toggleTheme();
    }
  }
}

const getLeftOffest = () =>
  Math.max((window.innerWidth - 800) / 2, theme.xStart);

// Layouter for the tree
const traverseItems = (
  items: Item[],
  x: number,
  y: number,
  fn: A3<Item, number, number>
): number =>
  items.reduce((totalHeight, child) => {
    const cy = y + totalHeight;
    fn(child, x, cy);

    return (
      totalHeight +
      theme.yStep +
      (hasVisibleChildren(child)
        ? child.view === "tree"
          ? traverseItemsDeeper(child.children, x, cy, fn)
          : renderBoardChildren(child.children, x, cy, fn)
        : 0)
    );
  }, 0);

const traverseItemsDeeper = (
  items: Item[],
  x: number,
  y: number,
  fn: A3<Item, number, number>
) => traverseItems(items, x + theme.xStep, y + theme.yStep, fn);

const hasVisibleChildren = (item: Item) =>
  item.isOpen && item.children.length > 0;

const renderBoardChildren = (
  items: Item[],
  x: number,
  y: number,
  fn: A3<Item, number, number>
) => {
  let maxHeight = 0;
  let xOffset = 0;
  const viewY = y + theme.yStep * 2;

  let viewX = x + theme.xStep;
  items.forEach((child) => {
    fn(child, viewX, viewY);

    xOffset = 200; //canvas.getTextWidth(child.title, theme.fontSize);

    if (hasVisibleChildren(child)) {
      const subtreeHeight = traverseItemsDeeper(
        child.children,
        viewX,
        viewY,
        (item, x, y) => {
          const textWidth = 200; //canvas.getTextWidth(item.title, theme.fontSize);
          xOffset = Math.max(xOffset, x - viewX + textWidth);
          fn(item, x, y);
        }
      );
      maxHeight = Math.max(subtreeHeight, maxHeight);
    }
    viewX += xOffset + 30;
  });
  return theme.yStep * 2.5 + maxHeight;
};
