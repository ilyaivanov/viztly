import { MyCanvas } from "./canvas";
import { layoutChildren } from "./tree.layouter";
import * as t from "./types";

import { colors, rotateAccentTheme, rotateTheme } from "./colors";
import { initSidebar, toggleVisible } from "./devSidebar";
import {
  forEachOpenChild,
  goDown,
  goLeft,
  goRight,
  goUp,
  on,
  selectNextSibling,
  selectPreviousSibling,
} from "./treeLogic";
import {
  createView,
  moveTo,
  fadeIn,
  fadeOut,
  viewItem,
} from "./views/viewItem";

import { drawGrid } from "./views/grid";
import { loadItems } from "./persistance";

import { engine } from "./animations/engine";

const canva = new MyCanvas();
document.body.appendChild(canva.el);

class App {
  views = new Map<t.Item, t.ItemView>();

  constructor(public tree: t.Tree) {
    this.renderChildren();
  }

  updatePositions = () => {
    on("item-toggled", this.onItemToggled);
    // this.views.clear();
    // this.renderChildren();
  };

  addView = (item: t.Item, gridX: number, gridY: number) => {
    const view = createView(item, gridX, gridY);
    this.views.set(item, view);
    return view;
  };

  animatePosition = (item: t.Item, gridX: number, gridY: number) => {
    const view = this.views.get(item);

    if (view) moveTo(view, gridX, gridY);
  };

  addAndFadeIn = (item: t.Item, gridX: number, gridY: number) => {
    const view = this.addView(item, gridX, gridY);
    fadeIn(view);
  };

  animatePositions = () =>
    layoutChildren(
      this.tree.root,
      this.animatePosition,
      8,
      2,
      canva.getTextWidth
    );

  onItemToggled = (item: t.Item) => {
    if (!item.isOpen) {
      this.animatePositions();

      forEachOpenChild(item, (child) => {
        const view = this.views.get(child);

        if (view) fadeOut(view);
      });
    } else {
      this.animatePositions();

      const view = this.views.get(item);
      if (view) {
        layoutChildren(
          item,
          this.addAndFadeIn,
          view.gridX + 1,
          view.gridY + 1,
          canva.getTextWidth
        );
      }
    }
  };

  renderChildren = () => {
    const { root } = this.tree;

    layoutChildren(root, this.addView, 8, 2, canva.getTextWidth);
  };

  draw = () => {
    canva.clearRect(colors.background.getHexColor());
    drawGrid();

    for (const [item, view] of this.views) {
      const parentView = item.parent ? this.views.get(item.parent) : undefined;

      viewItem(item, view, this.tree.selectedItem == item, parentView);
    }
  };
}

const tree: t.Tree = loadItems();

const app = new App(tree);

initSidebar(() => {
  app.renderChildren();
  app.draw();
});
app.draw();

engine.onTick = app.draw;

window.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    if (e.ctrlKey) rotateAccentTheme();
    else rotateTheme();
  } else if (e.code === "KeyD") {
    toggleVisible();
  } else if (e.code === "ArrowUp") {
    if (e.ctrlKey) selectPreviousSibling(tree);
    else goUp(tree);
  } else if (e.code === "ArrowDown") {
    if (e.ctrlKey) selectNextSibling(tree);
    else goDown(tree);
  } else if (e.code === "ArrowRight") {
    goRight(tree);
  } else if (e.code === "ArrowLeft") {
    goLeft(tree);
  }
  app.updatePositions();
  app.draw();
});
