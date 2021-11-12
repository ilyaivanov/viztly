import { spring } from "../infra/animations";
import { Canvas } from "../infra/canvas";
import { create, drawInputAt, remove } from "./input";
import * as draw from "./draw";
import { drawTextAt, findLocalItems, LocalSearchEntry } from "./modal.text";
import { c } from "../designSystem";
import Tree from "../itemTree/tree";

const state = {
  isShown: false,
  progress: 0,
};

export const isShown = () => state.isShown;

export const hide = () => {
  spring(state.progress, 0, (v, finished) => {
    state.progress = v;
    if (finished) {
      remove();
      state.isShown = false;
    }
  });
};
let items: LocalSearchEntry[] = [];
export const showModal = (tree: Tree, draw: () => void) => {
  state.isShown = true;
  spring(state.progress, 100, (v) => {
    state.progress = v;
  });

  create((text) => {
    if (text) {
      items = findLocalItems(tree.root, text).items;
    } else {
      items = [];
    }
    draw();
  });
};

export const view = (canvas: Canvas) => {
  const progressNormalized = state.progress / 100;
  if (state.isShown) {
    canvas.ctx.fillStyle = `rgba(0,0,0,${progressNormalized * 0.3})`;
    canvas.ctx.fillRect(0, 0, canvas.width, canvas.height);
    canvas.ctx.globalAlpha = progressNormalized;

    const modalWidth = Math.min(canvas.width - 60, 480);
    const modalHeight = 400;

    const x = canvas.width / 2 - modalWidth / 2;
    const y =
      canvas.height / 2 - modalHeight / 2 + (1 - progressNormalized) * 40;
    draw.roundedRectangle(canvas.ctx, x, y, modalWidth, modalHeight, 10);

    canvas.ctx.filter = "drop-shadow(1px 1px 3px black)";
    canvas.ctx.fillStyle = `rgb(37,37,37)`;
    canvas.ctx.fill();
    canvas.ctx.filter = "none";

    const padding = 20;
    const inputX = x + padding;
    const inputY = y + padding + 1;
    const inputWidth = modalWidth - padding * 2;
    const inputHeight = 20;
    draw.roundedRectangle(
      canvas.ctx,
      inputX,
      inputY,
      inputWidth,
      inputHeight,
      2
    );
    canvas.ctx.fillStyle = `rgb(255,255,255)`;
    canvas.ctx.fill();

    drawInputAt(inputX + 5, inputY, inputHeight, inputWidth - 10);

    const base = 25;
    items.forEach((row, i) => {
      const y = inputY + inputHeight + base + 25 * i;
      drawTextAt(canvas, inputX, y, row);
    });

    canvas.ctx.globalAlpha = 1;
  }
};
