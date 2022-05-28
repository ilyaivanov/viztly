import { MyCanvas } from "./canvas";

export let globalCanvas: MyCanvas;

export const setGlobalCanvas = (canvas: MyCanvas) => {
  globalCanvas = canvas;
};
