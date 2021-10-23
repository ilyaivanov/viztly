import { engine } from "./infra/animations";
import { Canvas } from "./infra/canvas";
import initialState from "./initialState";
import drawItemRow from "./list/drawItem";
import { drawInputFor } from "./list/itemInput";
import { List } from "./list/list";
import Scrollbar from "./list/scrollbar";

const canvas = new Canvas();

const data = localStorage.getItem("items:v1");

const SHOULD_READ_LOCALSTORAGE = true;

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

const render = () => {
  canvas.clear();
  list.rows.forEach((view) => drawItemRow(view, canvas));
  scrollbar.draw();
};

document.addEventListener("keydown", (e) => {
  if (e.code === "ArrowRight" && e.altKey && e.shiftKey) {
    list.moveSelectedItemRight();
  } else if (e.code === "ArrowLeft" && e.altKey && e.shiftKey) {
    list.moveSelectedItemLeft();
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
