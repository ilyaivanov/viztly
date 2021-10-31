import { engine } from "./infra/animations";
import { Canvas } from "./infra/canvas";
import initialState from "./initialState";
import { drawInputFor, updateInputCoordinates } from "./list/itemInput";
import { List } from "./list/list";
import Scrollbar from "./list/scrollbar";

import { draw } from "./list/header";
import { spacings } from "./designSystem";
import { findParent, getPath, isRoot } from "./itemTree";

const canvas = new Canvas();

const data = localStorage.getItem("items:v1");

const SHOULD_READ_LOCALSTORAGE = false;

const list = new List(
  data && SHOULD_READ_LOCALSTORAGE ? JSON.parse(data) : initialState
);

const save = () => {
  if (SHOULD_READ_LOCALSTORAGE)
    localStorage.setItem("items:v1", JSON.stringify(list.root));
};

const scrollbar = new Scrollbar(canvas, list);

canvas.onResize = () => {
  scrollbar.translateCanvas();
  render();
};

let yFocusTranslation = 0;
let xFocusTranslation = 0;
const render = () => {
  canvas.clear();
  canvas.setTranslation(
    -xFocusTranslation,
    -scrollbar.transformY - yFocusTranslation
  );

  list.rows.forEach((view) => view.draw(canvas));

  canvas.setTranslation(0, 0);
  scrollbar.draw();

  // draw(canvas, list);
  updateInputCoordinates(list.getSelectedItemRow(), scrollbar);
};

document.addEventListener("keydown", (e) => {
  if (
    (e.code === "ArrowLeft" && e.altKey && e.shiftKey) ||
    (e.code === "Tab" && e.shiftKey)
  ) {
    e.preventDefault();
    list.moveSelectedItemLeft();
  } else if (
    (e.code === "ArrowRight" && e.altKey && e.shiftKey) ||
    e.code === "Tab"
  ) {
    e.preventDefault();
    list.moveSelectedItemRight();
  } else if (e.code === "ArrowRight" && e.altKey) {
    scrollbar.transformY = 0;
    list.setFocus(list.getSelectedItemRow().item);
    e.preventDefault();
  } else if (e.code === "ArrowLeft" && e.altKey) {
    if (!isRoot(list.itemFocused)) {
      const parent = findParent(list.root, list.itemFocused);
      if (parent) {
        list.setFocus(parent);
      }
      e.preventDefault();
    }
  } else if (e.code === "ArrowUp" && e.altKey && e.shiftKey) {
    list.moveSelectedItemUp();
  } else if (e.code === "ArrowDown" && e.altKey && e.shiftKey) {
    list.moveSelectedItemDown();
  } else if (e.code === "ArrowDown") list.selectNextItem();
  else if (e.code === "ArrowUp") list.selectPreviousItem();
  else if (e.code === "ArrowLeft") {
    if (list.getSelectedItemRow().item.isOpen) list.closeSelectedItem();
    else list.selectParentItem();
  } else if (e.code === "ArrowRight") {
    if (list.getSelectedItemRow().item.isOpen) list.selectNextItem();
    else list.openSelectedItem();
  } else if (e.code === "Enter") {
    list.createNewItemAfterSelected();
    drawInputFor(list.getSelectedItemRow(), scrollbar, render);
  } else if (e.code === "KeyE") {
    drawInputFor(list.getSelectedItemRow(), scrollbar, render);

    //this prevents setting 'e' character as first chart
    e.preventDefault();
  } else if (e.code === "Backspace" && e.altKey && e.shiftKey)
    list.removeSelectedItem();

  if (!scrollbar.isYPointOnScreen(list.getSelectedItemRow().position.y))
    scrollbar.centerScrollOn(list.getSelectedItemRow().position.y);

  save();
  render();
});

document.addEventListener("wheel", (e) => {
  scrollbar.translateBy(e.deltaY);
  render();
});

render();
document.body.appendChild(canvas.el);

engine.onTick = render;
