import { sp } from "../design";
import * as tree from "../tree";
import { canvasOffset } from "./minimap";

let input: HTMLInputElement | undefined;

export const isEditing = () => !!input;
export const getValue = () => input?.value;

let onBlurHandlers: (() => void)[] = [];
export const addEventListener = (event: "onInputBlur", cb: () => void) => {
  if (event === "onInputBlur") onBlurHandlers.push(cb);
};

const onBlur = () => {
  onBlurHandlers.forEach((cb) => cb());
  finishEdit();
};

export const finishEdit = () => {
  if (input) {
    input.removeEventListener("blur", onBlur);
    input.remove();
    tree.finishEdit(input.value);
    input = undefined;
  }
};

export const renderInputAt = (x: number, y: number, title: string) => {
  input = document.createElement("input");
  input.autocomplete = "off";
  input.id = "main-input";
  setInputCoords(input, x, y);
  input.style.color = sp.selectedCircle;
  input.value = title;

  input.addEventListener("blur", onBlur);
  document.body.appendChild(input);
  input.focus();
  input.setSelectionRange(0, 0);
};

export const updateInputCoords = (x: number, y: number) => {
  if (input) setInputCoords(input, x, y);
};

const setInputCoords = (input: HTMLInputElement, x: number, y: number) => {
  const inputX = x + sp.circleToTextDistance;
  const inputY = y - sp.fontSize * 0.32 * 2.5 - canvasOffset;
  input.style.left = inputX + "px";
  input.style.top = inputY + "px";
};
