import { sp } from "../design";
import { canvas } from "../infra";
import { springKeyed } from "../infra/animations";
import { getFocused, isSelected } from "../tree";
import { createInput, removeInput, setCoords } from "./itemInput";
import { draw, ItemView2 } from "./itemView";

type ModalState = "hidden" | "showing" | "shown" | "hiding";
const state = "hidden" as ModalState;
const maxProgress = 200; //this affects physics animation speed
let options = {
  state,
  progress: 0, // 0 .. maxProgresss
  items: [] as Item[],
  selected: undefined,
};
let input: HTMLInputElement | undefined;

export const isKeyboardCaptured = () =>
  options.state === "showing" || options.state === "shown";

export const show = () => {
  options.state = "showing";
  document.addEventListener("keydown", onKeyDown);

  input = createInput();
  input.addEventListener("input", onInputChange);
  input.style.border = `1px solid ${sp.lineSelected}`;
  input.style.backgroundColor = `#3C3C3C`;
  input.style.padding = "2px 4px";
  springKeyed(options, options.progress, maxProgress, (v, isDone) => {
    options.progress = v;
    if (isDone) options.state = "shown";
  });
};

export const hide = () => {
  document.removeEventListener("keydown", onKeyDown);
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

    const items = options.items.map((item, index) => ({
      item,
      x: x + 10 + sp.circleR + 5,
      y: y + 50 + index * sp.yStep,
      opacity: options.progress / maxProgress,
      targetY: 20,
    }));

    ctx.shadowColor = "black";
    ctx.shadowBlur = 15;

    canvas.canvas.ctx.globalAlpha = options.progress / maxProgress;

    const lastItem = items[items.length - 1];
    const modalHeight = (lastItem ? lastItem.y : 100) + 15 + sp.circleR;
    canvas.drawRectRounded(x, y, modalWidth, modalHeight, 6, "#252526");
    ctx.shadowBlur = 0;
    items.forEach((i) => draw(i, false));
    canvas.canvas.ctx.globalAlpha = 1;
  }
};

const onKeyDown = (e: KeyboardEvent) => {
  const code = e.code as KeyboardKey;
  if (code === "Escape") hide();
};

const onInputChange = () => {
  options.items = getFocused().children;
};
