import { sp } from "../design";
import { canvas } from "../infra";
import { springKeyed } from "../infra/animations";
import * as tree from "../tree";
import { createInput, removeInput, setCoords } from "./itemInput";
import { drawItemCircle } from "./itemView";
import { findLocalItems, LocalSearchResults, drawTextAt } from "./modal.text";

type ModalState = "hidden" | "showing" | "shown" | "hiding";
const state = "hidden" as ModalState;
const maxProgress = 200; //this affects physics animation speed
let options = {
  state,
  progress: 0, // 0 .. maxProgresss
  searchResults: undefined as LocalSearchResults | undefined,
  selectedItemIndex: 0,
};
let input: HTMLInputElement | undefined;

//TODO: stupid freaking design, need to think about better solution
let onChange: () => void;
export const setOnChange = (onRender: () => void) => {
  onChange = onRender;
};

export const isKeyboardCaptured = () =>
  options.state === "showing" || options.state === "shown";

export const show = () => {
  options.state = "showing";

  input = createInput();
  input.addEventListener("input", onInputChange);
  input.addEventListener("keydown", onInputKeyDown);
  input.style.border = `1px solid ${sp.lineSelected}`;
  input.style.backgroundColor = `#3C3C3C`;
  input.style.padding = "2px 4px";
  springKeyed(options, options.progress, maxProgress, (v, isDone) => {
    options.progress = v;
    if (isDone) options.state = "shown";
  });
};

export const hide = () => {
  options.state = "hiding";
  if (input) removeInput(input);

  springKeyed(options, options.progress, 0, (v, isDone) => {
    options.progress = v;
    if (isDone) {
      input = undefined;
      options.state = "hidden";
    }
  });
};

export const render = () => {
  if (options.state !== "hidden" && input) {
    const c = canvas.canvas;
    const ctx = c.ctx;
    const modalWidth = Math.min(c.width - 40, 500);

    const shift = (options.progress / maxProgress) * 20;
    const x = (c.width - modalWidth) / 2;
    const y = shift;

    const inputMargin = 10;
    setCoords(
      input,
      x + inputMargin,
      y + inputMargin,
      modalWidth - inputMargin * 2
    );

    ctx.shadowColor = "black";
    ctx.shadowBlur = 15;

    canvas.canvas.ctx.globalAlpha = options.progress / maxProgress;
    const modalHeight =
      (options.searchResults
        ? (options.searchResults.items.length + 1) * sp.yStep
        : 100) +
      15 +
      sp.circleR;
    canvas.drawRect(
      0,
      0,
      canvas.canvas.width,
      canvas.canvas.height,
      "rgba(0,0,0,0.5)"
    );
    canvas.drawRectRounded(x, y, modalWidth, modalHeight, 6, "#252526");
    ctx.shadowBlur = 0;

    if (options.searchResults) {
      options.searchResults.items.forEach((view, index) => {
        const itemX = x + 10 + sp.circleR + 5;
        const itemY = y + 50 + index * sp.yStep;
        drawItemCircle(itemX, itemY, view.item, view.isSelected);

        const textX = itemX + sp.circleToTextDistance;
        const textY = itemY + 0.32 * sp.fontSize;

        drawTextAt(textX, textY, view);
      });
    }
    canvas.canvas.ctx.globalAlpha = 1;
  }
};

export const onKeyDown = (e: KeyboardEvent) => {
  const code = e.code as KeyboardKey;
  if (code === "Escape") hide();
  else if (code === "Enter") focusOnSelectedItem();
  else if (code === "ArrowDown") selectNext();
  else if (code === "ArrowUp") selectPrevious();
};

const selectNext = () => {
  const { searchResults } = options;
  if (searchResults) {
    const items = searchResults.items;
    if (options.selectedItemIndex < items.length - 1) {
      items[options.selectedItemIndex].isSelected = false;
      options.selectedItemIndex += 1;
      items[options.selectedItemIndex].isSelected = true;
    }
  }
};

const selectPrevious = () => {
  const { searchResults } = options;
  if (searchResults) {
    const items = searchResults.items;
    if (options.selectedItemIndex > 0) {
      console.log(items[options.selectedItemIndex]);
      items[options.selectedItemIndex].isSelected = false;
      options.selectedItemIndex -= 1;
      items[options.selectedItemIndex].isSelected = true;
    }
  }
};

const focusOnSelectedItem = () => {
  if (options.searchResults) {
    const view = options.searchResults.items.find((view) => view.isSelected);
    if (view) {
      tree.focusOnItem(view.item);
      tree.selectItem(view.item);
      hide();
    }
  }
};

const onInputChange = () => {
  if (input && input.value) {
    options.searchResults = findLocalItems(tree.getRoot(), input!.value);
    options.selectedItemIndex = 0;
    if (options.searchResults.items[0])
      options.searchResults.items[0].isSelected = true;
    onChange && onChange();
  }
};
const onInputKeyDown = (e: KeyboardEvent) => {
  const code = e.code as KeyboardKey;
  if (code === "ArrowDown" || code == "ArrowUp") e.preventDefault();
};
